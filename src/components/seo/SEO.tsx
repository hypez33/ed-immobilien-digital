import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogImageAlt?: string;
  noIndex?: boolean;
}

export function SEO({
  title,
  description,
  canonical,
  ogImage = 'https://ed-immobilien.de/og-image.jpg',
  ogImageAlt = 'ED Immobilien - Makler im Rhein-Neckar-Kreis',
  noIndex = false,
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to update or create meta tag
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('robots', noIndex ? 'noindex,nofollow' : 'index,follow');

    // OpenGraph
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:image', ogImage, true);
    updateMeta('og:image:alt', ogImageAlt, true);
    updateMeta('og:site_name', 'ED Immobilien', true);
    updateMeta('og:locale', 'de_DE', true);

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage);
    updateMeta('twitter:image:alt', ogImageAlt);

    // Canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical || window.location.href;

    return () => {
      // Cleanup if needed
    };
  }, [title, description, canonical, ogImage, ogImageAlt, noIndex]);

  return null;
}
