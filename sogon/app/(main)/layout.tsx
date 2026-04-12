"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDeviceProfile } from "@/lib/storage";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const profile = getDeviceProfile();
    if (!profile) {
      router.replace("/");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
