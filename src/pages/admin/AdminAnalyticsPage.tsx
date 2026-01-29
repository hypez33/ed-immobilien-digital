import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminNav } from '@/components/admin/AdminNav';
import { Section } from '@/components/ui/Section';
import { useAnalyticsSummary } from '@/hooks/useAnalytics';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

export default function AdminAnalyticsPage() {
  const analytics = useAnalyticsSummary(7);
  const topPage = analytics.topPages[0];

  return (
    <AdminLayout title="Analytics">
      <Section size="lg" className="pt-6 md:pt-8 lg:pt-10">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold text-sm uppercase tracking-[0.15em]">Admin</span>
            </div>
            <h1 className="font-serif">Analytics</h1>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Lokale, datenschutzfreundliche Übersicht über Seitenaufrufe.
            </p>
          </div>

          <AdminNav />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="bg-card border border-border/40 p-6 md:p-8">
              <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">Views (7 Tage)</p>
              <span className="font-serif text-3xl text-foreground">{analytics.totalViews}</span>
            </div>
            <div className="bg-card border border-border/40 p-6 md:p-8">
              <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">Unique Visitors</p>
              <span className="font-serif text-3xl text-foreground">{analytics.uniqueVisitors}</span>
            </div>
            <div className="bg-card border border-border/40 p-6 md:p-8">
              <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">Top Page</p>
              <span className="font-serif text-2xl text-foreground">{topPage?.path ?? '—'}</span>
              <p className="text-sm text-muted-foreground mt-2">{topPage?.count ?? 0} Views</p>
            </div>
            <div className="bg-card border border-border/40 p-6 md:p-8">
              <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">Ø Views/Tag</p>
              <span className="font-serif text-3xl text-foreground">{analytics.avgViewsPerDay}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6 lg:gap-8">
            <div className="bg-card border border-border/40 p-6 md:p-8">
              <h2 className="font-serif text-xl mb-4">Views der letzten 7 Tage</h2>
              <ChartContainer
                config={{
                  views: { label: 'Views', color: 'hsl(var(--gold))' },
                }}
                className="h-56 w-full"
              >
                <BarChart data={analytics.dailyViews} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis width={32} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="views" fill="var(--color-views)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
            <div className="bg-card border border-border/40 p-6 md:p-8">
              <h2 className="font-serif text-xl mb-4">Top Pages (7 Tage)</h2>
              <div className="space-y-3">
                {analytics.topPages.slice(0, 6).map((page) => (
                  <div key={page.path} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{page.path}</span>
                    <span className="font-medium text-foreground">{page.count}</span>
                  </div>
                ))}
                {!analytics.topPages.length && (
                  <p className="text-sm text-muted-foreground">Noch keine Daten.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/40 p-6 md:p-8">
            <h2 className="font-serif text-xl mb-4">Letzte Pageviews</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              {analytics.recentViews.slice(0, 10).map((view) => (
                <div key={`${view.path}-${view.ts}`} className="flex items-center justify-between">
                  <span>{view.path}</span>
                  <span>{new Date(view.ts).toLocaleString('de-DE')}</span>
                </div>
              ))}
              {!analytics.recentViews.length && (
                <p className="text-sm text-muted-foreground">Noch keine Daten erfasst.</p>
              )}
            </div>
          </div>
        </div>
      </Section>
    </AdminLayout>
  );
}
