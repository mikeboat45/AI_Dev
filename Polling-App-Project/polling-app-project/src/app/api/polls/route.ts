import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Get all polls
  const { data: pollsData, error: pollsError } = await supabase
    .from("polls")
    .select("*")
    .order("created_at", { ascending: false });

  if (pollsError) {
    console.error("Error fetching polls:", pollsError);
    return NextResponse.json({ error: pollsError.message }, { status: 500 });
  }

  // Get all poll options
  const { data: optionsData, error: optionsError } = await supabase
    .from("poll_options")
    .select("*");

  if (optionsError) {
    console.error("Error fetching poll options:", optionsError);
    return NextResponse.json({ error: optionsError.message }, { status: 500 });
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
      createdBy: poll.created_by || "Anonymous",
      endsAt: poll.ends_at,
      isActive: true,
    };
  });

  return NextResponse.json(polls);
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be logged in to create a poll." }, { status: 401 });
  }

  const { title, description, options, ends_at } = await request.json();

  if (!title || options.length < 2) {
    return NextResponse.json({ error: "Title and at least 2 options are required." }, { status: 400 });
  }

  const pollData: { title: string; description?: string; created_by: string, ends_at?: string } = {
    title,
    description,
    created_by: user.id,
  };

  if (ends_at) {
    pollData.ends_at = ends_at;
  }

  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .insert([pollData])
    .select()
    .single();

  if (pollError || !poll) {
    return NextResponse.json({ error: pollError?.message || "Failed to create poll" }, { status: 500 });
  }

  const rows = options.map((text: string) => ({ poll_id: poll.id, text }));
  const { error: optionsError } = await supabase.from("poll_options").insert(rows);
  if (optionsError) {
    return NextResponse.json({ error: optionsError.message }, { status: 500 });
  }

  return NextResponse.json(poll);
}