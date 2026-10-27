import * as React from "react";
import { Lightbulb, FileText, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalloutType = "tip" | "note" | "warning" | "info";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const configMap: Record<
  CalloutType,
  {
    icon: React.ElementType;
    defaultTitle: string;
    wrapperClass: string;
    iconClass: string;
    titleClass: string;
  }
> = {
  tip: {
    icon: Lightbulb,
    defaultTitle: "Tip",
    wrapperClass:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 dark:border-emerald-500/30 border-l-4",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    titleClass: "text-emerald-900 dark:text-emerald-200",
  },
  note: {
    icon: FileText,
    defaultTitle: "Note",
    wrapperClass:
      "border-sky-500/40 bg-sky-500/10 text-sky-950 dark:text-sky-100 dark:border-sky-500/30 border-l-4",
    iconClass: "text-sky-600 dark:text-sky-400",
    titleClass: "text-sky-900 dark:text-sky-200",
  },
  warning: {
    icon: AlertTriangle,
    defaultTitle: "Warning",
    wrapperClass:
      "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100 dark:border-amber-500/30 border-l-4",
    iconClass: "text-amber-600 dark:text-amber-400",
    titleClass: "text-amber-900 dark:text-amber-200",
  },
  info: {
    icon: Info,
    defaultTitle: "Info",
    wrapperClass:
      "border-cyan-500/40 bg-cyan-500/10 text-cyan-950 dark:text-cyan-100 dark:border-cyan-500/30 border-l-4",
    iconClass: "text-cyan-600 dark:text-cyan-400",
    titleClass: "text-cyan-900 dark:text-cyan-200",
  },
};

export function Callout({
  type = "info",
  title,
  children,
  className,
}: CalloutProps) {
  const config = configMap[type] || configMap.info;
  const Icon = config.icon;
  const displayTitle = title ?? config.defaultTitle;

  return (
    <div
      className={cn(
        "my-4 flex items-start gap-3 rounded-lg p-4 shadow-xs text-sm leading-relaxed",
        config.wrapperClass,
        className
      )}
    >
      <Icon className={cn("size-5 shrink-0 mt-0.5", config.iconClass)} />
      <div className="space-y-1 w-full">
        {displayTitle && (
          <h4 className={cn("font-semibold text-sm tracking-tight", config.titleClass)}>
            {displayTitle}
          </h4>
        )}
        <div className="text-foreground/90">{children}</div>
      </div>
    </div>
  );
}

export function Tip({ title, children, className }: Omit<CalloutProps, "type">) {
  return <Callout type="tip" title={title} className={className}>{children}</Callout>;
}

export function Note({ title, children, className }: Omit<CalloutProps, "type">) {
  return <Callout type="note" title={title} className={className}>{children}</Callout>;
}

export function Warning({ title, children, className }: Omit<CalloutProps, "type">) {
  return <Callout type="warning" title={title} className={className}>{children}</Callout>;
}

export function InfoCallout({ title, children, className }: Omit<CalloutProps, "type">) {
  return <Callout type="info" title={title} className={className}>{children}</Callout>;
}
