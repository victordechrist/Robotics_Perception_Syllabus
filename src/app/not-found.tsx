import Link from "next/link";
import { Bot, ArrowLeft, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-20 sm:py-32 flex flex-col items-center justify-center text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/80 text-primary mb-6 shadow-sm ring-1 ring-border">
        <Bot className="size-8 text-cyan-500" />
      </div>

      <div className="space-y-3 max-w-md">
        <span className="inline-block px-3 py-1 text-xs font-mono font-semibold text-amber-500 bg-amber-500/10 rounded-full border border-amber-500/20">
          ERROR 404 · SENSOR LOSS
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Page Not Found
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          The requested route could not be detected by our perception pipeline. It may have moved or doesn&apos;t exist.
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className={cn(buttonVariants({ size: "lg" }), "gap-2")}
        >
          <ArrowLeft className="size-4" />
          Return to Homepage
        </Link>
        <Link
          href="/syllabus"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2")}
        >
          <Search className="size-4" />
          View Syllabus
        </Link>
      </div>
    </div>
  );
}
