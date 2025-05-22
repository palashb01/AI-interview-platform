import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";
import {
  getUserInterviewCount,
  incrementUserInterviewCount,
} from "../../../../utils/supabase/actions";

export async function POST(req: NextRequest) {
  const { companyId, experience } = await req.json();
  console.log("↪️  [api/interview/start] payload:", { companyId, experience });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !user?.id) {
    // Also check for user.id for logging/consistency
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const interviewCount = await getUserInterviewCount();
    console.log(
      `ℹ️ [api/interview/start] User ${user.id} current interview count: ${interviewCount}`
    );

    if (interviewCount >= 5) {
      console.log(
        `⚠️ [api/interview/start] User ${user.id} has reached their interview limit of 5.`
      );
      return NextResponse.json(
        { error: "Interview limit reached. You can attempt a maximum of 5 interviews." },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("❌ [api/interview/start] Error checking user interview count:", error);
    return NextResponse.json({ error: "Could not verify interview eligibility" }, { status: 500 });
  }

  const { data: questions, error: qErr } = await supabase
    .from("questions")
    .select("id")
    .eq("company_id", companyId);

  if (qErr) {
    console.log("⚠️ [api/interview/start] Error fetching questions:", qErr);
    return NextResponse.json({ error: "Could not fetch questions" }, { status: 500 });
  }
  if (!questions || questions.length === 0) {
    console.log("⚠️ [api/interview/start] No questions found for company:", companyId);
    return NextResponse.json({ error: "No questions found" }, { status: 404 });
  }
  console.log(`ℹ️ [api/interview/start] Found ${questions.length} questions`);

  // 4️⃣ Pick one at random client-side
  const randomIndex = Math.floor(Math.random() * questions.length);
  const questionId = questions[randomIndex].id;
  console.log("✅ [api/interview/start] Selected questionId:", questionId);

  // 5️⃣ Insert a new interview record
  const { data: interview, error: iErr } = await supabase
    .from("interviews")
    .insert({
      question_id: questionId,
      user_email: user.email,
      experience,
    })
    .select("id")
    .single();

  if (iErr || !interview) {
    console.log("❌ [api/interview/start] Failed to create interview:", iErr);
    return NextResponse.json({ error: "Could not create interview" }, { status: 500 });
  }

  try {
    await incrementUserInterviewCount();
    console.log(`📈 [api/interview/start] Incremented interview count for user ${user.id}.`);
  } catch (error) {
    // Log the error, but should we roll back the interview creation or just warn?
    // For now, let's assume failing to increment the count is a critical issue related to data integrity.
    // However, the interview IS created. This could lead to inconsistencies.
    // A more robust solution might involve a transaction or a compensating action.
    // For this task, logging the error and returning a 500 is a reasonable approach,
    // though it means the user got an interview but their count might not reflect it.
    console.error(
      "❌ [api/interview/start] Failed to increment interview count for user:",
      user.id,
      error
    );
    // It's debatable whether to return 500 here, as the interview was created.
    // However, failing to increment the count breaks the limit system.
    // Let's return 500 to indicate the overall operation was not fully successful.
    return NextResponse.json(
      { error: "Interview created, but failed to update count. Please contact support." },
      { status: 500 }
    );
  }
  console.log("🎉 [api/interview/start] Created interview:", interview.id);
  // 6️⃣ Return the new interviewId and questionId
  return NextResponse.json({
    interviewId: interview.id,
    questionId,
  });
}
