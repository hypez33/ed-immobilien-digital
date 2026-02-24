export interface VisualSource {
  key: string;
  platform: 'Unsplash' | 'Pexels';
  sourceUrl: string;
  photographer: string;
}

export const visualSources: VisualSource[] = [
  {
    key: 'hero-home-side',
    platform: 'Unsplash',
    sourceUrl:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
    photographer: 'Unsplash contributor (placeholder)',
  },
  {
    key: 'footer-home-right',
    platform: 'Pexels',
    sourceUrl:
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600',
    photographer: 'Pexels contributor (placeholder)',
  },
  {
    key: 'listing-01',
    platform: 'Unsplash',
    sourceUrl:
      'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1600&q=80',
    photographer: 'Unsplash contributor (placeholder)',
  },
  {
    key: 'listing-02',
    platform: 'Pexels',
    sourceUrl:
      'https://images.pexels.com/photos/7031408/pexels-photo-7031408.jpeg?auto=compress&cs=tinysrgb&w=1600',
    photographer: 'Pexels contributor (placeholder)',
  },
  {
    key: 'listing-03',
    platform: 'Unsplash',
    sourceUrl:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80',
    photographer: 'Unsplash contributor (placeholder)',
  },
  {
    key: 'listing-04',
    platform: 'Pexels',
    sourceUrl:
      'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1600',
    photographer: 'Pexels contributor (placeholder)',
  },
  {
    key: 'blog-market',
    platform: 'Unsplash',
    sourceUrl:
      'https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1600&q=80',
    photographer: 'Unsplash contributor (placeholder)',
  },
  {
    key: 'blog-checklist',
    platform: 'Pexels',
    sourceUrl:
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1600',
    photographer: 'Pexels contributor (placeholder)',
  },
];
