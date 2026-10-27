import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function Section({
  title,
  subtitle,
  children,
  className,
  containerClassName,
  id,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-8 sm:py-12 border-b border-border/40 last:border-b-0", className)}
      {...props}
    >
      <div className={cn("container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6", containerClassName)}>
        {(title || subtitle) && (
          <div className="space-y-1.5">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
