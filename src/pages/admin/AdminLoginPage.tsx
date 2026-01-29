import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Section } from '@/components/ui/Section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const { session, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (session) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const result = await login(identifier, password);
    if (!result.ok) {
      setError(result.error ?? 'Login fehlgeschlagen.');
      return;
    }
    const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/admin';
    navigate(redirectTo, { replace: true });
  };

  return (
    <AdminLayout title="Login">
      <Section size="lg" className="pt-6 md:pt-8 lg:pt-10">
        <div className="max-w-md mx-auto bg-card border border-border/40 p-8 md:p-10" data-reveal>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em]">Admin</span>
          </div>
          <h1 className="font-serif mb-2">Login</h1>
          <p className="text-muted-foreground mb-8">
            Melden Sie sich an, um Beiträge zu verwalten.
          </p>
          <div className="flex items-center gap-3 bg-surface border border-border/40 px-4 py-3 mb-6">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <span className="text-sm text-muted-foreground">Zugriff nur für berechtigte Nutzer</span>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="identifier">E-Mail / Benutzername</Label>
              <Input
                id="identifier"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="admin"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full rounded-none" disabled={loading}>
              {loading ? 'Bitte warten...' : 'Anmelden'}
            </Button>
          </form>
        </div>
      </Section>
    </AdminLayout>
  );
}
