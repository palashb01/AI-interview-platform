import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function GET(req: NextRequest, { params }: { params: { interviewId: string } }) {
  const { interviewId } = await params;

  const supabase = await createClient();

  // 1. find the interview record
  const { data: iv, error: ivErr } = await supabase
    .from("interviews")
    .select("question_id")
    .eq("id", interviewId)
    .single();
  if (ivErr || !iv) {
    return NextResponse.json({ error: "Interview not found" }, { status: 404 });
  }

  // 2. fetch question details
  const { data: q, error: qErr } = await supabase
    .from("questions")
    .select("title, body_md, boilercode, company_id")
    .eq("id", iv.question_id)
    .single();
  if (qErr || !q) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  // 3. return to frontend
  return NextResponse.json(q);
}
