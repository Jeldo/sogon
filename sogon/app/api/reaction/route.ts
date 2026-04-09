import { NextRequest, NextResponse } from "next/server";
import { generateReaction } from "@/lib/ai/generate-reaction";
import { FRIEND_TONES } from "@/lib/types";
import type { FriendTone } from "@/lib/types";
import { createClient, createAdminClient } from "@/lib/supabase/server";

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
  const { entryId, content, tone } = body as {
    entryId: string;
    content: string;
    tone: FriendTone;
  };

  if (!entryId || !content || !tone || !FRIEND_TONES.includes(tone)) {
    console.warn("[POST /api/reaction] 잘못된 요청", { entryId, tone, hasContent: !!content });
    return NextResponse.json(
      { error: "entryId, content and valid tone are required" },
      { status: 400 },
    );
  }

  const reactionText = await generateReaction(content, tone);

  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("reactions")
      .insert({ entry_id: entryId, user_id: user.id, content: reactionText, tone });
    if (error) throw error;
  } catch (error) {
    console.error("[POST /api/reaction] DB 저장 실패 (non-fatal)", {
      entryId,
      tone,
      error: error instanceof Error
        ? { message: error.message, name: error.name }
        : error,
    });
  }

  return NextResponse.json({ reaction: reactionText });
}
