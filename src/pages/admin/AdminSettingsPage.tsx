import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminNav } from '@/components/admin/AdminNav';
import { Section } from '@/components/ui/Section';

export default function AdminSettingsPage() {
  return (
    <AdminLayout title="Einstellungen">
      <Section size="lg" className="pt-6 md:pt-8 lg:pt-10">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold text-sm uppercase tracking-[0.15em]">Admin</span>
            </div>
            <h1 className="font-serif">Einstellungen</h1>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Grundeinstellungen für das Admin-Panel folgen später.
            </p>
          </div>
          <AdminNav />
          <div className="bg-card border border-border/40 p-6 md:p-8">
            <p className="text-sm text-muted-foreground">
              Konfigurationen wie Rollen, Benutzer oder API-Keys können hier ergänzt werden.
            </p>
          </div>
        </div>
      </Section>
    </AdminLayout>
  );
}
