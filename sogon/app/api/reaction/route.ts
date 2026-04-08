import { NextRequest, NextResponse } from "next/server";
import { generateReaction } from "@/lib/ai/generate-reaction";
import { FRIEND_TONES } from "@/lib/types";
import type { FriendTone } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { addReaction } from "@/lib/supabase/queries";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { entryId, content, tone } = body as {
    entryId: string;
    content: string;
    tone: FriendTone;
  };

  if (!entryId || !content || !tone || !FRIEND_TONES.includes(tone)) {
    return NextResponse.json(
      { error: "entryId, content and valid tone are required" },
      { status: 400 },
    );
  }

  const reactionText = await generateReaction(content, tone);

  try {
    await addReaction(supabase, entryId, reactionText, tone);
  } catch {
    // Non-fatal: reaction text is still returned even if DB write fails
  }

  return NextResponse.json({ reaction: reactionText });
}
