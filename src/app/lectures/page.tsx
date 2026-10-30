import React from "react";
import Link from "next/link";
import { getLectures } from "@/lib/lectures";
import { PageHeader } from "@/components/course/page-header";
import { Section } from "@/components/course/section";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Calendar, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LecturesPage() {
  const lectures = getLectures();

  return (
    <div className="space-y-4 pb-16">
      {/* Page Header */}
      <PageHeader
        title="Lecture Notes & Slides"
        subtitle="Comprehensive weekly lecture notes, mathematical derivations, and slide references for robotics perception and spatial AI."
        badge={
          <Badge variant="secondary" className="gap-1.5 font-medium px-3 py-1 text-xs">
            <GraduationCap className="size-3.5 text-primary" />
            Lecture Series
          </Badge>
        }
      />

      <main>
        <Section
          title="Published Lectures"
          subtitle="Explore published lecture notes and conceptual walkthroughs."
        >
          {lectures.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-lg text-muted-foreground">
              No lecture notes published yet. Check back soon!
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {lectures.map((lecture) => (
                <Card key={lecture.slug} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                  <CardHeader className="space-y-2.5 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="font-bold text-xs bg-muted/50">
                        Week {lecture.week}
                      </Badge>
                      {lecture.date && (
                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                          <Calendar className="size-3" />
                          {lecture.date}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold leading-snug text-foreground">
                      {lecture.title}
                    </CardTitle>
                    <CardDescription className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      {lecture.description}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="pt-3 border-t border-border/40">
                    <Link
                      href={`/lectures/${lecture.slug}`}
                      className={cn(
                        buttonVariants({ variant: "default", size: "sm" }),
                        "w-full justify-between gap-1.5 text-xs font-semibold cursor-pointer"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="size-3.5" />
                        <span>Read lecture notes</span>
                      </div>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </Section>
      </main>
    </div>
  );
}
