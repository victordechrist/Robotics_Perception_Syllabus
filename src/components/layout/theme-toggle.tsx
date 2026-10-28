"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

function useHydrated() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useHydrated();

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className="size-9 rounded-md"
        disabled
      >
        <span className="size-4 rounded-full bg-muted opacity-50" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 focus-visible:ring-1 focus-visible:ring-ring transition-colors"
    >
      {isDark ? (
        <Sun className="size-4.5 transition-transform duration-200 hover:rotate-45 text-amber-400" />
      ) : (
        <Moon className="size-4.5 transition-transform duration-200 hover:-rotate-12 text-slate-700 dark:text-slate-200" />
      )}
    </Button>
  );
}
