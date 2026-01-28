import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import NotFound from '@/pages/NotFound';

export default function BlogPostPage() {
  const { slug } = useParams();
  const posts = useBlogPosts({ publicOnly: true });
  const post = posts.find((entry) => entry.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  const dateLabel = post.date
    ? new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(post.date))
    : null;
  const paragraphs = post.content ? post.content.split('\n\n') : [];

  return (
    <Layout>
      <SEO title={`${post.title} | ED Immobilien`} description={post.excerpt} />

      <Section size="lg">
        <div className="max-w-3xl" data-reveal>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em]">Blog</span>
          </div>
          <h1 className="font-serif mb-4">{post.title}</h1>
          {dateLabel && (
            <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-6">
              {dateLabel}
            </p>
          )}
          {post.cover && (
            <div className="aspect-[16/9] overflow-hidden bg-surface border border-border/40 mb-8">
              <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            {paragraphs.length ? (
              paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>{post.excerpt}</p>
            )}
          </div>
          <div className="mt-10">
            <Button asChild variant="outline" className="rounded-none">
              <Link to="/blog">Zur Übersicht</Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
