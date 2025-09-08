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

  // Increment the votes for the selected option
  const { data, error } = await supabase
    .from("poll_options")
    .update({ votes: supabase.rpc('increment_votes') })
    .eq('id', optionId)
    .eq('poll_id', pollId)
    .select();

  if (error) {
    console.error("Error voting on poll:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
