import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server"; // For checking auth initially
import { getUserInterviewCount } from "../../../../utils/supabase/actions";

export async function GET() {
  try {
    // Create Supabase client to check auth status first
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log("[api/user/interview-count] Unauthorized access attempt:", authError?.message);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If user is authenticated, then get their interview count.
    // getUserInterviewCount internally also gets the user, but this initial check
    // is specifically to return 401, as getUserInterviewCount would return 0 for no user.
    const interviewCount = await getUserInterviewCount();

    // getUserInterviewCount is designed to return a number (0 in cases of no profile etc.)
    // and handle its own errors by logging and returning 0.
    // So, a direct success response here is appropriate.
    return NextResponse.json({ interviewCount }, { status: 200 });
  } catch (error) {
    // This catch block is for unexpected errors in the process,
    // e.g., if createClient fails, or if getUserInterviewCount itself throws
    // an unexpected error (though it's designed not to for common cases).
    console.error("[api/user/interview-count] Error fetching interview count:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch interview count", details: errorMessage },
      { status: 500 }
    );
  }
}
