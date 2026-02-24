export const siteConfig = {
  brandName: 'ED Immobilien',
  region: 'Rhein-Neckar-Kreis',
  phone: '+49 (0) 123 456789',
  email: 'info@ed-immobilien.de',
  addressText: 'Edingen-Neckarhausen',
  openingHoursText: 'Mo–Fr: 9:00–18:00 Uhr',
};

export const getSiteUrl = () => {
  const envUrl = import.meta.env.VITE_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return '';
};
