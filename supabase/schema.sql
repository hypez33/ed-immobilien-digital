-- ======================================
-- Supabase Schema Setup für ED Immobilien
-- ======================================

-- Enum für Rollen
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Enum für Anfragen-Status
CREATE TYPE public.inquiry_status AS ENUM ('new', 'in_progress', 'done', 'archived');

-- ======================================
-- Profiles Tabelle
-- ======================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users können nur ihr eigenes Profil lesen
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users können nur ihr eigenes Profil updaten
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- ======================================
-- User Roles Tabelle
-- ======================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security Definer Funktion um Rollen zu prüfen (verhindert recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Admins können alle Rollen sehen
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Nur Admins können Rollen vergeben
CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ======================================
-- Inquiries (Anfragen) Tabelle
-- ======================================
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_or_anliegen TEXT NOT NULL,
  message TEXT NOT NULL,
  status inquiry_status DEFAULT 'new' NOT NULL,
  source TEXT,
  notes JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Anonyme Benutzer können Anfragen erstellen
CREATE POLICY "Anyone can create inquiries"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Nur Admins können Anfragen lesen
CREATE POLICY "Admins can view inquiries"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Nur Admins können Anfragen updaten
CREATE POLICY "Admins can update inquiries"
  ON public.inquiries FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Nur Admins können Anfragen löschen
CREATE POLICY "Admins can delete inquiries"
  ON public.inquiries FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ======================================
-- Listings (Immobilien) Tabelle
-- ======================================
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'wohnung', 'haus', 'gewerbe', 'grundstueck'
  status TEXT NOT NULL, -- 'zu_verkaufen', 'zu_vermieten', 'verkauft', 'vermietet'
  price INTEGER NOT NULL,
  price_suffix TEXT, -- '€', '€/Monat'
  area INTEGER NOT NULL, -- in m²
  rooms INTEGER NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  zip TEXT NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Öffentlich lesbar wenn published
CREATE POLICY "Public can view published listings"
  ON public.listings FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Admins sehen alle Listings
CREATE POLICY "Admins can view all listings"
  ON public.listings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Nur Admins können Listings erstellen
CREATE POLICY "Admins can create listings"
  ON public.listings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Nur Admins können Listings updaten
CREATE POLICY "Admins can update listings"
  ON public.listings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Nur Admins können Listings löschen
CREATE POLICY "Admins can delete listings"
  ON public.listings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ======================================
-- Auto-update updated_at trigger
-- ======================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_listings_update
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ======================================
-- Auto-create profile on signup
-- ======================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
