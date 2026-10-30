"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/syllabus", label: "Syllabus" },
  { href: "/labs", label: "Labs" },
  { href: "/progress", label: "Progress" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

const moreLinks = [
  { href: "/staff", label: "Staff" },
  { href: "/assessments", label: "Assessments" },
  { href: "/lectures", label: "Lectures" },
];

const allMobileLinks = [
  { href: "/", label: "Home" },
  { href: "/syllabus", label: "Syllabus" },
  { href: "/labs", label: "Labs" },
  { href: "/progress", label: "Progress" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/staff", label: "Staff" },
  { href: "/assessments", label: "Assessments" },
  { href: "/lectures", label: "Lectures" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isMoreActive = moreLinks.some(
    (link) => pathname === link.href || pathname.startsWith(link.href + "/")
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Title Left */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-foreground font-bold text-base sm:text-lg tracking-tight hover:opacity-90 transition-opacity min-w-0"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono text-xs shadow-xs">
            <Bot className="size-4 text-cyan-400" />
          </div>
          <span className="truncate">
            <span className="font-semibold text-foreground">ROB 201</span>
            <span className="hidden sm:inline">
              <span className="mx-1.5 text-muted-foreground font-normal">·</span>
              <span className="font-medium text-muted-foreground hover:text-foreground transition-colors">
                Robotics Perception
              </span>
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 text-sm font-medium">
          {primaryLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-colors",
                  isActive
                    ? "bg-accent text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {/* More Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "flex items-center gap-1 px-3 py-1.5 h-auto font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 focus-visible:ring-1 focus-visible:ring-ring cursor-pointer",
                isMoreActive && "bg-accent text-foreground font-semibold"
              )}
            >
              <span>More</span>
              <ChevronDown className="size-3.5 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {moreLinks.map((link) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <DropdownMenuItem key={link.href} className="p-0">
                    <Link
                      href={link.href}
                      className={cn(
                        "w-full px-2.5 py-1.5 text-sm rounded-md transition-colors",
                        isActive
                          ? "font-semibold text-foreground bg-accent/50"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-2 pl-2 border-l border-border/60 flex items-center">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="size-9 rounded-md text-foreground hover:bg-muted"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer / Collapsible Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/60 bg-background px-4 pt-2 pb-4 shadow-lg">
          <div className="flex flex-col gap-1">
            {allMobileLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
