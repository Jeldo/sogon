"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TONE_OPTIONS } from "@/lib/constants";
import { getDeviceProfile, setDeviceProfile } from "@/lib/storage";
import type { FriendTone } from "@/lib/types";
import { ToneCard } from "./ToneCard";

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
      <div className="w-full max-w-[560px] space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-heading">소곤</h1>
          <p className="text-text-secondary text-base">비밀친구를 골라봐!</p>
        </div>

        {/* Tone Cards */}
        <div className="space-y-3">
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
        <button
          onClick={handleStart}
          disabled={!selectedTone}
          className="w-full py-3 px-6 rounded-[10px] text-base font-body transition-all duration-150 bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.97] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary-600 disabled:active:scale-100"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
