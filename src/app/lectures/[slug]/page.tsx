import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLectures } from "@/lib/lectures";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Calendar, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

// 6.3 generateStaticParams from getLectures()
export async function generateStaticParams() {
  const lectures = getLectures();
  return lectures.map((lecture) => ({
    slug: lecture.slug,
  }));
}

// 6.3 dynamicParams = false
export const dynamicParams = false;

interface LecturePageProps {
  params: Promise<{ slug: string }>;
}

export default async function LectureDetailPage({ params }: LecturePageProps) {
  const { slug } = await params;

  const lectures = getLectures();
  const lecture = lectures.find((l) => l.slug === slug);

  if (!lecture) {
    notFound();
  }

  let MdxComponent: React.ComponentType | null = null;
  try {
    const mdxModule = await import(`@/content/lectures/${slug}.mdx`);
    MdxComponent = mdxModule.default;
  } catch (e) {
    console.error(`Failed to load MDX for lecture ${slug}:`, e);
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-8">
      {/* Top navigation back link */}
      <div>
        <Link
          href="/lectures"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer -ml-2"
          )}
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to All Lectures</span>
        </Link>
      </div>

      {/* Lecture Header banner */}
      <header className="space-y-3 pb-6 border-b border-border/60">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="outline" className="font-bold text-xs bg-muted/50">
            Week {lecture.week}
          </Badge>
          {lecture.date && (
            <Badge variant="secondary" className="gap-1 font-medium text-xs">
              <Calendar className="size-3 text-muted-foreground" />
              {lecture.date}
            </Badge>
          )}
          <Badge variant="secondary" className="gap-1 font-semibold text-xs bg-primary/10 text-primary">
            <GraduationCap className="size-3" />
            Course Lecture
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {lecture.title}
        </h1>

        {lecture.description && (
          <p className="text-base text-muted-foreground leading-relaxed">
            {lecture.description}
          </p>
        )}
      </header>

      {/* Lecture Content Body */}
      <main>
        <article className="prose dark:prose-invert max-w-none">
          {MdxComponent ? <MdxComponent /> : null}
        </article>
      </main>
    </div>
  );
}
