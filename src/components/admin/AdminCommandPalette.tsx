import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useInquiries } from '@/hooks/useInquiries';

const MAX_RESULTS = 6;

export function AdminCommandPalette() {
  const navigate = useNavigate();
  const posts = useBlogPosts();
  const { inquiries } = useInquiries();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isModifier = event.metaKey || event.ctrlKey;
      if (!isModifier || event.key.toLowerCase() !== 'k') return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      event.preventDefault();
      setOpen((prev) => !prev);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const recentPosts = useMemo(() => posts.slice(0, MAX_RESULTS), [posts]);
  const recentInquiries = useMemo(() => inquiries.slice(0, MAX_RESULTS), [inquiries]);

  const navigateTo = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Suchen oder navigieren..." />
      <CommandList>
        <CommandEmpty>Keine Treffer gefunden.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem value="Dashboard" onSelect={() => navigateTo('/admin')}>
            Dashboard
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
          <CommandItem value="Blog" onSelect={() => navigateTo('/admin/blog')}>
            Blog
          </CommandItem>
          <CommandItem value="Immobilien" onSelect={() => navigateTo('/admin/immobilien')}>
            Immobilien
          </CommandItem>
          <CommandItem value="Anfragen" onSelect={() => navigateTo('/admin/anfragen')}>
            Anfragen
          </CommandItem>
          <CommandItem value="Analytics" onSelect={() => navigateTo('/admin/analytics')}>
            Analytics
          </CommandItem>
          <CommandItem value="Zur Website" onSelect={() => navigateTo('/')}>
            Zur Website
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Blogposts">
          {recentPosts.map((post) => (
            <CommandItem
              key={post.id}
              value={`Blog ${post.title}`}
              onSelect={() => navigateTo(`/admin/blog?edit=${post.id}`)}
            >
              {post.title}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Anfragen">
          {recentInquiries.map((inquiry) => (
            <CommandItem
              key={inquiry.id}
              value={`Anfrage ${inquiry.name} ${inquiry.email} ${inquiry.service_or_anliegen}`}
              onSelect={() => navigateTo(`/admin/anfragen?selected=${inquiry.id}`)}
            >
              {inquiry.name} · {inquiry.service_or_anliegen}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
