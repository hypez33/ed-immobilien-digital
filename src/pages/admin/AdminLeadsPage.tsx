import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminNav } from '@/components/admin/AdminNav';
import { Section } from '@/components/ui/Section';

export default function AdminLeadsPage() {
  return (
    <AdminLayout title="Anfragen">
      <Section size="lg">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold text-sm uppercase tracking-[0.15em]">Admin</span>
            </div>
            <h1 className="font-serif">Anfragen</h1>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Platzhalter für zukünftige Lead- und Anfrageverwaltung.
            </p>
          </div>
          <AdminNav />
          <div className="bg-card border border-border/40 p-6 md:p-8">
            <p className="text-sm text-muted-foreground">
              Dieses Modul wird in einem späteren Schritt erweitert.
            </p>
          </div>
        </div>
      </Section>
    </AdminLayout>
  );
}
