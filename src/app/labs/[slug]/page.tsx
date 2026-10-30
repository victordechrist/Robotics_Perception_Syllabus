import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { labs } from "@/data/labs";
import { getExercise } from "@/lib/exercises";
import { getLabTask } from "@/lib/consensus";
import { ExercisePlayer } from "@/components/exercise/ExercisePlayer";
import { ConsensusWorkspace } from "@/components/consensus/ConsensusWorkspace";
import { LabTabs } from "@/components/labs/LabTabs";
import { LabViewLogger } from "@/components/labs/LabViewLogger";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Lock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

// 5.4 generateStaticParams returns all 15 lab slugs
export async function generateStaticParams() {
  return labs.map((lab) => ({
    slug: lab.slug,
  }));
}

// 5.4 dynamicParams = false
export const dynamicParams = false;

interface LabPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LabDetailPage({ params }: LabPageProps) {
  const { slug } = await params;

  const lab = labs.find((l) => l.slug === slug);
  if (!lab) {
    notFound();
  }

  // 5.4 Try to dynamic import MDX if lab.hasMdx is true
  let MdxComponent: React.ComponentType | null = null;

  if (lab.hasMdx) {
    try {
      const mdxModule = await import(`@/content/labs/${slug}.mdx`);
      MdxComponent = mdxModule.default;
    } catch (e) {
      console.error(`Failed to load MDX for lab ${slug}:`, e);
      MdxComponent = null;
    }
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <LabViewLogger labSlug={slug} />
      {/* Top navigation back link */}
      <div>
        <Link
          href="/labs"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer -ml-2"
          )}
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to All Labs</span>
        </Link>
      </div>

      {/* Lab Header banner */}
      <header className="space-y-3 pb-6 border-b border-border/60">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="outline" className="font-bold text-xs bg-muted/50">
            Week {lab.week}
          </Badge>
          <Badge variant="secondary" className="font-medium text-xs">
            {lab.group}
          </Badge>
          <Badge
            variant="secondary"
            className={cn(
              "text-xs font-semibold",
              lab.hasMdx
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                : "bg-muted text-muted-foreground"
            )}
          >
            {lab.hasMdx ? "Lab Assignment Available" : "Materials Pending"}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {lab.title}
        </h1>

        <p className="text-base text-muted-foreground leading-relaxed">
          {lab.description}
        </p>
      </header>

      {/* Lab Content Body */}
      <main>
        {(() => {
          const guide = MdxComponent ? (
            <article className="prose dark:prose-invert max-w-none">
              <MdxComponent />
            </article>
          ) : (
          /* Styled "Lab materials coming soon" placeholder for non-MDX labs */
          <Card className="border-dashed border-2 border-border/80 my-12">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2">
                <Lock className="size-6" />
              </div>
              <CardTitle className="text-2xl font-bold">Lab Materials Coming Soon</CardTitle>
              <CardDescription className="text-base max-w-md mx-auto mt-1">
                The hands-on exercise and starter template for <span className="font-semibold text-foreground">&ldquo;{lab.title}&rdquo;</span> will be unlocked during Week {lab.week}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="rounded-lg border border-border/60 bg-card p-5 max-w-xl mx-auto space-y-3 text-left">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <BookOpen className="size-4 text-primary" />
                  <span>Module Overview</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lab.description}
                </p>
                <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground font-medium border-t border-border/40">
                  <Clock className="size-3.5 text-amber-500" />
                  <span>Expected release date: Week {lab.week} scheduled lecture period.</span>
                </div>
              </div>

              <div className="flex justify-center">
                <Link
                  href="/labs"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2 cursor-pointer")}
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Return to Labs List</span>
                </Link>
              </div>
            </CardContent>
          </Card>
          );

          const exercise = getExercise(slug);
          const task = getLabTask(slug);

          return (
            <LabTabs
              guide={guide}
              exercise={
                exercise ? <ExercisePlayer exercise={exercise} /> : undefined
              }
              workspace={
                task ? <ConsensusWorkspace task={task} /> : undefined
              }
            />
          );
        })()}
      </main>
    </div>
  );
}
