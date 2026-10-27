import { PageHeader } from "@/components/course/page-header";
import { Section } from "@/components/course/section";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { assessments, capstoneMilestones, latePolicy } from "@/data/assessments";
import { courseDescription, learningOutcomes, prerequisites, theme } from "@/data/outcomes";
import { resources } from "@/data/resources";
import { schedule } from "@/data/schedule";
import { cn } from "@/lib/utils";
import { BookOpen, Clock, Download, ExternalLink, FileText, Flag, Sparkles } from "lucide-react";

export default function SyllabusPage() {
  return (
    <div className="space-y-2 pb-16">
      {/* 4.1 PageHeader: title + description + theme */}
      <PageHeader
        title="Syllabus"
        subtitle={courseDescription}
        badge={
          <Badge variant="secondary" className="gap-1.5 font-medium px-3 py-1 text-xs">
            <Sparkles className="size-3.5 text-primary" />
            {theme}
          </Badge>
        }
      />

      <main>
        {/* 4.2 Learning outcomes: numbered list from data */}
        <Section
          title="Learning Outcomes"
          subtitle="Key concepts, algorithms, and technical skills you will master"
        >
          <ol className="grid gap-3">
            {learningOutcomes.map((outcome, index) => (
              <li
                key={index}
                className="flex items-start gap-3.5 p-4 rounded-lg border border-border/60 bg-card text-card-foreground shadow-2xs"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-base text-foreground leading-relaxed pt-0.5">
                  {outcome}
                </span>
              </li>
            ))}
          </ol>
        </Section>

        {/* 4.3 Prerequisites + self-check table from data */}
        <Section
          title="Prerequisites & Self-Check"
          subtitle="Recommended technical background and baseline conceptual knowledge"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[220px]">Prerequisite</TableHead>
                <TableHead className="w-[320px]">Description</TableHead>
                <TableHead>Self-Check Question</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prerequisites.map((prereq, index) => (
                <TableRow key={index}>
                  <TableCell className="font-semibold text-foreground align-top">
                    {prereq.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground align-top whitespace-normal">
                    {prereq.description}
                  </TableCell>
                  <TableCell className="text-muted-foreground align-top whitespace-normal italic">
                    &ldquo;{prereq.selfCheckExample}&rdquo;
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        {/* 4.4 Weekly schedule: Accordion or Table from weeks (number, title, topics, date, milestone badge). Week 1 gets id="week-1" */}
        <Section
          title="Weekly Schedule"
          subtitle="Comprehensive 15-week breakdown of course modules, topics, and major milestones"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[100px]">Week</TableHead>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Title & Topics</TableHead>
                <TableHead className="w-[220px] text-right">Milestone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((week) => (
                <TableRow
                  key={week.number}
                  id={`week-${week.number}`}
                  className="group"
                >
                  <TableCell className="font-medium align-top">
                    <span className="inline-flex items-center justify-center rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                      Week {week.number}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground align-top text-sm font-medium pt-3">
                    {week.date || "—"}
                  </TableCell>
                  <TableCell className="align-top whitespace-normal space-y-1">
                    <div className="font-semibold text-foreground text-base">
                      {week.title}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {week.topics}
                    </p>
                  </TableCell>
                  <TableCell className="align-top text-right whitespace-normal pt-2.5">
                    {week.milestone ? (
                      <Badge
                        variant="secondary"
                        className="gap-1 font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                      >
                        <Flag className="size-3 shrink-0" />
                        {week.milestone}
                      </Badge>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        {/* 4.5 Assessment Table from assessments.ts (exact percentages) */}
        <Section
          title="Assessment & Grading Policy"
          subtitle="Course grading breakdown, component weights, and capstone project milestones"
        >
          <div className="space-y-8">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[250px]">Assessment Component</TableHead>
                  <TableHead className="w-[120px] text-center">Weight</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-semibold text-foreground align-top">
                      {item.label}
                    </TableCell>
                    <TableCell className="align-top text-center">
                      <Badge variant="default" className="text-sm font-bold px-2.5 py-0.5">
                        {item.weight}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground align-top whitespace-normal leading-relaxed">
                      {item.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Flag className="size-5 text-primary" />
                    Capstone Project Milestones
                  </CardTitle>
                  <CardDescription>
                    Key deliverables for the team capstone project across the term.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {capstoneMilestones.map((m) => (
                      <div key={m.week} className="flex items-start gap-3 text-sm">
                        <Badge variant="outline" className="shrink-0 text-xs mt-0.5">
                          Week {m.week}
                        </Badge>
                        <div>
                          <span className="font-semibold text-foreground">{m.label}: </span>
                          <span className="text-muted-foreground">{m.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="size-5 text-primary" />
                    Late Policy
                  </CardTitle>
                  <CardDescription>
                    Policies governing late submission of assignments.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {latePolicy}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>

        {/* 4.6 Textbooks & resources section + link to syllabus.pdf */}
        <Section
          title="Textbooks & Required Resources"
          subtitle="Essential textbooks, software toolchains, and reference libraries"
        >
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-primary/20 bg-primary/5">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <FileText className="size-5 text-primary" />
                  Official Course Syllabus (PDF)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Download the complete offline printable PDF version of the course syllabus.
                </p>
              </div>
              <a
                href="/syllabus.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "shrink-0 gap-2 cursor-pointer"
                )}
              >
                <Download className="size-4" />
                <span>Download Syllabus PDF</span>
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {(["Textbooks", "Tools", "References"] as const).map((category) => {
                const categoryResources = resources.filter((r) => r.category === category);
                if (categoryResources.length === 0) return null;
                return (
                  <Card key={category} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="size-5 text-primary" />
                        {category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                      {categoryResources.map((res, i) => (
                        <div
                          key={i}
                          className="space-y-1 border-b border-border/40 pb-3 last:border-b-0 last:pb-0"
                        >
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-sm text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
                          >
                            <span>{res.name}</span>
                            <ExternalLink className="size-3.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                          </a>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {res.description}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
