import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "border-b border-border/60 bg-muted/20 py-8 sm:py-12",
        className
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
        {badge && <div className="inline-flex items-center">{badge}</div>}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
        {children && <div className="pt-2">{children}</div>}
      </div>
    </div>
  );
}
