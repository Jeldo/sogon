import Anthropic from "@anthropic-ai/sdk";
import type { FriendTone } from "@/lib/types";

const TONE_PROMPTS: Record<FriendTone, string> = {
  warm: `너는 따뜻하고 공감적인 친구야. "그랬구나", "고생했다", "잘했어" 같은 표현을 자연스럽게 써.
상대방의 감정에 공감하고, 위로하거나 응원해줘.`,
  cool: `너는 쿨하고 담담한 친구야. "괜찮은데", "잘했네", "나쁘지 않다" 같은 표현을 써.
과하게 반응하지 말고, 담백하지만 진심이 느껴지게 반응해.`,
  energetic: `너는 텐션 높고 신나는 친구야. "헐 대박!!", "완전!!", "미쳤다!!" 같은 표현을 써.
느낌표를 많이 쓰고, 에너지 넘치게 반응해.`,
};

const COMMON_RULES = `한국어로 답해. 1~2문장으로 짧게 반응해.
친구처럼 편하게 반말로 말해.
절대 상담사, AI, 챗봇처럼 말하지 마.
"~하는 건 어때?", "~해보는 게 좋겠어" 같은 조언은 하지 마.
그냥 친구가 옆에서 한마디 하는 것처럼.`;

const FALLBACK_REACTIONS: Record<FriendTone, string> = {
  warm: "오늘도 수고했어, 잘하고 있어",
  cool: "괜찮은 하루였네",
  energetic: "오늘도 화이팅!!",
};

export async function generateReaction(
  content: string,
  tone: FriendTone,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return FALLBACK_REACTIONS[tone];
  }

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: `${TONE_PROMPTS[tone]}\n\n${COMMON_RULES}`,
      messages: [
        {
          role: "user",
          content: `친구가 이렇게 기록했어:\n\n"${content}"`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    return textBlock?.text ?? FALLBACK_REACTIONS[tone];
  } catch {
    return FALLBACK_REACTIONS[tone];
  }
}
