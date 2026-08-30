"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Mic,
  BookOpen,
  TrendingUp,
  Briefcase,
  Brain,
  Settings,
  FileText,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/practice", label: "Practice", icon: Mic },
  { href: "/word-lab", label: "Word Lab", icon: BookOpen },
  { href: "/paragraph", label: "Paragraphs", icon: FileText },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/boardroom", label: "Boardroom", icon: Briefcase },
  { href: "/coach", label: "Coach", icon: Brain },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-64 bg-neutral-900 border-r border-neutral-800 z-30">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-neutral-800">
          <h1 className="text-lg font-bold text-white tracking-tight">VoicePresence</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Executive Speech Coach</p>
        </div>

        {/* Links */}
        <div className="flex-1 py-4 space-y-0.5 px-3">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-700">MVP v0.1</p>
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-neutral-900 border-t border-neutral-800 pb-safe">
        <div className="flex justify-around py-2">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-colors min-w-0 ${
                  active ? "text-brand-400" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[10px] font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
