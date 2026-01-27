import { useEffect } from 'react';
import { FAQItem } from '@/data/faq';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SchemaOrgProps {
  type: 'LocalBusiness' | 'BreadcrumbList' | 'FAQPage';
  breadcrumbs?: BreadcrumbItem[];
  faqItems?: FAQItem[];
}

export function SchemaOrg({ type, breadcrumbs, faqItems }: SchemaOrgProps) {
  useEffect(() => {
    const scriptId = `schema-${type}`;
    let existingScript = document.getElementById(scriptId);
    
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';

    let schema: object;

    switch (type) {
      case 'LocalBusiness':
        schema = {
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          name: 'ED Immobilien',
          description: 'Immobilienmakler für Verkauf und Vermietung im Rhein-Neckar-Kreis',
          url: 'https://ed-immobilien.de',
          telephone: '+49-123-456789',
          email: 'info@ed-immobilien.de',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Edingen-Neckarhausen',
            addressRegion: 'Baden-Württemberg',
            addressCountry: 'DE',
          },
          areaServed: {
            '@type': 'AdministrativeArea',
            name: 'Rhein-Neckar-Kreis',
          },
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
          },
        };
        break;

      case 'BreadcrumbList':
        schema = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs?.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        };
        break;

      case 'FAQPage':
        schema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems?.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        };
        break;

      default:
        return;
    }

    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, breadcrumbs, faqItems]);

  return null;
}
