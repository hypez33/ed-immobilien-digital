import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { BlogPost } from '@/hooks/useBlogPosts';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const dateLabel = post.date
    ? new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(post.date))
    : null;

  return (
    <article className="ui-interactive-card group bg-card border border-border/40 p-6 md:p-8 flex flex-col h-full overflow-hidden hover:border-gold/30" data-stagger-item>
      {post.cover && (
        <div className="mb-6 relative aspect-[16/9] ui-visual-frame ui-depth-hover bg-surface overflow-hidden">
          <ProgressiveImage
            src={post.cover}
            alt={post.title}
            containerClassName="h-full w-full"
            className="transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transform-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />
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

      <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3 group-hover:text-gold transition-colors duration-300">{post.title}</h3>
      <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-6">
        {post.excerpt}
      </p>

      <Button asChild className="mt-auto rounded-none">
        <Link to={`/blog/${post.slug}`}>
          Weiterlesen
          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none" />
        </Link>
      </Button>
    </article>
  );
}
