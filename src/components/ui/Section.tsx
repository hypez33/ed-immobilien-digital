import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'surface' | 'primary';
  id?: string;
  size?: 'default' | 'sm' | 'lg';
}

export function Section({ 
  children, 
  className, 
  variant = 'default', 
  id,
  size = 'default' 
}: SectionProps) {
  const sizeClasses = {
    default: 'section-padding',
    sm: 'section-padding-sm',
    lg: 'section-padding-lg',
  };

  return (
    <section
      id={id}
      className={cn(
        sizeClasses[size],
        variant === 'surface' && 'bg-surface',
        variant === 'primary' && 'bg-primary text-primary-foreground',
        className
      )}
    >
      <div className="container">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  badge?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export function SectionHeader({ 
  title, 
  subtitle, 
  centered = false,
  badge,
  className,
  as: Tag = 'h2'
}: SectionHeaderProps) {
  return (
    <header className={cn('mb-10 md:mb-12', centered && 'text-center', className)}>
      {badge && (
        <span className="feature-badge mb-4 inline-block">{badge}</span>
      )}
      <Tag className={cn(
        Tag === 'h1' && 'text-3xl md:text-4xl lg:text-5xl',
        Tag === 'h2' && 'text-2xl md:text-3xl',
        Tag === 'h3' && 'text-xl md:text-2xl',
        'mb-3 text-balance'
      )}>
        {title}
      </Tag>
      {subtitle && (
        <p className={cn(
          'text-lg text-muted-foreground leading-relaxed',
          centered ? 'max-w-2xl mx-auto' : 'max-w-3xl'
        )}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
