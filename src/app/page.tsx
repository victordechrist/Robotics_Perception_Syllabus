import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Calculator,
  Camera,
  Compass,
  Cpu,
  Eye,
  FileText,
  Layers,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const highlights = [
  {
    title: "Math-first foundations",
    description:
      "Master rigid body transformations in SE(3), projective geometry, Bayesian state estimation, and Extended Kalman Filtering from core principles.",
    icon: Calculator,
    badge: "Theory & Principles",
  },
  {
    title: "Hands-on robot labs",
    description:
      "Program real-world perception pipelines with ROS 2, OpenCV, and Point Cloud Library (PCL) using industry-standard robotics tools.",
    icon: Cpu,
    badge: "Practical Skills",
  },
  {
    title: "Vision and estimation",
    description:
      "Extract 3D structure from images using camera calibration, epipolar stereo vision, optical flow tracking, and visual SLAM graph optimization.",
    icon: Eye,
    badge: "Computer Vision",
  },
  {
    title: "Real-world capstone (Scout)",
    description:
      "Integrate vision, state estimation, and mapping on the Scout mobile rover platform for autonomous spatial navigation.",
    icon: Compass,
    badge: "Hardware & Rover",
  },
];

const quickLinks = [
  {
    title: "Syllabus",
    description: "Course schedule, policies, grading criteria, and lecture sequence.",
    href: "/syllabus",
    icon: FileText,
    badge: "Overview",
  },
  {
    title: "Labs",
    description: "Hands-on assignments from pinhole cameras to ROS 2 & visual SLAM.",
    href: "/labs",
    icon: Bot,
    badge: "Assignments",
  },
  {
    title: "Week 1 Lecture",
    description: "Intro to Robot Perception & Spatial Transformations in SE(3).",
    href: "/lectures/week-1-intro-to-robot-perception",
    icon: BookOpen,
    badge: "First Lecture",
  },
];

const perceptionPipeline = [
  { label: "Sense it", sub: "Camera & LiDAR", icon: Camera },
  { label: "Estimate it", sub: "EKF & Optimization", icon: Zap },
  { label: "Map it", sub: "Occupancy & SLAM", icon: Layers },
  { label: "Navigate it", sub: "Pose & Path Control", icon: MapPin },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 3.1 Hero Section */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-muted/30 to-background py-16 sm:py-24 lg:py-32">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            <Badge
              variant="outline"
              className="px-3 py-1 text-xs sm:text-sm font-medium border-cyan-500/30 text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 backdrop-blur-xs gap-1.5"
            >
              <Sparkles className="size-3.5 text-cyan-500" />
              ROB 201 — Autonomous Systems & Spatial AI
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Robotics Perception
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-cyan-600 dark:text-cyan-400 tracking-tight">
              From pixels to pose.
            </p>

            <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
              Sense it. Estimate it. Map it. Navigate it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto justify-center">
              <Link
                href="/syllabus"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "gap-2 text-base font-semibold shadow-md px-6 py-2.5 h-auto"
                )}
              >
                Explore Syllabus
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/labs"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "gap-2 text-base font-semibold px-6 py-2.5 h-auto"
                )}
              >
                View Labs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3.4 Theme Banner Strip */}
      <section className="w-full bg-primary text-primary-foreground py-10 border-y border-border/40 shadow-inner">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-semibold">
                Course Philosophy
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight">
                &ldquo;From pixels to pose.&rdquo;
              </p>
              <p className="text-sm sm:text-base text-primary-foreground/80 font-medium">
                Bridge raw sensor observations and actionable spatial intelligence.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
              {perceptionPipeline.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className="flex flex-col items-center p-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/15 text-center transition-colors hover:bg-primary-foreground/15"
                  >
                    <Icon className="size-5 mb-1 text-cyan-300" />
                    <span className="text-xs font-bold">{step.label}</span>
                    <span className="text-[10px] text-primary-foreground/70">{step.sub}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3.2 Highlights Section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Course Highlights
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Designed to equip students with rigorous mathematical foundations and modern robotics engineering tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="relative overflow-hidden border-border/80 transition-all hover:shadow-md hover:border-cyan-500/40 dark:hover:border-cyan-500/40"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                        <Icon className="size-6" />
                      </div>
                      <Badge variant="secondary" className="text-xs font-medium">
                        {item.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3.3 Quick-Links Row */}
      <section className="py-16 bg-muted/30 border-t border-border/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Quick Access
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">
                Jump straight to essential course modules and resources.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Card
                  key={link.title}
                  className="group relative flex flex-col justify-between border-border/80 transition-all hover:border-primary hover:shadow-md"
                >
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="size-5" />
                      </div>
                      <Badge variant="outline" className="text-[11px]">
                        {link.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                      {link.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {link.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2 pb-6">
                    <Link
                      href={link.href}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "p-0 h-auto font-semibold text-primary hover:text-primary/80 gap-1.5"
                      )}
                    >
                      Go to {link.title}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
