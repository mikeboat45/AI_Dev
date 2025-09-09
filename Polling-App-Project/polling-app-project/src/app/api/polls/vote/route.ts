import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be logged in to vote." }, { status: 401 });
  }

  const { pollId, optionId } = await request.json();

  if (!pollId || !optionId) {
    return NextResponse.json({ error: "Poll ID and option ID are required." }, { status: 400 });
  }

  // Check if the poll is expired
  const { data: poll } = await supabase
    .from("polls")
    .select("ends_at")
    .eq("id", pollId)
    .single();

  if (poll?.ends_at && new Date(poll.ends_at) < new Date()) {
    return NextResponse.json({ error: "This poll has closed." }, { status: 400 });
  }

  // Increment the votes for the selected option
  const { data, error } = await supabase
    .rpc('increment_vote', { option_id: optionId, poll_id: pollId });

  if (error) {
    console.error("Error voting on poll:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
