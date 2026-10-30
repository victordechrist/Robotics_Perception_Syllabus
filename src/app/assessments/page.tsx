import { assessments, capstoneMilestones, latePolicy } from "@/data/assessments";
import { Award, CalendarCheck, Clock, ShieldAlert, Bot, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Assessments & Grading | CS 289 / ROB 201",
  description: "Grading scheme, capstone project milestones, late submission policy, and AI usage guidelines for ROB 201.",
};

export default function AssessmentsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 space-y-3">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
          Course Evaluation
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Assessments & Grading
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Comprehensive breakdown of course grading criteria, capstone milestones schedule, submission policies, and academic integrity guidelines.
        </p>
      </div>

      {/* Grading Scheme Table */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Grading Weight Distribution
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <table className="w-full text-left text-sm text-zinc-700 dark:text-zinc-300">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th scope="col" className="px-6 py-3.5 font-semibold">Assessment Component</th>
                <th scope="col" className="px-6 py-3.5 font-semibold text-center">Weight</th>
                <th scope="col" className="px-6 py-3.5 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {assessments.map((item) => (
                <tr key={item.label} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                    {item.label}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {item.weight}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Capstone Requirements & Milestones */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Capstone Project Requirements & Schedule
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              The capstone (35% of course grade) requires teams of 3–4 students to integrate vision, state estimation, and SLAM into a real-time autonomous pipeline.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capstoneMilestones.map((m) => (
            <div
              key={m.week}
              className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    Week {m.week}
                  </span>
                  <CheckCircle className="h-4 w-4 text-indigo-500" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                  {m.label}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        {/* Late Policy */}
        <section className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
            <Clock className="h-5 w-5" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Late Submission Policy
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {latePolicy}
          </p>
        </section>

        {/* AI Tools Policy */}
        <section className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
            <Bot className="h-5 w-5" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              AI Tools & LLM Assistance
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            AI assistants (ChatGPT, Copilot, Claude) may be used as conceptual learning tutors or code syntax references. However, submitting unverified AI-generated code or passing off generated proofs without understanding is strictly prohibited. You must document AI usage in assignment READMEs.
          </p>
        </section>

        {/* Academic Integrity */}
        <section className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
            <ShieldAlert className="h-5 w-5" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Academic Integrity
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            All code submissions are automatically checked using automated similarity analysis tools. High-level conceptual discussions with peers are encouraged, but sharing solution source code, math proofs, or lab write-ups directly violates university honor code standards.
          </p>
        </section>
      </div>
    </div>
  );
}
