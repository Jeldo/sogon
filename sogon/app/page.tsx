"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TONE_OPTIONS } from "@/lib/constants";
import { getDeviceProfile, setDeviceProfile } from "@/lib/storage";
import type { FriendTone } from "@/lib/types";
import { ToneCard } from "./ToneCard";
import { Button } from "@/components/ui/Button";

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedTone, setSelectedTone] = useState<FriendTone | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const profile = getDeviceProfile();
    if (profile) {
      router.replace("/record");
    }
  }, [router]);

  if (!mounted) return null;

  function handleStart() {
    if (!selectedTone) return;
    setDeviceProfile(selectedTone);
    router.push("/record");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-[560px] flex flex-col gap-7">
        {/* Header */}
        <div>
          <div
            className="t-label"
            style={{ color: "var(--accent-lo)" }}
          >
            step 1 of 1
          </div>
          <h1 className="t-display mt-2.5">비밀친구를 골라줘</h1>
          <p className="t-caption mt-1">
            기록에 반응해줄 친구의 말투야. 언제든 바꿀 수 있어.
          </p>
        </div>

        {/* Tone Cards */}
        <div className="flex flex-col gap-3">
          {TONE_OPTIONS.map((option) => (
            <ToneCard
              key={option.tone}
              emoji={option.emoji}
              bgColor={option.bgColor}
              name={option.name}
              exampleReaction={option.exampleReaction}
              selected={selectedTone === option.tone}
              onSelect={() => setSelectedTone(option.tone)}
            />
          ))}
        </div>

        {/* Start Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStart}
            disabled={!selectedTone}
          >
            continue
          </Button>
        </div>
      </div>
    </div>
  );
}
