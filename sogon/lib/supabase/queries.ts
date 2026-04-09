import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DeviceProfile,
  DiaryEntry,
  EntryWithReaction,
  FriendTone,
  Reaction,
} from "@/lib/types";
import { isSameDay } from "@/lib/date-utils";

// ── helpers ────────────────────────────────────────────────────────────────

function rowToEntry(row: Record<string, unknown>): DiaryEntry {
  return {
    id: row.id as string,
    content: row.content as string,
    imagePath: (row.image_path as string | null) ?? null,
    createdAt: row.created_at as string,
  };
}

function rowToReaction(row: Record<string, unknown>): Reaction {
  return {
    id: row.id as string,
    entryId: row.entry_id as string,
    content: row.content as string,
    tone: row.tone as FriendTone,
    createdAt: row.created_at as string,
  };
}

// ── Profile ────────────────────────────────────────────────────────────────

export async function getProfile(
  supabase: SupabaseClient,
): Promise<DeviceProfile | null> {
  const { data } = await supabase.from("profiles").select("*").maybeSingle();
  if (!data) return null;
  return {
    friendTone: data.friend_tone as FriendTone,
    createdAt: data.created_at as string,
  };
}

export async function setProfile(
  supabase: SupabaseClient,
  tone: FriendTone,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  await supabase
    .from("profiles")
    .upsert({ id: user.id, friend_tone: tone });
}

// ── Entries ────────────────────────────────────────────────────────────────

export async function addEntry(
  supabase: SupabaseClient,
  content: string,
  imagePath: string | null,
): Promise<DiaryEntry> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("entries")
    .insert({ user_id: user.id, content, image_path: imagePath })
    .select()
    .single();

  if (error ?? !data) throw error ?? new Error("Failed to create entry");
  return rowToEntry(data as Record<string, unknown>);
}

export async function updateEntry(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<Pick<DiaryEntry, "content" | "imagePath">>,
): Promise<DiaryEntry | null> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.content !== undefined) dbUpdates.content = updates.content;
  if (updates.imagePath !== undefined) dbUpdates.image_path = updates.imagePath;

  const { data, error } = await supabase
    .from("entries")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error ?? !data) return null;
  return rowToEntry(data as Record<string, unknown>);
}

export async function deleteEntry(
  supabase: SupabaseClient,
  id: string,
  imagePath: string | null,
): Promise<boolean> {
  if (imagePath) {
    await supabase.storage.from("diary-images").remove([imagePath]);
  }
  const { error } = await supabase.from("entries").delete().eq("id", id);
  return !error;
}

// ── Reactions ──────────────────────────────────────────────────────────────

export async function addReaction(
  supabase: SupabaseClient,
  entryId: string,
  content: string,
  tone: FriendTone,
): Promise<Reaction> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("reactions")
    .insert({ entry_id: entryId, user_id: user.id, content, tone })
    .select()
    .single();

  if (error ?? !data) throw error ?? new Error("Failed to create reaction");
  return rowToReaction(data as Record<string, unknown>);
}

// ── Queries ────────────────────────────────────────────────────────────────

export async function getEntriesByDate(
  supabase: SupabaseClient,
  date: Date,
): Promise<EntryWithReaction[]> {
  const entries = await getEntriesByMonth(
    supabase,
    date.getFullYear(),
    date.getMonth(),
  );
  return entries.filter((e) => isSameDay(new Date(e.createdAt), date));
}

export async function getEntriesByMonth(
  supabase: SupabaseClient,
  year: number,
  month: number,
): Promise<EntryWithReaction[]> {
  const start = new Date(year, month, 1).toISOString();
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString();

  const { data, error } = await supabase
    .from("entries")
    .select("*, reactions(*)")
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at", { ascending: false });

  console.log("[getEntriesByMonth] raw", {
    error,
    count: data?.length,
    sample: data?.[0],
  });

  return (data ?? []).map((row) => {
    const r = row as Record<string, unknown>;
    const reactions = r.reactions as Record<string, unknown>[] | undefined;
    const reaction = reactions?.[0] ? rowToReaction(reactions[0]) : null;
    return { ...rowToEntry(r), reaction };
  });
}

export async function getEntryWithReaction(
  supabase: SupabaseClient,
  entryId: string,
): Promise<EntryWithReaction | null> {
  const { data } = await supabase
    .from("entries")
    .select("*, reactions(*)")
    .eq("id", entryId)
    .maybeSingle();

  if (!data) return null;
  const row = data as Record<string, unknown>;
  const reactions = row.reactions as Record<string, unknown>[] | undefined;
  const reaction = reactions?.[0] ? rowToReaction(reactions[0]) : null;
  return { ...rowToEntry(row), reaction };
}

export async function getAllEntriesWithReactions(
  supabase: SupabaseClient,
): Promise<EntryWithReaction[]> {
  const { data, error } = await supabase
    .from("entries")
    .select("*, reactions(*)")
    .order("created_at", { ascending: false });

  console.log("[getAllEntriesWithReactions] raw", {
    error,
    count: data?.length,
    sample: data?.[0],
  });

  return (data ?? []).map((row) => {
    const r = row as Record<string, unknown>;
    const reactions = r.reactions as Record<string, unknown>[] | undefined;
    const reaction = reactions?.[0] ? rowToReaction(reactions[0]) : null;
    return { ...rowToEntry(r), reaction };
  });
}

// ── Images ─────────────────────────────────────────────────────────────────

export async function getImageSignedUrl(
  supabase: SupabaseClient,
  imagePath: string,
): Promise<string | null> {
  const { data } = await supabase.storage
    .from("diary-images")
    .createSignedUrl(imagePath, 3600);
  return data?.signedUrl ?? null;
}
