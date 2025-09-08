"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function createPollAction(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const optionValues = formData.getAll("options") as string[];
  const options = optionValues.map((v) => String(v).trim()).filter(Boolean);

  if (!title || options.length < 2) {
    return { ok: false, error: "Title and at least 2 options are required." };
  }

  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be logged in to create a poll." };
  }

  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .insert([{ title, description, created_by: user.id }])
    .select()
    .single();

  if (pollError || !poll) {
    return { ok: false, error: pollError?.message || "Failed to create poll" };
  }

  const rows = options.map((text) => ({ poll_id: poll.id, text }));
  const { error: optionsError } = await supabase.from("poll_options").insert(rows);
  if (optionsError) {
    return { ok: false, error: optionsError.message };
  }

  revalidatePath("/polls");
  return { ok: true, pollId: poll.id };
}

export async function getPolls() {
  const supabase = getSupabaseServerClient();
  
  // Get all polls
  const { data: pollsData, error: pollsError } = await supabase
    .from("polls")
    .select("*, created_by(username)")
    .order("created_at", { ascending: false });

  if (pollsError) {
    console.error("Error fetching polls:", pollsError);
    return [];
  }

  // Get all poll options
  const { data: optionsData, error: optionsError } = await supabase
    .from("poll_options")
    .select("*");

  if (optionsError) {
    console.error("Error fetching poll options:", optionsError);
    return [];
  }

  // Transform the data to match the Poll interface
  const polls = pollsData.map((poll) => {
    const pollOptions = optionsData
      .filter((option) => option.poll_id === poll.id)
      .map((option) => ({
        id: option.id,
        text: option.text,
        votes: option.votes || 0,
      }));

    const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes, 0);

    return {
      id: poll.id,
      title: poll.title,
      description: poll.description || "",
      options: pollOptions,
      totalVotes,
      createdAt: poll.created_at,
      createdBy: poll.created_by.username || "Anonymous",
      isActive: true,
    };
  });

  return polls;
}

export async function voteOnPoll(pollId: string, optionId: string) {
  if (!pollId || !optionId) {
    return { ok: false, error: "Poll ID and option ID are required." };
  }

  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be logged in to vote." };
  }

  // Increment the votes for the selected option
  const { data, error } = await supabase
    .from("poll_options")
    .update({ votes: supabase.rpc('increment_votes') })
    .eq('id', optionId)
    .eq('poll_id', pollId)
    .select();

  if (error) {
    console.error("Error voting on poll:", error);
    return { ok: false, error: error.message };
  }

  // Revalidate the polls page to reflect the updated vote count
  revalidatePath("/polls");
  return { ok: true };
}

