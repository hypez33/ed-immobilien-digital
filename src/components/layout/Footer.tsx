import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';

const services = [
  { name: 'Immobilie verkaufen', href: '/kontakt?anliegen=verkauf' },
  { name: 'Wohnung vermieten', href: '/kontakt?anliegen=vermietung' },
  { name: 'Kostenlose Bewertung', href: '/kontakt?anliegen=bewertung' },
];

const navigation = [
  { name: 'Startseite', href: '/' },
  { name: 'Immobilienangebote', href: '/immobilien' },
  { name: 'Über uns', href: '/ueber-uns' },
  { name: 'Kontakt', href: '/kontakt' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground relative">
      {/* Gold top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-light to-transparent" />

      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="container relative py-16 md:py-20">
        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          {/* Brand - Takes more space */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-cream flex items-center justify-center text-primary font-serif text-2xl">
                  ED
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gold" />
              </div>
              <div>
                <span className="font-serif text-2xl block text-cream">ED Immobilien</span>
                <span className="text-cream/50 text-xs uppercase tracking-[0.2em]">Rhein-Neckar-Kreis</span>
              </div>
            </div>
            <p className="font-serif text-xl text-cream/70 leading-relaxed max-w-sm">
              Exzellenz in jedem Detail. Vertrauen durch Transparenz.
            </p>
            <div className="w-16 h-px bg-gold-light/50" />
          </div>

          {/* Services */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-2">
            <h3 className="font-serif text-lg mb-6 text-cream">Leistungen</h3>
            <ul className="space-y-4">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="group flex items-center gap-2 text-sm text-cream/60 hover:text-gold-light transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-light/40 group-hover:bg-gold-light transition-colors" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-2">
            <h3 className="font-serif text-lg mb-6 text-cream">Navigation</h3>
            <ul className="space-y-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="group flex items-center gap-2 text-sm text-cream/60 hover:text-gold-light transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-light/40 group-hover:bg-gold-light transition-colors" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-12 lg:col-span-3">
            <h3 className="font-serif text-lg mb-6 text-cream">Kontakt</h3>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full border border-gold-light/40 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-gold-light" />
                </div>
                <div>
                  <span className="text-cream/50 text-xs uppercase tracking-wider block mb-1">Standort</span>
                  <span className="text-cream/80">Edingen-Neckarhausen</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full border border-gold-light/40 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-gold-light" />
                </div>
                <div>
                  <span className="text-cream/50 text-xs uppercase tracking-wider block mb-1">Telefon</span>
                  <span className="text-cream/80">+49 (0) 123 456789</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full border border-gold-light/40 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-gold-light" />
                </div>
                <div>
                  <span className="text-cream/50 text-xs uppercase tracking-wider block mb-1">E-Mail</span>
                  <span className="text-cream/80">info@ed-immobilien.de</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full border border-gold-light/40 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-gold-light" />
                </div>
                <div>
                  <span className="text-cream/50 text-xs uppercase tracking-wider block mb-1">Öffnungszeiten</span>
                  <span className="text-cream/80">Mo–Fr: 9:00–18:00 Uhr</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-cream/10" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-cream/40">© {currentYear} ED Immobilien. Alle Rechte vorbehalten.</p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8">
            <Link to="/impressum" className="text-cream/40 hover:text-gold-light transition-colors">
              Impressum
            </Link>
            <Link to="/datenschutz" className="text-cream/40 hover:text-gold-light transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
