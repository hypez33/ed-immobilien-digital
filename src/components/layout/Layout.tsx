import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useGsapPage } from '@/hooks/useGsapPage';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useGsapPage();
  return (
    <div id="smooth-wrapper">
      <div
        data-scroll-indicator
        className="fixed top-0 left-0 h-1 w-full origin-left scale-x-0 bg-gold z-[60] pointer-events-none"
        aria-hidden="true"
      />
      <Header />
      <div id="smooth-content" className="flex min-h-screen flex-col pt-18 md:pt-20">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
