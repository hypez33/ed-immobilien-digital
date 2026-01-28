import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/data/blog';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const dateLabel = post.date
    ? new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(post.date))
    : null;

  return (
    <article className="bg-card border border-border/40 p-6 md:p-8 flex flex-col h-full" data-stagger-item>
      {post.cover && (
        <div className="mb-6 aspect-[16/9] overflow-hidden bg-surface">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        {post.category && (
          <Badge className="bg-gold/10 text-gold border-gold/20">
            {post.category}
          </Badge>
        )}
        {dateLabel && (
          <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {dateLabel}
          </span>
        )}
      </div>

      <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3">{post.title}</h3>
      <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-6">
        {post.excerpt}
      </p>

      <Button asChild className="mt-auto rounded-none">
        <Link to={`/blog/${post.slug}`}>
          Weiterlesen
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </Button>
    </article>
  );
}
