import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-background/95">
        <div className="container py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center text-cream font-serif text-lg tracking-wide">
              ED
            </div>
            <div>
              <span className="block text-2xs uppercase tracking-[0.15em] text-muted-foreground">
                Admin
              </span>
              {title && <span className="block font-serif text-lg">{title}</span>}
            </div>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
            <Link to="/">Zur Website</Link>
          </Button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
