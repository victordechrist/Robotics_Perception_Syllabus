import React from "react";
import type { MDXComponents } from "mdx/types";
import { AlertTriangle, CheckCircle2, Info, Lightbulb, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom Callout components for MDX
interface CalloutProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
}

export function Callout({ children, title, className }: CalloutProps) {
  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-foreground",
        className
      )}
    >
      <HelpCircle className="size-5 shrink-0 text-primary mt-0.5" />
      <div className="space-y-1">
        {title && <p className="font-semibold text-primary">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function Tip({ children, title = "Tip", className }: CalloutProps) {
  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-relaxed text-emerald-950 dark:text-emerald-100",
        className
      )}
    >
      <Lightbulb className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
      <div className="space-y-1">
        {title && <p className="font-semibold text-emerald-800 dark:text-emerald-300">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function Note({ children, title = "Note", className }: CalloutProps) {
  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 text-sm leading-relaxed text-blue-950 dark:text-blue-100",
        className
      )}
    >
      <CheckCircle2 className="size-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
      <div className="space-y-1">
        {title && <p className="font-semibold text-blue-800 dark:text-blue-300">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function Warning({ children, title = "Warning", className }: CalloutProps) {
  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-950 dark:text-amber-100",
        className
      )}
    >
      <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
      <div className="space-y-1">
        {title && <p className="font-semibold text-amber-800 dark:text-amber-300">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function InfoCallout({ children, title = "Info", className }: CalloutProps) {
  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border border-sky-500/30 bg-sky-500/10 p-4 text-sm leading-relaxed text-sky-950 dark:text-sky-100",
        className
      )}
    >
      <Info className="size-5 shrink-0 text-sky-600 dark:text-sky-400 mt-0.5" />
      <div className="space-y-1">
        {title && <p className="font-semibold text-sky-800 dark:text-sky-300">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Typography maps
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        className={cn(
          "mt-8 mb-4 scroll-m-20 text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl",
          className
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className={cn(
          "mt-8 mb-3 border-b pb-2 scroll-m-20 text-2xl font-semibold tracking-tight text-foreground first:mt-0",
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className={cn(
          "mt-6 mb-2 scroll-m-20 text-xl font-semibold tracking-tight text-foreground",
          className
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        className={cn(
          "mt-4 mb-2 scroll-m-20 text-lg font-medium tracking-tight text-foreground",
          className
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p
        className={cn("leading-7 text-foreground [&:not(:first-child)]:mt-4", className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className={cn("my-4 ml-6 list-disc space-y-2 text-foreground", className)} {...props} />
    ),
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className={cn("my-4 ml-6 list-decimal space-y-2 text-foreground", className)} {...props} />
    ),
    li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className={cn("leading-relaxed", className)} {...props} />
    ),
    blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className={cn(
          "mt-4 border-l-4 border-primary/50 pl-4 italic text-muted-foreground",
          className
        )}
        {...props}
      />
    ),
    hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
      <hr className={cn("my-8 border-border", className)} {...props} />
    ),
    table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="my-6 w-full overflow-y-auto rounded-lg border border-border">
        <table className={cn("w-full text-sm", className)} {...props} />
      </div>
    ),
    thead: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className={cn("border-b bg-muted/50 font-medium", className)} {...props} />
    ),
    tbody: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
    ),
    tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr className={cn("border-b transition-colors hover:bg-muted/30", className)} {...props} />
    ),
    th: ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
      <th
        className={cn("p-3 text-left font-semibold text-foreground border-r last:border-r-0", className)}
        {...props}
      />
    ),
    td: ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
      <td
        className={cn("p-3 text-foreground border-r last:border-r-0", className)}
        {...props}
      />
    ),
    pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
      <pre
        className={cn(
          "my-6 overflow-x-auto rounded-lg border border-border/60 bg-neutral-950 p-4 font-mono text-sm leading-relaxed text-neutral-100 shadow-sm",
          className
        )}
        {...props}
      />
    ),
    code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
      // Fenced code blocks from rehype-pretty-code/shiki render <code data-language="..."> or inside <pre>
      const isInline =
        typeof children === "string" &&
        !className?.includes("language-") &&
        !("data-language" in props);

      if (isInline) {
        return (
          <code
            className={cn(
              "rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground border border-border/50",
              className
            )}
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <code className={cn("font-mono text-xs sm:text-sm", className)} {...props}>
          {children}
        </code>
      );
    },
    a: ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        className={cn(
          "font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors",
          className
        )}
        {...props}
      />
    ),

    // Register Callout components
    Callout,
    Tip,
    Note,
    Warning,
    InfoCallout,

    ...components,
  };
}
