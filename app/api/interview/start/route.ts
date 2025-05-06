import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function POST(req: NextRequest) {
  const { companyId, experience } = await req.json();
  console.log("↪️  [api/interview/start] payload:", { companyId, experience });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  console.log("🎉 [api/interview/start] Created interview:", interview.id);
  // 6️⃣ Return the new interviewId and questionId
  return NextResponse.json({
    interviewId: interview.id,
    questionId,
  });
}
