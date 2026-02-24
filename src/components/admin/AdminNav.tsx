import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const adminLinks = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Blog', href: '/admin/blog' },
  { label: 'Immobilien', href: '/admin/immobilien' },
  { label: 'Anfragen', href: '/admin/anfragen' },
  { label: 'Analytics', href: '/admin/analytics' },
];

export function AdminNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        {adminLinks.map((link) => {
          const active = link.href === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(link.href);
          return (
            <Button
              key={link.href}
              asChild
              variant={active ? 'default' : 'outline'}
              size="sm"
              className="rounded-none"
            >
              <Link to={link.href}>{link.label}</Link>
            </Button>
          );
        })}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          logout();
          navigate('/admin/login', { replace: true });
        }}
        className="text-destructive"
      >
        Abmelden
      </Button>
    </div>
  );
}
