import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Section } from '@/components/ui/Section';
import { AdminNav } from '@/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { slugify } from '@/lib/slug';
import { useBlogPosts, useBlogPostMutations, BlogPost } from '@/hooks/useBlogPosts';
import { Loader2 } from 'lucide-react';

interface FormState {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  cover: string;
  content: string;
  status: 'draft' | 'published';
}

const emptyForm: FormState = {
  id: '',
  slug: '',
  title: '',
  excerpt: '',
  date: '',
  category: '',
  cover: '',
  content: '',
  status: 'draft',
};

export default function AdminBlogPage() {
  const posts = useBlogPosts();
  const { upsertPost, deletePost, isUpserting, isDeleting } = useBlogPostMutations();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; slug?: string; content?: string }>({});
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [query, setQuery] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const sortedPosts = useMemo(
    () =>
      [...posts].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return sortedPosts.filter((post) => {
      if (statusFilter !== 'all' && post.status !== statusFilter) return false;
      if (!normalized) return true;
      return (
        post.title.toLowerCase().includes(normalized) ||
        post.slug.toLowerCase().includes(normalized)
      );
    });
  }, [sortedPosts, query, statusFilter]);

  const slugConflict = form.slug
    ? posts.some((post) => post.slug === form.slug && post.id !== form.id)
    : false;

  const editorTitle = form.title
    ? `Bearbeiten: ${form.title}`
    : 'Neuer Beitrag';

  const previewParagraphs = form.content ? form.content.split('\n\n') : [];

  const showSlugHint = !slugTouched && !!form.title;

  const startNew = useCallback(() => {
    setForm({
      ...emptyForm,
      id: crypto.randomUUID?.() ?? `${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
    });
    setSlugTouched(false);
    setFieldErrors({});
    setError(null);
    setPreviewMode(false);
  }, []);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      startNew();
    }
  }, [searchParams, startNew]);

  const editPost = (post: BlogPost) => {
    setForm({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || '',
      date: post.date || '',
      category: post.category || '',
      cover: post.cover || '',
      content: post.content || '',
      status: post.status,
    });
    setSlugTouched(true);
    setFieldErrors({});
    setError(null);
    setPreviewMode(false);
  };

  const handleField = (key: keyof FormState, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title' && !slugTouched) {
        next.slug = slugify(value);
      }
      return next;
    });
    if (fieldErrors[key as 'title' | 'slug' | 'content']) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSave = async (nextStatus?: 'draft' | 'published') => {
    setError(null);
    const nextErrors: { title?: string; slug?: string; content?: string } = {};
    if (!form.title.trim()) nextErrors.title = 'Titel ist erforderlich.';
    if (!form.slug.trim()) nextErrors.slug = 'Slug ist erforderlich.';
    if (!form.content?.trim()) nextErrors.content = 'Content ist erforderlich.';
    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      setError('Bitte Titel, Slug und Inhalt ausfüllen.');
      return;
    }
    if (slugConflict) {
      setFieldErrors((prev) => ({ ...prev, slug: 'Der Slug ist bereits vergeben.' }));
      setError('Der Slug ist bereits vergeben.');
      return;
    }

    try {
      await upsertPost({
        id: form.id || undefined,
        slug: form.slug,
        title: form.title,
        excerpt: form.excerpt || undefined,
        date: form.date || new Date().toISOString().slice(0, 10),
        category: form.category || undefined,
        cover: form.cover || undefined,
        content: form.content || undefined,
        status: nextStatus ?? form.status ?? 'published',
      });
      toast({
        title: 'Gespeichert',
        description: 'Der Beitrag wurde erfolgreich aktualisiert.',
      });
      setForm((prev) => ({
        ...prev,
        status: nextStatus ?? prev.status ?? 'published',
      }));
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Fehler beim Speichern. Bitte versuchen Sie es erneut.');
    }
  };

  const handleDelete = async (post: BlogPost) => {
    try {
      await deletePost(post.id);
      if (form.id === post.id) {
        setForm(emptyForm);
      }
      toast({
        title: 'Gelöscht',
        description: 'Der Beitrag wurde entfernt.',
      });
    } catch (err) {
      console.error('Error deleting post:', err);
      toast({
        title: 'Fehler',
        description: 'Beitrag konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout title="Blog">
      <Section size="lg" className="pt-6 md:pt-8 lg:pt-10">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold text-sm uppercase tracking-[0.15em]">Admin</span>
            </div>
            <h1 className="font-serif">Blog Verwaltung</h1>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Beiträge erstellen, bearbeiten und veröffentlichen.
            </p>
          </div>

          <AdminNav />

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-8">
            <div className="bg-card border border-border/40 p-6 md:p-8">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl">Beiträge</h2>
                  <Button size="sm" className="rounded-none" onClick={startNew}>
                    Neuer Beitrag
                  </Button>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Suche nach Titel oder Slug"
                  />
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
                    <SelectTrigger className="h-12 md:w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="border border-border/40 p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{post.title}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{post.date ?? '—'}</span>
                          {post.category && <span>• {post.category}</span>}
                          <span>• {post.slug}</span>
                        </div>
                      </div>
                      <Badge className={post.status === 'draft' ? 'bg-muted text-muted-foreground border-border/60' : 'bg-gold/10 text-gold border-gold/20'}>
                        {post.status ?? 'published'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="rounded-none" onClick={() => editPost(post)}>
                        Bearbeiten
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                        <Link to={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => setDeleteTarget(post)}
                      >
                        Löschen
                      </Button>
                    </div>
                  </div>
                ))}
                {!filteredPosts.length && (
                  <p className="text-sm text-muted-foreground">Keine passenden Beiträge gefunden.</p>
                )}
              </div>
            </div>

            <div className="bg-card border border-border/40 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl">{editorTitle}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => setPreviewMode((prev) => !prev)}
                >
                  {previewMode ? 'Editor' : 'Vorschau'}
                </Button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titel *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(event) => handleField('title', event.target.value)}
                  />
                  {fieldErrors.title && <p className="text-xs text-destructive">{fieldErrors.title}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(event) => {
                      setSlugTouched(true);
                      handleField('slug', event.target.value);
                    }}
                  />
                  {showSlugHint && (
                    <p className="text-xs text-muted-foreground">Slug wird automatisch generiert.</p>
                  )}
                  {slugConflict && (
                    <p className="text-xs text-destructive">Slug ist bereits vergeben.</p>
                  )}
                  {fieldErrors.slug && <p className="text-xs text-destructive">{fieldErrors.slug}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={form.excerpt}
                    onChange={(event) => handleField('excerpt', event.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={form.content}
                    onChange={(event) => handleField('content', event.target.value)}
                    rows={10}
                    className="leading-relaxed"
                  />
                  {fieldErrors.content && <p className="text-xs text-destructive">{fieldErrors.content}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Datum</Label>
                    <Input
                      id="date"
                      type="date"
                      value={form.date}
                      onChange={(event) => handleField('date', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="h-12 w-full border border-border/60 bg-background px-3 text-sm"
                      value={form.status ?? 'published'}
                      onChange={(event) => handleField('status', event.target.value)}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategorie</Label>
                    <Input
                      id="category"
                      value={form.category ?? ''}
                      onChange={(event) => handleField('category', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cover">Cover URL</Label>
                    <Input
                      id="cover"
                      value={form.cover ?? ''}
                      onChange={(event) => handleField('cover', event.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                {previewMode && (
                  <div className="border border-border/40 p-4 bg-surface">
                    <h3 className="font-serif text-lg mb-2">{form.title || 'Vorschau'}</h3>
                    {form.excerpt && <p className="text-sm text-muted-foreground mb-4">{form.excerpt}</p>}
                    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                      {previewParagraphs.length ? (
                        previewParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                      ) : (
                        <p>Kein Content vorhanden.</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button className="rounded-none" onClick={() => handleSave()} disabled={isUpserting}>
                    {isUpserting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Speichern...
                      </>
                    ) : (
                      'Speichern'
                    )}
                  </Button>
                  <Button variant="outline" className="rounded-none" onClick={() => handleSave('draft')} disabled={isUpserting}>
                    Als Draft speichern
                  </Button>
                  <Button variant="outline" className="rounded-none" onClick={() => handleSave('published')} disabled={isUpserting}>
                    Veröffentlichen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => (!open ? setDeleteTarget(null) : null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Beitrag löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dieser Vorgang kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={() => {
                if (deleteTarget) {
                  handleDelete(deleteTarget);
                }
                setDeleteTarget(null);
              }}
            >
              {isDeleting ? 'Löschen...' : 'Löschen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
