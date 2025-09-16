import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  // Get all polls
  const { data: pollsData, error: pollsError } = await supabase
    .from("polls")
    .select(`
      id,
      title,
      description,
      created_at,
      expires_at,
      is_active,
      total_votes,
      createdBy:created_by(id, name)
    `)
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
      createdBy: {
        id: poll.createdBy?.id || "unknown",
        name: poll.createdBy?.name || "Anonymous",
      },
      expiresAt: poll.expires_at,
      isActive: poll.is_active,
    };
  });

  console.log("Data returned by GET /api/polls:", polls);

  return NextResponse.json(polls);
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to create a poll." },
      { status: 401 }
    );
  }

  const { title, description, options, ends_at } = await request.json();

  if (!title || options.length < 2) {
    return NextResponse.json(
      { error: "Title and at least 2 options are required." },
      { status: 400 }
    );
  }

  const pollData: {
    title: string;
    description?: string;
    created_by: string;
    ends_at?: string;
  } = {
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
    return NextResponse.json(
      { error: pollError?.message || "Failed to create poll" },
      { status: 500 }
    );
  }

  const optionRows = options.map((option: { text: string }) => ({
    poll_id: poll.id,
    text: option.text,
  }));
  const { data: pollOptions, error: optionsError } = await supabase
    .from("poll_options")
    .insert(optionRows)
    .select();

  if (optionsError || !pollOptions) {
    return NextResponse.json(
      { error: optionsError?.message || "Failed to create poll options" },
      { status: 500 }
    );
  }

  const totalVotes = pollOptions.reduce(
    (sum, option) => sum + (option.votes || 0),
    0
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", poll.created_by)
    .single();

  const finalPoll = {
    id: poll.id,
    title: poll.title,
    description: poll.description || "",
    options: pollOptions.map(o => ({ id: o.id, text: o.text, votes: o.votes || 0 })),
    totalVotes,
    createdAt: poll.created_at,
    createdBy: profile?.name || "Anonymous",
    endsAt: poll.ends_at,
    isActive: true,
  };

  return NextResponse.json(finalPoll);
}