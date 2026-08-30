"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthChange } from "@/lib/firebase/auth";
import { Spinner } from "@/components/ui/Spinner";
import type { User } from "firebase/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    const unsubscribe = onAuthChange((u) => {
      setUser(u);
      if (!u && pathname !== "/login") {
        router.replace("/login");
      }
    });
    return unsubscribe;
  }, [router, pathname]);

  // Loading state
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Spinner className="w-8 h-8 text-brand-500" />
      </div>
    );
  }

  // Not logged in — on login page
  if (!user && pathname === "/login") {
    return <>{children}</>;
  }

  // Not logged in — redirect handled above, show nothing
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
