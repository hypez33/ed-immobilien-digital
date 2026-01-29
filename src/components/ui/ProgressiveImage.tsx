import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  placeholderColor?: string;
  aspectRatio?: string;
  priority?: boolean;
}

export function ProgressiveImage({
  src,
  alt,
  className,
  containerClassName,
  placeholderColor = 'hsl(229 19% 22% / 0.1)',
  aspectRatio,
  priority = false,
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!isInView || !imgRef.current) return;

    if (imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', containerClassName)}
      style={{
        backgroundColor: placeholderColor,
        aspectRatio,
      }}
    >
      {/* Animated placeholder shimmer */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent',
          'animate-[shimmer_2s_infinite] -translate-x-full',
          isLoaded && 'hidden'
        )}
        style={{
          backgroundSize: '200% 100%',
        }}
      />

      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-700',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
        />
      )}
    </div>
  );
}
