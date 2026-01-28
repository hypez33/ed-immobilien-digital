import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Immobilien', href: '/immobilien' },
  { name: 'Leistungen', href: '/leistungen' },
  { name: 'Über uns', href: '/ueber-uns' },
  { name: 'Kontakt', href: '/kontakt' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main Header */}
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/95 backdrop-blur-xl shadow-elegant border-b border-border/50'
            : 'bg-background/80 backdrop-blur-md border-b border-transparent'
        )}
      >
        <nav className="container flex items-center justify-between h-18 md:h-20">
          {/* Logo with Gold Accent */}
          <Link
            to="/"
            className="flex items-center gap-4 group"
            aria-label="ED Immobilien - Zur Startseite"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-primary flex items-center justify-center text-cream font-serif text-xl tracking-wide">
                ED
              </div>
              {/* Gold corner accent */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gold transition-transform group-hover:scale-110" />
            </div>
            <div className="block max-w-[10.5rem] sm:max-w-none">
              <span className="block text-foreground font-serif text-base sm:text-xl tracking-wide leading-tight truncate">
                ED Immobilien
              </span>
              <span className="block text-[0.6rem] sm:text-2xs text-muted-foreground uppercase tracking-[0.15em] mt-0.5 truncate">
                Rhein-Neckar-Kreis
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="relative px-5 py-2 text-sm font-medium transition-colors group"
              >
                <span className={cn(
                  'relative z-10 transition-colors',
                  location.pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}>
                  {item.name}
                </span>
                {/* Gold underline animation */}
                <span
                  className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gold transition-all duration-300',
                    location.pathname === item.href ? 'w-6' : 'w-0 group-hover:w-6'
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-gold hover:bg-gold/5"
            >
              <Link to="/kontakt?anliegen=bewertung">
                <FileText className="w-4 h-4 mr-2" />
                Bewertung
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="rounded-none"
            >
              <Link to="/kontakt">
                <Phone className="w-4 h-4 mr-2" />
                Termin vereinbaren
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-3 hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background animate-fade-in">
            <div className="container py-6 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between py-4 px-4 text-base font-medium transition-colors border-b border-border/30',
                    location.pathname === item.href
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <span>{item.name}</span>
                  <ArrowRight className={cn(
                    'w-4 h-4 transition-colors',
                    location.pathname === item.href ? 'text-gold' : 'opacity-30'
                  )} />
                </Link>
              ))}

              {/* Mobile CTAs */}
              <div className="pt-6 space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-between rounded-none border-border/60 hover:border-gold hover:text-gold"
                  asChild
                >
                  <Link to="/kontakt?anliegen=bewertung" onClick={() => setMobileMenuOpen(false)}>
                    <span className="flex items-center gap-3">
                      <FileText className="w-4 h-4" />
                      Kostenlose Bewertung
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  className="w-full justify-between rounded-none"
                  asChild
                >
                  <Link to="/kontakt" onClick={() => setMobileMenuOpen(false)}>
                    <span className="flex items-center gap-3">
                      <Phone className="w-4 h-4" />
                      Termin vereinbaren
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
