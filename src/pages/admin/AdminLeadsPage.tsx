import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminNav } from '@/components/admin/AdminNav';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { 
  addInquiryNote, 
  createInquiry, 
  deleteInquiry, 
  Inquiry, 
  InquiryStatus, 
  setInquiryStatus 
} from '@/lib/inquiriesService';
import { useInquiries } from '@/hooks/useInquiries';
import { Loader2 } from 'lucide-react';

const statusLabels: Record<InquiryStatus, string> = {
  new: 'Neu',
  in_progress: 'In Bearbeitung',
  done: 'Erledigt',
  archived: 'Archiv',
};

const statusBadgeClass: Record<InquiryStatus, string> = {
  new: 'bg-gold/10 text-gold border-gold/20',
  in_progress: 'bg-muted text-muted-foreground border-border/60',
  done: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  archived: 'bg-secondary text-secondary-foreground border-border/60',
};

export default function AdminLeadsPage() {
  const { inquiries, loading, error, refetch } = useInquiries();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return inquiries.filter((inquiry) => {
      if (statusFilter !== 'all' && inquiry.status !== statusFilter) return false;
      if (!normalized) return true;
      return (
        inquiry.name.toLowerCase().includes(normalized) ||
        inquiry.email.toLowerCase().includes(normalized) ||
        inquiry.service_or_anliegen.toLowerCase().includes(normalized)
      );
    });
  }, [inquiries, query, statusFilter]);

  const selected = selectedId ? inquiries.find((item) => item.id === selectedId) : null;

  useEffect(() => {
    setNoteText('');
  }, [selectedId]);

  const handleAddNote = async () => {
    if (!selected) return;
    if (!noteText.trim()) return;
    try {
      await addInquiryNote(selected.id, noteText.trim());
      toast({ title: 'Notiz gespeichert', description: 'Die Notiz wurde hinzugefügt.' });
      setNoteText('');
      refetch();
    } catch {
      toast({ title: 'Fehler', description: 'Notiz konnte nicht gespeichert werden.', variant: 'destructive' });
    }
  };

  const handleStatusChange = async (status: InquiryStatus) => {
    if (!selected) return;
    try {
      await setInquiryStatus(selected.id, status);
      toast({ title: 'Status aktualisiert', description: `Status: ${statusLabels[status]}` });
      refetch();
    } catch {
      toast({ title: 'Fehler', description: 'Status konnte nicht aktualisiert werden.', variant: 'destructive' });
    }
  };

  const handleDelete = async (inquiry: Inquiry) => {
    try {
      await deleteInquiry(inquiry.id);
      if (selectedId === inquiry.id) {
        setSelectedId(null);
      }
      toast({ title: 'Gelöscht', description: 'Die Anfrage wurde entfernt.' });
      refetch();
    } catch {
      toast({ title: 'Fehler', description: 'Anfrage konnte nicht gelöscht werden.', variant: 'destructive' });
    }
  };

  const handleCreateSample = async () => {
    try {
      await createInquiry({
        name: 'Max Mustermann',
        email: 'max@example.com',
        phone: '+49 123 456789',
        serviceOrAnliegen: 'Bewertung',
        message: 'Bitte um Rückruf zur Wertermittlung.',
        source: 'dev-seed',
        status: 'new',
      });
      refetch();
    } catch {
      toast({ title: 'Fehler', description: 'Test-Anfrage konnte nicht erstellt werden.', variant: 'destructive' });
    }
  };

  return (
    <AdminLayout title="Anfragen">
      <Section size="lg" className="pt-6 md:pt-8 lg:pt-10">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold text-sm uppercase tracking-[0.15em]">Admin</span>
            </div>
            <h1 className="font-serif">Anfragen</h1>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Eingehende Anfragen verwalten, priorisieren und beantworten.
            </p>
          </div>

          <AdminNav />

          <div className="bg-card border border-border/40 p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Suche nach Name, E-Mail oder Anliegen"
              />
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
                <SelectTrigger className="h-12 md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gold" />
              </div>
            )}

            {error && (
              <div className="text-sm text-destructive py-4">{error}</div>
            )}

            {!loading && !error && (
              <div className="space-y-4">
                {filtered.map((inquiry) => (
                  <div key={inquiry.id} className="border border-border/40 p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{inquiry.name}</p>
                        <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                        <p className="text-sm text-muted-foreground">{inquiry.service_or_anliegen}</p>
                      </div>
                      <Badge className={statusBadgeClass[inquiry.status]}>
                        {statusLabels[inquiry.status]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="rounded-none" onClick={() => setSelectedId(inquiry.id)}>
                        Details
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                        <a
                          href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Anfrage: ${inquiry.service_or_anliegen}`)}&body=${encodeURIComponent(inquiry.message)}`}
                        >
                          Mail antworten
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteTarget(inquiry)}>
                        Löschen
                      </Button>
                    </div>
                  </div>
                ))}
                {!filtered.length && (
                  <div className="text-sm text-muted-foreground">
                    Keine Anfragen gefunden.
                    {import.meta.env.DEV && (
                      <div className="mt-3">
                        <Button size="sm" className="rounded-none" onClick={handleCreateSample}>
                          Test-Anfrage anlegen
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Section>

      <Dialog open={!!selected} onOpenChange={(open) => (!open ? setSelectedId(null) : null)}>
        {selected && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Anfrage von {selected.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Kontakt</p>
                <p>{selected.email}</p>
                {selected.phone && <p>{selected.phone}</p>}
              </div>
              <div>
                <p className="font-medium text-foreground">Anliegen</p>
                <p>{selected.service_or_anliegen}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Nachricht</p>
                <p>{selected.message}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Select value={selected.status} onValueChange={(value) => handleStatusChange(value as InquiryStatus)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notizen</Label>
                <Textarea
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  rows={3}
                  placeholder="Notiz hinzufügen"
                />
                <Button size="sm" className="rounded-none" onClick={handleAddNote}>
                  Notiz speichern
                </Button>
                <div className="space-y-2 mt-3">
                  {(selected.notes ?? []).map((note) => (
                    <div key={note.id} className="border border-border/40 p-3 bg-surface">
                      <p className="text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleString('de-DE')}
                      </p>
                      <p className="text-sm text-foreground">{note.text}</p>
                    </div>
                  ))}
                  {!selected.notes?.length && (
                    <p className="text-xs text-muted-foreground">Noch keine Notizen.</p>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => (!open ? setDeleteTarget(null) : null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anfrage löschen?</AlertDialogTitle>
            <AlertDialogDescription>Dieser Vorgang kann nicht rückgängig gemacht werden.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) {
                  handleDelete(deleteTarget);
                }
                setDeleteTarget(null);
              }}
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
