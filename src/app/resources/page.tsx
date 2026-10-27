import { resources } from "@/data/resources";
import { ExternalLink, BookOpen, Wrench, Bookmark } from "lucide-react";

export const metadata = {
  title: "Resources | CS 289 / ROB 201",
  description: "Recommended textbooks, tools, libraries, and reference materials for ROB 201.",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Textbooks: <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
  Tools: <Wrench className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
  References: <Bookmark className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
};

export default function ResourcesPage() {
  // Group resources by category preserving order
  const categories = Array.from(new Set(resources.map((r) => r.category)));

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 mb-3">
          Course Materials
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Recommended Resources
        </h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl">
          Core textbooks, development tools, datasets, and open-source libraries used throughout ROB 201: Robotics Perception.
        </p>
      </div>

      {/* Resource Sections */}
      <div className="space-y-12">
        {categories.map((category) => {
          const categoryItems = resources.filter((r) => r.category === category);
          return (
            <section key={category} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                {CATEGORY_ICONS[category] || <BookOpen className="h-5 w-5 text-zinc-500" />}
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {category}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryItems.map((item) => (
                  <div
                    key={item.name}
                    className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.name}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex justify-end">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        Visit resource <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
