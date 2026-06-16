"use client";

import {
  Award,
  BarChart3,
  Footprints,
  Goal,
  Home,
  Leaf,
  LogOut,
  Repeat2,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { AuthGuard } from "./auth-guard";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/footprint", label: "Footprint", icon: Footprints },
  { href: "/habits", label: "Habits", icon: Repeat2 },
  { href: "/goals", label: "Goals", icon: Goal },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/achievements", label: "Badges", icon: Award }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOutUser } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
                <Leaf className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>EcoHabit AI</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground sm:flex">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="max-w-48 truncate">{user?.email}</span>
              </div>
              <Button
                aria-label="Sign out"
                onClick={async () => {
                  await signOutUser();
                  router.push("/login");
                }}
                size="icon"
                variant="ghost"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <nav aria-label="Primary" className="mx-auto max-w-7xl overflow-x-auto px-4 pb-3 sm:px-6">
            <div className="flex min-w-max gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    className={cn(
                      "inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
