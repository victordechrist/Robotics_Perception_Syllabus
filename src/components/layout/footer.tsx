import Link from "next/link";
import { FileText, Bot } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30 text-muted-foreground mt-auto">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Left Column: Branding & Course Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-mono text-xs">
                <Bot className="size-3.5 text-cyan-400" />
              </div>
              <span className="font-bold text-foreground text-base tracking-tight">
                ROB 201 · Robotics Perception
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Algorithms, sensors, and state estimation for autonomous systems.
            </p>
          </div>

          {/* Right Column: External Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="https://github.com/victordechrist/Robotics_Perception_Syllabus"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              <GithubIcon className="size-4" />
              <span>GitHub Repository</span>
            </a>
            <a
              href="/syllabus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              <FileText className="size-4 text-amber-500" />
              <span>Syllabus PDF</span>
            </a>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs">
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/syllabus" className="hover:text-foreground transition-colors">Syllabus</Link>
            <Link href="/lectures" className="hover:text-foreground transition-colors">Lectures</Link>
            <Link href="/labs" className="hover:text-foreground transition-colors">Labs</Link>
            <Link href="/assessments" className="hover:text-foreground transition-colors">Assessments</Link>
            <Link href="/resources" className="hover:text-foreground transition-colors">Resources</Link>
            <Link href="/staff" className="hover:text-foreground transition-colors">Staff</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          </nav>
          <p className="text-muted-foreground/80">
            © {new Date().getFullYear()} Robotics Perception (ROB 201)
          </p>
        </div>
      </div>
    </footer>
  );
}
