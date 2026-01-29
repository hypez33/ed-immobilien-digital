import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPublishedPosts, 
  getAllPosts, 
  upsertPost, 
  deletePost,
  BlogPost,
  CreateBlogPostPayload
} from '@/lib/blogService';

// Fallback data for when database is empty or unavailable
const fallbackPosts: BlogPost[] = [
  {
    id: 'markt-2026-rhein-neckar',
    slug: 'immobilienmarkt-2026-rhein-neckar',
    title: 'Immobilienmarkt 2026 im Rhein-Neckar-Kreis: Trends & Chancen',
    excerpt: 'Welche Entwicklungen prägen den regionalen Markt, wie verändern sich Nachfrage und Preisniveaus und wo liegen Chancen für Käufer und Verkäufer?',
    date: '2026-01-12',
    category: 'Markt',
    cover: null,
    content: 'Der Rhein-Neckar-Kreis bleibt ein gefragter Wohnstandort. In vielen Lagen zeigt sich eine stabile Nachfrage, während sich das Tempo der Preisentwicklung normalisiert.\n\nWer verkaufen möchte, profitiert von professioneller Aufbereitung und klarer Zielgruppenansprache. Käufer wiederum gewinnen mehr Zeit für die Entscheidung und sollten eine solide Finanzierungsvorbereitung mitbringen.',
    status: 'published',
    created_at: '2026-01-12T00:00:00Z',
    updated_at: '2026-01-12T00:00:00Z',
  },
  {
    id: 'verkauf-vorbereitung-checkliste',
    slug: 'verkauf-checkliste-immobilie',
    title: 'Verkauf vorbereiten: Die 7 wichtigsten Schritte',
    excerpt: 'Von Unterlagen bis Exposé – mit dieser Checkliste bringen Sie Ihre Immobilie strukturiert auf den Markt und vermeiden typische Verzögerungen.',
    date: '2026-01-05',
    category: 'Praxis',
    cover: null,
    content: 'Eine strukturierte Vorbereitung spart Zeit und steigert die Qualität der Vermarktung. Dazu gehören vollständige Unterlagen, eine klare Preisstrategie und hochwertige Bilder.\n\nAuch kleine Verbesserungen an der Immobilie können die Wahrnehmung deutlich erhöhen. Wir unterstützen Sie dabei, die richtigen Maßnahmen zu priorisieren.',
    status: 'published',
    created_at: '2026-01-05T00:00:00Z',
    updated_at: '2026-01-05T00:00:00Z',
  },
];

export function useBlogPosts({ publicOnly = false }: { publicOnly?: boolean } = {}) {
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['blog-posts', publicOnly],
    queryFn: () => publicOnly ? getPublishedPosts() : getAllPosts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Return fallback data if no posts and not loading
  if (!isLoading && posts.length === 0 && !error) {
    return publicOnly 
      ? fallbackPosts.filter(p => p.status === 'published')
      : fallbackPosts;
  }

  return posts;
}

export function useBlogPostMutations() {
  const queryClient = useQueryClient();

  const upsertMutation = useMutation({
    mutationFn: (post: CreateBlogPostPayload & { id?: string }) => upsertPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });

  return {
    upsertPost: upsertMutation.mutateAsync,
    deletePost: deleteMutation.mutateAsync,
    isUpserting: upsertMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// Re-export BlogPost type for convenience
export type { BlogPost } from '@/lib/blogService';
