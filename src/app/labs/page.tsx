import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/course/page-header";
import { Section } from "@/components/course/section";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { labs, Lab } from "@/data/labs";
import { getExercise } from "@/lib/exercises";
import { getLabTask } from "@/lib/consensus";
import { previousVisibleLab } from "@/lib/exercises/gating";
import { ExerciseProgressBadge } from "@/components/labs/ExerciseProgressBadge";
import { WorkspaceProgressBadge } from "@/components/labs/WorkspaceProgressBadge";
import { LabLockBadge } from "@/components/labs/LabLockBadge";
import { capstoneMilestones } from "@/data/assessments";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Code2, Flag, Lock, Rocket, Sparkles, Terminal } from "lucide-react";

const strongCapstonePoints = [
  "End-to-end integration of camera geometry, visual odometry, and state estimation.",
  "Real-time processing performance meeting strict latency constraints (sub-50ms latency).",
  "Robust handling of real-world sensor noise, lens distortion, and dynamic lighting conditions.",
  "Modular architecture using ROS 2, clean Python/NumPy/OpenCV APIs, and automated telemetry logging.",
  "Quantitative validation against ground-truth trajectories with clear error distribution metrics.",
];

export default function LabsPage() {
  // Group labs by group
  const groups: Lab["group"][] = ["Foundations", "Vision", "Estimation & SLAM", "Capstone"];

  return (
    <div className="space-y-4 pb-16">
      {/* 5.1 PageHeader */}
      <PageHeader
        title="Labs & Hands-On Modules"
        subtitle="15 weekly practical coding assignments designed to build production-grade autonomous vision and SLAM pipelines step-by-step."
        badge={
          <Badge variant="secondary" className="gap-1.5 font-medium px-3 py-1 text-xs">
            <Code2 className="size-3.5 text-primary" />
            15 Practical Modules
          </Badge>
        }
      />

      <main className="space-y-10">
        {/* 5.2 Featured Capstone Card at top with milestones + What a strong capstone shows */}
        <section>
          <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 size-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge variant="default" className="gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  <Rocket className="size-3.5" />
                  Featured Capstone Project
                </Badge>
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Sparkles className="size-3 text-amber-500" /> Weeks 13–15
                </span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-foreground">
                Autonomous Visual SLAM & Navigation Pipeline
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground leading-relaxed mt-1">
                The ultimate culmination of CS 289. Teams design, implement, and benchmark an integrated visual-inertial odometry and localization system operating on real dynamic datasets.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid lg:grid-cols-2 gap-8 pt-2">
              {/* Capstone Milestones */}
              <div className="space-y-4 rounded-xl border border-border/60 bg-background/50 p-5">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Flag className="size-4.5 text-primary" />
                  Capstone Development Milestones
                </h3>
                <div className="space-y-3">
                  {capstoneMilestones.map((m) => (
                    <div key={m.week} className="flex items-start gap-3 text-sm">
                      <Badge variant="outline" className="shrink-0 text-xs font-bold border-primary/30 bg-primary/5 text-primary mt-0.5">
                        Week {m.week}
                      </Badge>
                      <div>
                        <span className="font-semibold text-foreground">{m.label}: </span>
                        <span className="text-muted-foreground leading-relaxed">{m.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What a Strong Capstone Shows */}
              <div className="space-y-4 rounded-xl border border-border/60 bg-background/50 p-5">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <CheckCircle2 className="size-4.5 text-emerald-500" />
                  What a Strong Capstone Shows
                </h3>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {strongCapstonePoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="size-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter className="bg-muted/30 border-t border-border/40 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Terminal className="size-4 text-primary" />
                <span>ROS 2 / Python / OpenCV / GTSAM stack integration</span>
              </div>
              <Link
                href="/labs/week-15-capstone-final"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "gap-1.5 font-semibold text-xs cursor-pointer"
                )}
              >
                <span>View Capstone Specifications</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </CardFooter>
          </Card>
        </section>

        {/* 5.1 Lab cards grouped by group */}
        {groups.map((groupName) => {
          const groupLabs = labs.filter((lab) => lab.group === groupName);
          if (groupLabs.length === 0) return null;

          return (
            <Section
              key={groupName}
              title={`${groupName} Modules`}
              subtitle={`Hands-on lab modules focused on ${groupName.toLowerCase()} algorithms and implementations.`}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupLabs.map((lab) => (
                  <Card key={lab.slug} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                    <CardHeader className="space-y-2.5 pb-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="font-bold text-xs bg-muted/50">
                          Week {lab.week}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] font-semibold uppercase tracking-wide",
                            lab.hasMdx
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {lab.hasMdx ? "Available Now" : "Upcoming"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold leading-snug text-foreground">
                        {lab.title}
                      </CardTitle>
                      <CardDescription className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                        {lab.description}
                      </CardDescription>
                      {(getExercise(lab.slug) || getLabTask(lab.slug)) && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {getExercise(lab.slug) && (
                            <ExerciseProgressBadge
                              labSlug={lab.slug}
                              steps={getExercise(lab.slug)!.steps}
                            />
                          )}
                          {getLabTask(lab.slug) && (
                            <WorkspaceProgressBadge
                              labSlug={lab.slug}
                              goldTotal={getLabTask(lab.slug)!.goldTree.nodes.length}
                            />
                          )}
                          <LabLockBadge
                            labSlug={lab.slug}
                            previousSlug={previousVisibleLab(lab.slug)?.slug}
                            previousTitle={previousVisibleLab(lab.slug)?.title}
                          />
                        </div>
                      )}
                    </CardHeader>

                    <CardFooter className="pt-3 border-t border-border/40">
                      {(lab.hasMdx || getExercise(lab.slug) || getLabTask(lab.slug)) ? (
                        <Link
                          href={`/labs/${lab.slug}`}
                          className={cn(
                            buttonVariants({ variant: "default", size: "sm" }),
                            "w-full justify-between gap-1.5 text-xs font-semibold cursor-pointer"
                          )}
                        >
                          <span>View lab</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      ) : (
                        <button
                          disabled
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "w-full justify-center gap-1.5 text-xs text-muted-foreground opacity-60 cursor-not-allowed"
                          )}
                        >
                          <Lock className="size-3" />
                          <span>Materials coming soon</span>
                        </button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </Section>
          );
        })}
      </main>
    </div>
  );
}
