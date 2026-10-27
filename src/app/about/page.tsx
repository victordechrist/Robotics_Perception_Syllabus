import { learningOutcomes, courseDescription, theme } from "@/data/outcomes";
import { Compass, Bot, Code, Cpu, UserX, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About | CS 289 / ROB 201",
  description: "Course philosophy, outcomes, hardware platform, and teaching staff info for ROB 201.",
};

const PHILOSOPHIES = [
  {
    title: "Math-First Foundations",
    icon: <Compass className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    description:
      "We derive every core algorithm—from rotation matrices and camera projections to Kalman filters and factor graph optimization—from first principles before implementing a single line of code.",
  },
  {
    title: "One Robot All Semester",
    icon: <Bot className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    description:
      "Instead of fragmented toy exercises, students incrementally build and refine a unified software stack targeting a standardized vehicle model throughout all 15 weeks.",
  },
  {
    title: "Simulation First",
    icon: <Code className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
    description:
      "Algorithms are implemented, benchmarked, and debugged in photorealistic Gazebo / ROS 2 simulations with deterministic ground truth before real-world physical verification.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 space-y-3">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
          Course Overview
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          About ROB 201: Robotics Perception
        </h1>
        <p className="text-xl font-medium text-blue-600 dark:text-blue-400 italic">
          &ldquo;{theme}&rdquo;
        </p>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          {courseDescription}
        </p>
      </div>

      {/* Course Philosophy */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Course Philosophy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PHILOSOPHIES.map((p) => (
            <div
              key={p.title}
              className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-3"
            >
              <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 w-fit">
                {p.icon}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {p.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Hardware & Platform (Appendix A: Scout) */}
      <section className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Standard Hardware Platform: The Scout Rover
            </h2>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-0.5">
              Differential-Drive Autonomous Rover
            </p>
          </div>
        </div>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          As described in Appendix A, all laboratory assignments and capstone projects target the standardized <strong>Scout differential-drive rover platform</strong>. The Scout vehicle model comes equipped with wheel encoders, 9-DOF IMU, calibrated monocular and stereo vision cameras, and a 3D LiDAR sensor array. Software pipelines developed in simulation directly translate to physical Scout rover hardware via standard ROS 2 interfaces.
        </p>
      </section>

      {/* Learning Outcomes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Key Learning Outcomes
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {learningOutcomes.map((outcome, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {outcome}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Instructor Information (Marked TBD) */}
      <section className="space-y-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Course Leadership & Instructor
        </h2>
        <div className="p-6 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
            <UserX className="h-10 w-10 text-zinc-400" />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Primary Course Instructor
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Instructor TBD
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              Instructor assignment for the upcoming term is pending department finalization. Course materials, lectures, and laboratory specifications are finalized and aligned with academic curriculum standards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
