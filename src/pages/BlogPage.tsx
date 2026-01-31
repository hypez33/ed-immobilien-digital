import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { Section } from '@/components/ui/Section';
import { BlogCard } from '@/components/cards/BlogCard';
import { useBlogPosts } from '@/hooks/useBlogPosts';

export default function BlogPage() {
  const posts = useBlogPosts({ publicOnly: true });

  return (
    <Layout>
      <SEO
        title="Blog | ED Immobilien"
        description="Ratgeber, Markt-Updates und Tipps rund um Verkauf, Vermietung und Bewertung im Rhein-Neckar-Kreis."
      />

      <Section size="lg" className="pt-10 md:pt-12 lg:pt-14">
        <div className="max-w-3xl" data-reveal>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em]">Blog</span>
          </div>
          <h1 className="font-serif mb-4">Aktuelle Einblicke & Ratgeber</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Markt-Updates, Checklisten und Praxiswissen – kompakt und verständlich.
          </p>
        </div>
      </Section>

      <Section size="lg" variant="surface">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" data-stagger>
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </Section>
    </Layout>
  );
}
