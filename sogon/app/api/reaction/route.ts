import { NextRequest, NextResponse } from "next/server";
import { generateReaction } from "@/lib/ai/generate-reaction";
import { FRIEND_TONES } from "@/lib/types";
import type { FriendTone } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.warn("[POST /api/reaction] 인증 실패 — Unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { content, tone } = body as {
    content: string;
    tone: FriendTone;
  };

  if (!content || !tone || !FRIEND_TONES.includes(tone)) {
    console.warn("[POST /api/reaction] 잘못된 요청", { tone, hasContent: !!content });
    return NextResponse.json(
      { error: "content and valid tone are required" },
      { status: 400 },
    );
  }

  const reactionText = await generateReaction(content, tone);

  return NextResponse.json({ reaction: reactionText });
}
