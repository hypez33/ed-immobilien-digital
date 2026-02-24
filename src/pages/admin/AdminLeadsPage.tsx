import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  InquiryNote,
  InquiryStatus, 
  setInquiryStatus 
} from '@/lib/inquiriesService';
import { useInquiries } from '@/hooks/useInquiries';
import { addActivity } from '@/lib/activityStore';
import { Loader2 } from 'lucide-react';

const PINNED_INQUIRIES_STORAGE_KEY = 'pinnedInquiryIds';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [noteOverrides, setNoteOverrides] = useState<Record<string, InquiryNote[]>>({});
  const [pinnedInquiryIds, setPinnedInquiryIds] = useState<string[]>([]);
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(PINNED_INQUIRIES_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setPinnedInquiryIds(parsed.filter((item): item is string => typeof item === 'string'));
      }
    } catch {
      setPinnedInquiryIds([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PINNED_INQUIRIES_STORAGE_KEY, JSON.stringify(pinnedInquiryIds));
  }, [pinnedInquiryIds]);

  const getInquiryNotes = useCallback(
    (inquiry: Inquiry) => noteOverrides[inquiry.id] ?? inquiry.notes ?? [],
    [noteOverrides]
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const pinnedSet = new Set(pinnedInquiryIds);
    return inquiries
      .filter((inquiry) => {
        if (statusFilter !== 'all' && inquiry.status !== statusFilter) return false;
        if (!normalized) return true;
        return (
          inquiry.name.toLowerCase().includes(normalized) ||
          inquiry.email.toLowerCase().includes(normalized) ||
          inquiry.service_or_anliegen.toLowerCase().includes(normalized)
        );
      })
      .sort((a, b) => {
        const aPinned = pinnedSet.has(a.id);
        const bPinned = pinnedSet.has(b.id);
        if (aPinned !== bPinned) {
          return aPinned ? -1 : 1;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [inquiries, query, statusFilter, pinnedInquiryIds]);

  const selected = selectedId ? inquiries.find((item) => item.id === selectedId) : null;
  const selectedNotes = selected ? getInquiryNotes(selected) : [];

  useEffect(() => {
    const fromQuery = searchParams.get('selected');
    if (fromQuery && inquiries.some((entry) => entry.id === fromQuery)) {
      setSelectedId(fromQuery);
    }
  }, [searchParams, inquiries]);

  useEffect(() => {
    setNoteText('');
  }, [selectedId]);

  const formatRelative = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'gerade eben';
    if (minutes < 60) return `vor ${minutes} Min.`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `vor ${hours} Std.`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `vor ${days} Tagen`;
    return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short' }).format(new Date(date));
  };

  const formatDateTime = (date: string) =>
    new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));

  const buildInquiryMailTo = (inquiry: Inquiry) => {
    const shortId = inquiry.id.slice(0, 8);
    const createdAtLabel = formatDateTime(inquiry.created_at);
    const subject = `Rueckmeldung zu Ihrer Anfrage (${inquiry.service_or_anliegen}) - ID ${shortId}`;
    const body = [
      `Hallo ${inquiry.name},`,
      '',
      'vielen Dank fuer Ihre Anfrage bei ED Immobilien.',
      '',
      `Anliegen: ${inquiry.service_or_anliegen}`,
      `Anfrage-ID: ${shortId}`,
      `Eingang: ${createdAtLabel}`,
      '',
      'Ihre Nachricht:',
      inquiry.message,
      '',
      'Mit freundlichen Gruessen',
      'ED Immobilien',
    ].join('\n');
    return `mailto:${inquiry.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyWithFallback = async (label: string, value?: string | null) => {
    const text = value?.trim();
    if (!text) {
      toast({ title: 'Nichts zu kopieren', description: `${label} ist nicht vorhanden.`, variant: 'destructive' });
      return;
    }

    const fallbackCopy = () => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const copied = document.execCommand('copy');
      textArea.remove();
      if (!copied) {
        throw new Error('copy_failed');
      }
    };

    try {
      if (window.isSecureContext && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy();
      }
      toast({ title: 'Kopiert', description: `${label} wurde in die Zwischenablage kopiert.` });
    } catch {
      toast({ title: 'Fehler', description: `${label} konnte nicht kopiert werden.`, variant: 'destructive' });
    }
  };

  const togglePinned = (inquiry: Inquiry) => {
    const isPinned = pinnedInquiryIds.includes(inquiry.id);
    setPinnedInquiryIds((prev) =>
      isPinned ? prev.filter((entryId) => entryId !== inquiry.id) : [inquiry.id, ...prev.filter((entryId) => entryId !== inquiry.id)]
    );
    addActivity('inquiry:pin', `${isPinned ? 'Pin entfernt' : 'Angepinnt'}: ${inquiry.name}`);
    toast({
      title: isPinned ? 'Pin entfernt' : 'Angepinnt',
      description: isPinned ? 'Anfrage wurde entpinnt.' : 'Anfrage bleibt oben in der Liste.',
    });
  };

  const handleAddNote = async () => {
    if (!selected) return;
    const trimmed = noteText.trim();
    if (!trimmed) return;
    const previousNotes = getInquiryNotes(selected);
    const optimisticNote: InquiryNote = {
      id: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      text: trimmed,
    };
    setNoteOverrides((prev) => ({
      ...prev,
      [selected.id]: [optimisticNote, ...previousNotes],
    }));
    setNoteText('');
    try {
      const updatedInquiry = await addInquiryNote(selected.id, trimmed);
      setNoteOverrides((prev) => ({
        ...prev,
        [selected.id]: updatedInquiry.notes ?? [optimisticNote, ...previousNotes],
      }));
      addActivity('inquiry:note', `Notiz ergänzt: ${selected.name}`);
      toast({ title: 'Notiz gespeichert', description: 'Die Notiz wurde hinzugefügt.' });
      void refetch();
    } catch {
      setNoteOverrides((prev) => ({
        ...prev,
        [selected.id]: previousNotes,
      }));
      toast({ title: 'Fehler', description: 'Notiz konnte nicht gespeichert werden.', variant: 'destructive' });
    }
  };

  const handleStatusChange = async (status: InquiryStatus) => {
    if (!selected) return;
    try {
      await setInquiryStatus(selected.id, status);
      addActivity('inquiry:status', `Status geändert: ${selected.name}`, { status });
      toast({ title: 'Status aktualisiert', description: `Status: ${statusLabels[status]}` });
      refetch();
    } catch {
      toast({ title: 'Fehler', description: 'Status konnte nicht aktualisiert werden.', variant: 'destructive' });
    }
  };

  const handleQuickStatusChange = async (inquiry: Inquiry, status: InquiryStatus) => {
    try {
      await setInquiryStatus(inquiry.id, status);
      addActivity('inquiry:status', `Status geändert: ${inquiry.name}`, { status });
      toast({ title: 'Status aktualisiert', description: `Status: ${statusLabels[status]}` });
      refetch();
    } catch {
      toast({ title: 'Fehler', description: 'Status konnte nicht aktualisiert werden.', variant: 'destructive' });
    }
  };

  const handleInlineNoteSave = async (inquiry: Inquiry) => {
    const text = (noteDrafts[inquiry.id] || '').trim();
    if (!text) return;
    const previousNotes = getInquiryNotes(inquiry);
    const optimisticNote: InquiryNote = {
      id: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      text,
    };
    setNoteOverrides((prev) => ({
      ...prev,
      [inquiry.id]: [optimisticNote, ...previousNotes],
    }));
    try {
      const updatedInquiry = await addInquiryNote(inquiry.id, text);
      setNoteOverrides((prev) => ({
        ...prev,
        [inquiry.id]: updatedInquiry.notes ?? [optimisticNote, ...previousNotes],
      }));
      addActivity('inquiry:note', `Notiz ergänzt: ${inquiry.name}`);
      setNoteDrafts((prev) => ({ ...prev, [inquiry.id]: '' }));
      setOpenNoteId(null);
      toast({ title: 'Notiz gespeichert', description: 'Die Notiz wurde hinzugefügt.' });
      void refetch();
    } catch {
      setNoteOverrides((prev) => ({
        ...prev,
        [inquiry.id]: previousNotes,
      }));
      toast({ title: 'Fehler', description: 'Notiz konnte nicht gespeichert werden.', variant: 'destructive' });
    }
  };

  const handleDelete = async (inquiry: Inquiry) => {
    try {
      await deleteInquiry(inquiry.id);
      if (selectedId === inquiry.id) {
        setSelectedId(null);
      }
      setPinnedInquiryIds((prev) => prev.filter((entryId) => entryId !== inquiry.id));
      addActivity('inquiry:delete', `Anfrage gelöscht: ${inquiry.name}`);
      toast({ title: 'Gelöscht', description: 'Die Anfrage wurde entfernt.' });
      void refetch();
    } catch {
      toast({ title: 'Fehler', description: 'Anfrage konnte nicht gelöscht werden.', variant: 'destructive' });
    }
  };

  const handleExportCsv = () => {
    const rows = filtered.map((inquiry) => ({
      id: inquiry.id,
      createdAt: inquiry.created_at,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone ?? '',
      service: inquiry.service_or_anliegen,
      status: inquiry.status,
      notes: getInquiryNotes(inquiry).map((note) => note.text).join(' | '),
      message: inquiry.message,
    }));
    const header = ['id', 'createdAt', 'name', 'email', 'phone', 'service', 'status', 'notes', 'message'];
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = [
      header.join(','),
      ...rows.map((row) =>
        header.map((key) => escape(String((row as Record<string, string>)[key] ?? ''))).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `anfragen-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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

  const clearSelectedParam = () => {
    const next = new URLSearchParams(searchParams);
    if (next.has('selected')) {
      next.delete('selected');
      setSearchParams(next, { replace: true });
    }
  };

  const openDetails = (id: string) => {
    setSelectedId(id);
    const next = new URLSearchParams(searchParams);
    next.set('selected', id);
    setSearchParams(next, { replace: true });
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
            <div className="flex flex-col lg:flex-row gap-3 mb-4">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Suche nach Name, E-Mail oder Anliegen"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
                  <SelectTrigger className="h-12 sm:w-48">
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
                <Button variant="outline" size="sm" className="rounded-none" onClick={handleExportCsv}>
                  Export CSV
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { value: 'all', label: 'Alle' },
                { value: 'new', label: 'Neu' },
                { value: 'in_progress', label: 'In Bearbeitung' },
                { value: 'done', label: 'Erledigt' },
              ].map((filter) => {
                const active = statusFilter === filter.value;
                return (
                  <Button
                    key={filter.value}
                    type="button"
                    variant={active ? 'default' : 'outline'}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setStatusFilter(filter.value as typeof statusFilter)}
                  >
                    {filter.label}
                  </Button>
                );
              })}
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
                {filtered.map((inquiry) => {
                  const notes = getInquiryNotes(inquiry);
                  const latestNote = notes[0];
                  const notePreview = latestNote?.text?.trim() || '';
                  const previewText =
                    notePreview.length > 160 ? `${notePreview.slice(0, 157)}...` : notePreview;
                  const isNew = inquiry.status === 'new';
                  const isPinned = pinnedInquiryIds.includes(inquiry.id);
                  return (
                    <div
                      key={inquiry.id}
                      className={`border border-border/40 p-4 flex flex-col gap-3 ${isNew ? 'border-l-4 border-l-gold bg-gold/5' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-foreground">{inquiry.name}</p>
                          <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                          <p className="text-sm text-muted-foreground">{inquiry.service_or_anliegen}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatRelative(inquiry.created_at)}</p>
                          {isPinned && (
                            <p className="text-[11px] uppercase tracking-[0.14em] text-gold mt-1">Angepinnt</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={statusBadgeClass[inquiry.status]}>
                            {statusLabels[inquiry.status]}
                          </Badge>
                          <Select
                            value={inquiry.status}
                            onValueChange={(value) => handleQuickStatusChange(inquiry, value as InquiryStatus)}
                          >
                            <SelectTrigger className="h-9 w-44">
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
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1">Notizen</p>
                        {previewText ? (
                          <>
                            <p className="text-sm text-muted-foreground">{previewText}</p>
                            {latestNote?.createdAt && (
                              <p className="text-[11px] text-muted-foreground mt-1">
                                Letzte Notiz: {formatRelative(latestNote.createdAt)}
                              </p>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                            onClick={() => setOpenNoteId(inquiry.id)}
                          >
                            Keine Notizen – Klick für Quick-Note
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="rounded-none" onClick={() => openDetails(inquiry.id)}>
                          Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => setOpenNoteId((prev) => (prev === inquiry.id ? null : inquiry.id))}
                        >
                          Notiz hinzufügen
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-none"
                          onClick={() => handleQuickStatusChange(inquiry, 'in_progress')}
                          disabled={inquiry.status === 'in_progress'}
                        >
                          In Bearbeitung
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-none"
                          onClick={() => handleQuickStatusChange(inquiry, 'done')}
                          disabled={inquiry.status === 'done'}
                        >
                          Als erledigt
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => copyWithFallback('E-Mail', inquiry.email)}
                        >
                          Copy E-Mail
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => copyWithFallback('Telefon', inquiry.phone)}
                        >
                          Copy Telefon
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => copyWithFallback('Nachricht', inquiry.message)}
                        >
                          Copy Nachricht
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                          <a
                            href={buildInquiryMailTo(inquiry)}
                          >
                            Mail antworten
                          </a>
                        </Button>
                        <Button
                          variant={isPinned ? 'secondary' : 'ghost'}
                          size="sm"
                          className={isPinned ? '' : 'text-muted-foreground'}
                          onClick={() => togglePinned(inquiry)}
                        >
                          {isPinned ? 'Entpinnen' : 'Anpinnen'}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteTarget(inquiry)}>
                          Löschen
                        </Button>
                      </div>

                      {openNoteId === inquiry.id && (
                        <div className="border border-border/40 bg-surface p-3">
                          <Textarea
                            value={noteDrafts[inquiry.id] ?? ''}
                            onChange={(event) =>
                              setNoteDrafts((prev) => ({ ...prev, [inquiry.id]: event.target.value }))
                            }
                            rows={2}
                            placeholder="Notiz hinzufügen"
                          />
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              size="sm"
                              className="rounded-none"
                              onClick={() => handleInlineNoteSave(inquiry)}
                            >
                              Speichern
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-muted-foreground"
                              onClick={() => setOpenNoteId(null)}
                            >
                              Abbrechen
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {!filtered.length && (
                  <div className="text-sm text-muted-foreground">
                    Keine Anfragen gefunden.
                    {isDev && (
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

      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null);
            clearSelectedParam();
          }
        }}
      >
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
                <p className="text-xs mt-1">
                  ID: {selected.id.slice(0, 8)} · Eingang: {formatDateTime(selected.created_at)}
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Anliegen</p>
                <p>{selected.service_or_anliegen}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Nachricht</p>
                <p>{selected.message}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="rounded-none" asChild>
                  <a href={buildInquiryMailTo(selected)}>Mail antworten</a>
                </Button>
                <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => copyWithFallback('E-Mail', selected.email)}>
                  Copy E-Mail
                </Button>
                <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => copyWithFallback('Telefon', selected.phone)}>
                  Copy Telefon
                </Button>
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
                  {selectedNotes.map((note) => (
                    <div key={note.id} className="border border-border/40 p-3 bg-surface">
                      <p className="text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleString('de-DE')}
                      </p>
                      <p className="text-sm text-foreground">{note.text}</p>
                    </div>
                  ))}
                  {!selectedNotes.length && (
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
