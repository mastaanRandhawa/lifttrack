"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Dumbbell,
  PersonStanding,
  TrendingUp,
  User,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/workout", label: "Workout", icon: Dumbbell },
  { href: "/body-map", label: "Body", icon: PersonStanding },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-sidebar/98 backdrop-blur-md border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Main navigation"
    >
      <div className="flex items-stretch justify-around px-1 pt-1 pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              /* Minimum 56px tap target height (Fitts's Law) */
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 flex-1 min-h-[56px] rounded-xl transition-all duration-150 select-none",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              {/* Active background pill */}
              {isActive && (
                <span
                  className="absolute top-1 inset-x-3 h-[30px] rounded-full bg-primary/12"
                  aria-hidden="true"
                />
              )}

              <Icon
                className={cn(
                  "w-[22px] h-[22px] relative z-10 transition-transform duration-150",
                  isActive ? "scale-110" : ""
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium leading-none relative z-10",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
