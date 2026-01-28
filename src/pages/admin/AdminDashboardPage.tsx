import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Section } from '@/components/ui/Section';
import { AdminNav } from '@/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import { useBlogPosts } from '@/hooks/useBlogPosts';

export default function AdminDashboardPage() {
  const posts = useBlogPosts();
  const published = posts.filter((post) => post.status !== 'draft');
  const drafts = posts.filter((post) => post.status === 'draft');
  const latestDate = posts
    .map((post) => post.date)
    .filter(Boolean)
    .sort()
    .at(-1);
  const latestPosts = [...posts]
    .filter((post) => post.date)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, 3);

  const formattedLatestDate = latestDate
    ? new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(latestDate))
    : '—';

  return (
    <AdminLayout title="Dashboard">
      <Section size="lg" className="pt-6 md:pt-8 lg:pt-10">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold text-sm uppercase tracking-[0.15em]">Admin</span>
            </div>
            <h1 className="font-serif">Dashboard</h1>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Überblick über Inhalte und aktuelle Aktivitäten.
            </p>
          </div>

          <AdminNav />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" data-stagger>
            <div className="bg-card border border-border/40 p-6 md:p-8" data-stagger-item>
              <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Blogposts
              </p>
              <span className="font-serif text-3xl text-foreground">{posts.length}</span>
              <p className="text-sm text-muted-foreground mt-2">
                Veröffentlicht: {published.length}
              </p>
            </div>
            <div className="bg-card border border-border/40 p-6 md:p-8" data-stagger-item>
              <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Drafts
              </p>
              <span className="font-serif text-3xl text-foreground">{drafts.length}</span>
              <p className="text-sm text-muted-foreground mt-2">
                In Vorbereitung
              </p>
            </div>
            <div className="bg-card border border-border/40 p-6 md:p-8" data-stagger-item>
              <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Letzte Änderung
              </p>
              <span className="font-serif text-3xl text-foreground">{formattedLatestDate}</span>
              <p className="text-sm text-muted-foreground mt-2">
                Datum des neuesten Beitrags.
              </p>
            </div>
            <div className="bg-card border border-border/40 p-6 md:p-8" data-stagger-item>
              <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Besucher
              </p>
              <span className="font-serif text-3xl text-foreground">—</span>
              <p className="text-sm text-muted-foreground mt-2">
                Analytics folgen später.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-8">
            <div className="bg-card border border-border/40 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl">Letzte Aktionen</h2>
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                  <Link to="/admin/blog">Zur Verwaltung</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {latestPosts.length ? (
                  latestPosts.map((post) => (
                    <div key={post.id} className="flex items-start justify-between gap-4 border-b border-border/30 pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-foreground">{post.title}</p>
                        <p className="text-sm text-muted-foreground">{post.slug}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        {post.date}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Noch keine Beiträge vorhanden.</p>
                )}
              </div>
            </div>
            <div className="bg-card border border-border/40 p-6 md:p-8">
              <h2 className="font-serif text-xl mb-6">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <Button asChild className="rounded-none">
                  <Link to="/admin/blog?new=1">Neuer Beitrag</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-none">
                  <Link to="/blog">Zum Blog</Link>
                </Button>
                <Button asChild variant="ghost" className="rounded-none text-muted-foreground">
                  <Link to="/">Zur Website</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </AdminLayout>
  );
}
