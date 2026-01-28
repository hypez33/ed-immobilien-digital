import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[0.95rem] font-semibold leading-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 motion-safe:transition-[transform,box-shadow,background-color,color,border-color] motion-safe:duration-200 motion-safe:ease-out motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-card hover:bg-primary/90 hover:shadow-card-hover motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.01] motion-safe:active:translate-y-0 motion-safe:active:scale-[0.99]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-card hover:bg-destructive/90 hover:shadow-card-hover motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.01] motion-safe:active:translate-y-0 motion-safe:active:scale-[0.99]",
        outline:
          "border border-input bg-background text-foreground shadow-sm hover:bg-accent/5 hover:border-accent/40 hover:shadow-card motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.01] motion-safe:active:translate-y-0 motion-safe:active:scale-[0.99]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-card hover:bg-secondary/80 hover:shadow-card-hover motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.01] motion-safe:active:translate-y-0 motion-safe:active:scale-[0.99]",
        ghost: "bg-transparent text-foreground/80 hover:text-foreground hover:bg-accent/10 shadow-none",
        link: "bg-transparent text-primary underline-offset-4 hover:underline shadow-none",
      },
      size: {
        sm: "h-11 px-4 text-sm",
        default: "h-12 px-6",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
