import * as React from 'react';
import { cn } from '@/lib/utils';

type BurgerButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  open: boolean;
  onToggle: () => void;
  bouncing?: boolean;
  reduceMotion?: boolean;
  onAnimationEnd?: () => void;
  className?: string;
  controlsId?: string;
  ariaLabel?: string;
};

export const BurgerButton = React.forwardRef<HTMLButtonElement, BurgerButtonProps>(
  (
    {
      open,
      onToggle,
      bouncing = false,
      reduceMotion = false,
      onAnimationEnd,
      className,
      controlsId = 'mobile-menu-panel',
      ariaLabel,
      ...rest
    },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'p-3 text-foreground hover:bg-muted/50 transition-colors motion-safe:active:scale-[0.98]',
        className
      )}
      onClick={onToggle}
      aria-label={ariaLabel ?? (open ? 'Menü schließen' : 'Menü öffnen')}
      aria-expanded={open}
      aria-controls={controlsId}
      data-state={open ? 'open' : 'closed'}
      data-bounce={bouncing ? 'true' : 'false'}
      {...rest}
    >
      <span
        className={cn('inline-flex items-center justify-center', bouncing && !reduceMotion && 'animate-burger-bounce')}
        onAnimationEnd={onAnimationEnd}
      >
        <span className="burger-lines" aria-hidden="true">
          <span className="burger-line burger-line--top" />
          <span className="burger-line burger-line--middle" />
          <span className="burger-line burger-line--bottom" />
        </span>
      </span>
    </button>
  )
);

BurgerButton.displayName = 'BurgerButton';
