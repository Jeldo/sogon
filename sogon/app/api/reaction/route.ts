import { NextRequest, NextResponse } from "next/server";
import { generateReaction } from "@/lib/ai/generate-reaction";
import { FRIEND_TONES } from "@/lib/types";
import type { FriendTone } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { content, tone } = body as { content: string; tone: FriendTone };

  if (!content || !tone || !FRIEND_TONES.includes(tone)) {
    return NextResponse.json(
      { error: "content and valid tone are required" },
      { status: 400 },
    );
  }

  const reaction = await generateReaction(content, tone);
  return NextResponse.json({ reaction });
}
