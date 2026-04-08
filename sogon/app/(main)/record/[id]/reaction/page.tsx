"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getEntryWithReaction, getProfile } from "@/lib/supabase/queries";
import type { EntryWithReaction, FriendTone } from "@/lib/types";
import { ReactionView } from "./ReactionView";

export default function ReactionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<EntryWithReaction | null>(null);
  const [tone, setTone] = useState<FriendTone>("warm");

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const profile = await getProfile(supabase);
      if (profile) {
        setTone(profile.friendTone);
      }

      const data = await getEntryWithReaction(supabase, params.id);
      if (!data) {
        router.replace("/record");
        return;
      }
      setEntry(data);
    }
    load();
  }, [params.id, router]);

  if (!entry) return null;

  return (
    <div className="max-w-[480px] mx-auto px-6 py-8">
      <ReactionView entry={entry} tone={tone} />

      {/* Action buttons */}
      <div className="flex gap-3 mt-8">
        <Link
          href="/record"
          className="flex-1 py-2.5 px-4 rounded-[10px] text-sm font-body text-center bg-primary-100 text-primary-700 border border-primary-300 hover:bg-primary-200 active:scale-[0.97] transition-all duration-150"
        >
          하나 더 기록하기
        </Link>
        <Link
          href="/collection"
          className="flex-1 py-2.5 px-4 rounded-[10px] text-sm font-body text-center text-neutral-600 hover:bg-neutral-100 active:scale-[0.97] transition-all duration-150"
        >
          모아보기
        </Link>
      </div>
    </div>
  );
}
