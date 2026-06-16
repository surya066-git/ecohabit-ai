"use client";

import { Leaf } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/providers/auth-provider";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, router, user]);

  if (loading || !user) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="flex items-center gap-3 rounded-lg border bg-card px-5 py-4 shadow-sm">
          <Leaf className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="text-sm font-medium">Preparing your EcoHabit workspace</p>
        </div>
      </main>
    );
  }

  return children;
}
