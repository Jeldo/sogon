"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getEntryWithReaction, getDeviceProfile } from "@/lib/storage";
import type { EntryWithReaction, FriendTone } from "@/lib/types";
import { ReactionView } from "./ReactionView";
import { Button } from "@/components/ui/Button";

export default function ReactionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<EntryWithReaction | null>(null);
  const [tone, setTone] = useState<FriendTone>("warm");

  useEffect(() => {
    const profile = getDeviceProfile();
    if (profile) {
      setTone(profile.friendTone);
    }

    const data = getEntryWithReaction(params.id);
    if (!data) {
      router.replace("/record");
      return;
    }
    setEntry(data);
  }, [params.id, router]);

  if (!entry) return null;

  return (
    <div className="max-w-[520px] mx-auto px-6 py-10">
      <ReactionView entry={entry} tone={tone} />

      {/* Action buttons */}
      <div className="flex gap-3 mt-10 justify-center">
        <Link href="/record" className="inline-flex">
          <Button variant="primary" size="md">
            한 번 더
          </Button>
        </Link>
        <Link href="/collection" className="inline-flex">
          <Button variant="ghost" size="md">
            모아보기
          </Button>
        </Link>
      </div>
    </div>
  );
}
