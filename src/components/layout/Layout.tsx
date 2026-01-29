import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useGsapPage } from '@/hooks/useGsapPage';
import { BackToTopButton } from '@/components/BackToTopButton';
import { MobileCTA } from '@/components/MobileCTA';
import { CookieBanner } from '@/components/consent/CookieBanner';

interface LayoutProps {
  children: ReactNode;
  showMobileCTA?: boolean;
}

export function Layout({ children, showMobileCTA = true }: LayoutProps) {
  useGsapPage();
  return (
    <div id="smooth-wrapper" className="overflow-x-hidden">
      <div
        data-scroll-indicator
        className="fixed top-0 left-0 h-1 w-full origin-left scale-x-0 bg-gold z-[60] pointer-events-none"
        aria-hidden="true"
      />
      <BackToTopButton />
      {showMobileCTA && <MobileCTA />}
      <CookieBanner />
      <Header />
      <div id="smooth-content" className="flex min-h-screen flex-col pt-18 md:pt-20">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
