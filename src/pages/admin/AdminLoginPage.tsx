import { useState } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Section } from '@/components/ui/Section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Loader2, Mail, Lock, UserPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminLoginPage() {
  const { session, login, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    
    const result = await login(email, password);
    setIsSubmitting(false);
    
    if (!result.ok) {
      setError(result.error ?? 'Login fehlgeschlagen.');
      return;
    }
    const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/admin';
    navigate(redirectTo, { replace: true });
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    
    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
      setIsSubmitting(false);
      return;
    }
    
    const result = await signUp(email, password, fullName);
    setIsSubmitting(false);
    
    if (!result.ok) {
      setError(result.error ?? 'Registrierung fehlgeschlagen.');
      return;
    }
    
    setSuccessMessage('Registrierung erfolgreich! Bitte bestätigen Sie Ihre E-Mail-Adresse.');
    setEmail('');
    setPassword('');
    setFullName('');
  };

  return (
    <AdminLayout title="Login">
      <Section size="lg" className="pt-6 md:pt-8 lg:pt-10">
        <div className="max-w-md mx-auto bg-card border border-border/40 p-8 md:p-10" data-reveal>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em]">Admin</span>
          </div>
          
          <div className="flex items-center gap-3 bg-surface border border-border/40 px-4 py-3 mb-6">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <span className="text-sm text-muted-foreground">Zugriff nur für berechtigte Nutzer</span>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1 gap-2">
                <Lock className="w-4 h-4" />
                Anmelden
              </TabsTrigger>
              <TabsTrigger value="register" className="flex-1 gap-2">
                <UserPlus className="w-4 h-4" />
                Registrieren
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form className="space-y-5" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-Mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@beispiel.de"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Passwort</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
                <Button type="submit" className="w-full rounded-none" disabled={loading || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Bitte warten...
                    </>
                  ) : (
                    'Anmelden'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form className="space-y-5" onSubmit={handleSignUp}>
                <div className="space-y-2">
                  <Label htmlFor="register-name">Name (optional)</Label>
                  <Input
                    id="register-name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Max Mustermann"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">E-Mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@beispiel.de"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Passwort (min. 6 Zeichen)</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="pl-10"
                      minLength={6}
                      required
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
                <Button type="submit" className="w-full rounded-none" disabled={loading || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Bitte warten...
                    </>
                  ) : (
                    'Registrieren'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-border/40 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-gold transition-colors">
              ← Zurück zur Website
            </Link>
          </div>
        </div>
      </Section>
    </AdminLayout>
  );
}
