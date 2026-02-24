import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Section } from '@/components/ui/Section';
import { AdminNav } from '@/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useAnalyticsSummary } from '@/hooks/useAnalytics';
import { useActivities } from '@/hooks/useActivities';
import { useInquiries } from '@/hooks/useInquiries';

export default function AdminDashboardPage() {
  const posts = useBlogPosts();
  const analytics = useAnalyticsSummary(7);
  const activities = useActivities(5);
  const { inquiries } = useInquiries();
  const published = posts.filter((post) => post.status !== 'draft');
  const drafts = posts.filter((post) => post.status === 'draft');
  const latestDate = posts
    .map((post) => post.updated_at ?? post.date ?? post.created_at)
    .filter(Boolean)
    .sort()
    .at(-1);
  const formattedLatestDate = latestDate
    ? new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(latestDate))
    : '—';
  const inquiryCounts = inquiries.reduce(
    (acc, inquiry) => {
      acc.total += 1;
      if (inquiry.status === 'new') acc.new += 1;
      if (inquiry.status === 'in_progress') acc.inProgress += 1;
      if (inquiry.status === 'done') acc.done += 1;
      return acc;
    },
    { total: 0, new: 0, inProgress: 0, done: 0 }
  );
  const latestInquiries = inquiries.slice(0, 3);
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8" data-stagger>
            <div className="bg-card border border-border/40 p-6 md:p-8" data-stagger-item>
              <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Blogposts
              </p>
              <span className="font-serif text-3xl text-foreground">{posts.length}</span>
              <p className="text-sm text-muted-foreground mt-2">Gesamt</p>
            </div>
            <div className="bg-card border border-border/40 p-6 md:p-8" data-stagger-item>
              <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Published
              </p>
              <span className="font-serif text-3xl text-foreground">{published.length}</span>
              <p className="text-sm text-muted-foreground mt-2">
                Veröffentlicht
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
              <span className="font-serif text-3xl text-foreground">{analytics.uniqueVisitors}</span>
              <p className="text-sm text-muted-foreground mt-2">
                Letzte 7 Tage
              </p>
            </div>
            <div className="bg-card border border-border/40 p-6 md:p-8" data-stagger-item>
              <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Anfragen Inbox
              </p>
              <span className="font-serif text-3xl text-foreground">{inquiryCounts.total}</span>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Neu: {inquiryCounts.new}</span>
                <span>In Bearbeitung: {inquiryCounts.inProgress}</span>
                <span>Erledigt: {inquiryCounts.done}</span>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-4 rounded-none">
                <Link to="/admin/anfragen">Zu den Anfragen</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-8">
            <div className="flex flex-col gap-6 order-2 lg:order-1">
              <div className="bg-card border border-border/40 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl">Aktivität</h2>
                  <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                    <Link to="/admin/blog">Zur Verwaltung</Link>
                  </Button>
                </div>
                <div className="space-y-4">
                  {activities.length ? (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex items-start justify-between gap-4 border-b border-border/30 pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium text-foreground">{activity.label}</p>
                          <p className="text-sm text-muted-foreground">{activity.type}</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          {new Date(activity.createdAt).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Noch keine Aktivitäten erfasst.</p>
                  )}
                </div>
              </div>

              <div className="bg-card border border-border/40 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl">Letzte Anfragen</h2>
                  <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                    <Link to="/admin/anfragen">Alle ansehen</Link>
                  </Button>
                </div>
                <div className="space-y-4">
                  {latestInquiries.length ? (
                    latestInquiries.map((inquiry) => (
                      <Link
                        key={inquiry.id}
                        to={`/admin/anfragen?selected=${inquiry.id}`}
                        className="flex items-start justify-between gap-4 border-b border-border/30 pb-4 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium text-foreground">{inquiry.name}</p>
                          <p className="text-sm text-muted-foreground">{inquiry.service_or_anliegen}</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          {formatRelative(inquiry.created_at)}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Noch keine Anfragen eingegangen.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-card border border-border/40 p-6 md:p-8 order-1 lg:order-2">
              <h2 className="font-serif text-xl mb-6">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <Button asChild className="rounded-none">
                  <Link to="/admin/blog?new=1">Neuer Beitrag</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-none">
                  <Link to="/blog">Zum Blog</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-none">
                  <Link to="/admin/anfragen">Zu Anfragen</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-none">
                  <Link to="/admin/analytics">Analytics öffnen</Link>
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
