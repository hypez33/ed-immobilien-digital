import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Pencil, Trash2, Copy } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminNav } from '@/components/admin/AdminNav';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { slugify } from '@/lib/slug';
import { deleteListing, getAllListings, upsertListing, type ListingRecord, type ListingUpsertPayload } from '@/lib/listingsService';

interface ListingFormState {
  id?: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  price: string;
  priceSuffix: string;
  area: string;
  rooms: string;
  address: string;
  city: string;
  zip: string;
  description: string;
  features: string;
  images: string;
  isFeatured: boolean;
  published: boolean;
}

const emptyForm: ListingFormState = {
  title: '',
  slug: '',
  type: 'wohnung',
  status: 'zu_verkaufen',
  price: '',
  priceSuffix: '€',
  area: '',
  rooms: '',
  address: '',
  city: '',
  zip: '',
  description: '',
  features: '',
  images: '',
  isFeatured: false,
  published: false,
};

const typeOptions = [
  { value: 'wohnung', label: 'Wohnung' },
  { value: 'haus', label: 'Haus' },
  { value: 'grundstueck', label: 'Grundstück' },
  { value: 'gewerbe', label: 'Gewerbe' },
];

const statusOptions = [
  { value: 'zu_verkaufen', label: 'Zu verkaufen' },
  { value: 'zu_vermieten', label: 'Zu vermieten' },
  { value: 'verkauft', label: 'Verkauft' },
  { value: 'vermietet', label: 'Vermietet' },
];

const mapToForm = (listing: ListingRecord): ListingFormState => ({
  id: listing.id,
  title: listing.title,
  slug: listing.slug,
  type: listing.type,
  status: listing.status,
  price: String(listing.price),
  priceSuffix: listing.price_suffix ?? (listing.status.includes('vermiet') ? '€/Monat' : '€'),
  area: String(listing.area),
  rooms: String(listing.rooms),
  address: listing.address,
  city: listing.city,
  zip: listing.zip,
  description: listing.description ?? '',
  features: listing.features.join('\n'),
  images: listing.images.join('\n'),
  isFeatured: listing.is_featured,
  published: listing.published,
});

const parseLines = (value: string) =>
  value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);

const formatPrice = (price: number, suffix: string | null) =>
  `${new Intl.NumberFormat('de-DE').format(price)} ${suffix ?? '€'}`;

export default function AdminListingsPage() {
  const queryClient = useQueryClient();
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ListingRecord | null>(null);
  const [form, setForm] = useState<ListingFormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: listings = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: getAllListings,
    staleTime: 1000 * 60,
  });

  const upsertMutation = useMutation({
    mutationFn: (payload: ListingUpsertPayload) => upsertListing(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings', 'published'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings', 'published'] });
    },
  });

  const sortedListings = useMemo(
    () => [...listings].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [listings]
  );

  const handleNew = () => {
    setForm(emptyForm);
    setSlugTouched(false);
    setError(null);
    setEditorOpen(true);
  };

  const handleEdit = (listing: ListingRecord) => {
    setForm(mapToForm(listing));
    setSlugTouched(true);
    setError(null);
    setEditorOpen(true);
  };

  const handleDuplicate = (listing: ListingRecord) => {
    const cloned = mapToForm(listing);
    cloned.id = undefined;
    cloned.title = `${listing.title} (Kopie)`;
    cloned.slug = slugify(`${listing.slug}-kopie`);
    cloned.published = false;
    setForm(cloned);
    setSlugTouched(true);
    setError(null);
    setEditorOpen(true);
  };

  const updateForm = <K extends keyof ListingFormState>(key: K, value: ListingFormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title' && !slugTouched) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  };

  const quickToggle = async (listing: ListingRecord, patch: Partial<ListingUpsertPayload>) => {
    try {
      await upsertMutation.mutateAsync({
        id: listing.id,
        ...patch,
      });
    } catch {
      toast({
        title: 'Fehler',
        description: 'Änderung konnte nicht gespeichert werden.',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    setError(null);
    if (!form.title.trim() || !form.slug.trim() || !form.city.trim()) {
      setError('Bitte mindestens Titel, Slug und Ort ausfüllen.');
      return;
    }

    const payload: ListingUpsertPayload = {
      id: form.id,
      title: form.title.trim(),
      slug: form.slug.trim(),
      type: form.type,
      status: form.status,
      price: Number(form.price) || 0,
      price_suffix: form.priceSuffix.trim() || null,
      area: Number(form.area) || 0,
      rooms: Number(form.rooms) || 0,
      address: form.address.trim(),
      city: form.city.trim(),
      zip: form.zip.trim(),
      description: form.description.trim() || null,
      features: parseLines(form.features),
      images: parseLines(form.images),
      is_featured: form.isFeatured,
      published: form.published,
    };

    try {
      await upsertMutation.mutateAsync(payload);
      toast({
        title: 'Gespeichert',
        description: 'Die Immobilie wurde gespeichert.',
      });
      setEditorOpen(false);
      setForm(emptyForm);
    } catch {
      setError('Fehler beim Speichern. Bitte prüfen Sie die Eingaben.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast({
        title: 'Gelöscht',
        description: 'Die Immobilie wurde gelöscht.',
      });
      setDeleteTarget(null);
    } catch {
      toast({
        title: 'Fehler',
        description: 'Immobilie konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout title="Immobilien">
      <Section size="lg" className="pt-6 md:pt-8 lg:pt-10">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold text-sm uppercase tracking-[0.15em]">Admin</span>
            </div>
            <h1 className="font-serif">Immobilien verwalten</h1>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Listings aus Supabase verwalten, veröffentlichen und hervorheben.
            </p>
          </div>

          <AdminNav />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {sortedListings.length} Einträge
            </p>
            <Button className="rounded-none" onClick={handleNew}>
              <Plus className="w-4 h-4 mr-2" />
              Neue Immobilie
            </Button>
          </div>

          {fetchError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4">
              Listings konnten nicht geladen werden.
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <div className="bg-card border border-border/40 p-8 text-center text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-3" />
                Lädt...
              </div>
            ) : sortedListings.length ? (
              sortedListings.map((listing) => (
                <article key={listing.id} className="bg-card border border-border/40 p-5 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-serif text-xl">{listing.title}</h2>
                        <Badge variant={listing.published ? 'default' : 'outline'}>
                          {listing.published ? 'Published' : 'Draft'}
                        </Badge>
                        {listing.is_featured && <Badge className="bg-gold/10 text-gold border-gold/20">Featured</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {listing.zip} {listing.city} · {formatPrice(listing.price, listing.price_suffix)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {listing.area} m² · {listing.rooms} Zimmer · {listing.status}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="outline" size="sm" className="rounded-none" onClick={() => handleEdit(listing)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Bearbeiten
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-none" onClick={() => handleDuplicate(listing)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplizieren
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-none" asChild>
                        <Link to={`/immobilien/${listing.id}`}>Öffnen</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-none text-destructive"
                        onClick={() => setDeleteTarget(listing)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Löschen
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/30 pt-4">
                    <label className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Published</span>
                      <Switch
                        checked={listing.published}
                        onCheckedChange={(checked) => quickToggle(listing, { published: checked })}
                      />
                    </label>
                    <label className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Featured</span>
                      <Switch
                        checked={listing.is_featured}
                        onCheckedChange={(checked) => quickToggle(listing, { is_featured: checked })}
                      />
                    </label>
                  </div>
                </article>
              ))
            ) : (
              <div className="bg-card border border-border/40 p-8 text-center text-muted-foreground">
                Keine Listings vorhanden.
              </div>
            )}
          </div>
        </div>
      </Section>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{form.id ? 'Immobilie bearbeiten' : 'Neue Immobilie'}</DialogTitle>
            <DialogDescription>
              Felder ausfüllen und speichern. Features/Images bitte jeweils zeilenweise eintragen.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2 max-h-[70vh] overflow-y-auto pr-1">
            <div className="space-y-2 md:col-span-2">
              <Label>Titel</Label>
              <Input
                value={form.title}
                onChange={(event) => updateForm('title', event.target.value)}
                placeholder="Titel der Immobilie"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  updateForm('slug', slugify(event.target.value));
                }}
                placeholder="slug"
              />
            </div>
            <div className="space-y-2">
              <Label>Typ</Label>
              <Select value={form.type} onValueChange={(value) => updateForm('type', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value) => updateForm('status', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preis</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(event) => updateForm('price', event.target.value)}
                placeholder="z.B. 389000"
              />
            </div>
            <div className="space-y-2">
              <Label>Preis-Zusatz</Label>
              <Input
                value={form.priceSuffix}
                onChange={(event) => updateForm('priceSuffix', event.target.value)}
                placeholder="€ oder €/Monat"
              />
            </div>
            <div className="space-y-2">
              <Label>Fläche (m²)</Label>
              <Input type="number" value={form.area} onChange={(event) => updateForm('area', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Zimmer</Label>
              <Input type="number" value={form.rooms} onChange={(event) => updateForm('rooms', event.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Adresse</Label>
              <Input value={form.address} onChange={(event) => updateForm('address', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>PLZ</Label>
              <Input value={form.zip} onChange={(event) => updateForm('zip', event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Ort</Label>
              <Input value={form.city} onChange={(event) => updateForm('city', event.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Beschreibung</Label>
              <Textarea
                value={form.description}
                onChange={(event) => updateForm('description', event.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Features (1 pro Zeile)</Label>
              <Textarea
                value={form.features}
                onChange={(event) => updateForm('features', event.target.value)}
                rows={5}
                placeholder={'Balkon\nEinbauküche\nStellplatz'}
              />
            </div>
            <div className="space-y-2">
              <Label>Bild-URLs (1 pro Zeile)</Label>
              <Textarea
                value={form.images}
                onChange={(event) => updateForm('images', event.target.value)}
                rows={5}
                placeholder={'https://...\nhttps://...'}
              />
            </div>
            <label className="flex items-center justify-between md:col-span-2 border border-border/40 px-4 py-3">
              <span className="text-sm">Published</span>
              <Switch checked={form.published} onCheckedChange={(checked) => updateForm('published', checked)} />
            </label>
            <label className="flex items-center justify-between md:col-span-2 border border-border/40 px-4 py-3">
              <span className="text-sm">Featured</span>
              <Switch checked={form.isFeatured} onCheckedChange={(checked) => updateForm('isFeatured', checked)} />
            </label>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setEditorOpen(false)}>
              Abbrechen
            </Button>
            <Button
              className="rounded-none"
              onClick={handleSave}
              disabled={upsertMutation.isPending}
            >
              {upsertMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Immobilie löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dieser Eintrag wird dauerhaft entfernt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
