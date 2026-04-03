"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Dumbbell,
  PersonStanding,
  TrendingUp,
  BookOpen,
  User,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workout", label: "Workouts", icon: Dumbbell },
  { href: "/body-map", label: "Body Map", icon: PersonStanding },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/exercises", label: "Exercises", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 border-r border-border bg-sidebar transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-border", collapsed && "justify-center px-2")}>
        <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-primary shrink-0">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-heading font-bold text-lg tracking-tight text-foreground">
            LiftTrack
          </span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
