import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { feedbackSchema } from "@/constants";

export async function POST(req: NextRequest) {
  const { messages, question, code, interviewId } = await req.json();
  if (
    !Array.isArray(messages) ||
    typeof question !== "string" ||
    typeof code !== "string" ||
    typeof interviewId !== "string"
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  console.log("↪️  [api/gemini/feedback] payload:", {
    messages,
    question,
    code,
    interviewId,
  });
  const prompt = `
        You are an expert technical coding interview reviewer, based on the below transacript of the conversation between user and assistant
        with the submitted coding code by the user, please rate the candidate on a scale of 0 to 10 for each of the following parameters and also suggest some improvements, the interview style was of leetcode style function completion interview in c++.
        Important point: 
        - The function signature is provided by the interviewer not the candidate so consider the implementation for review.
        - the function signature also says implementation goes here don't say these things in improvement only conside the implementation, if it is empty say code is empty.
        Given:
        - Check the code for all edge cases.

        • The transcript of the live interview (role/content pairs):
        ${messages.map((m) => `${m.role}: ${m.content}`).join("\n")}

        • The original question:
        ${question}

        • The candidate’s submitted C++ code:
        \`\`\`cpp
        ${code}
        \`\`\`

        Please output **only** a JSON object with this exact shape:

        {
        "ratings": {
            "communication":       0–10,
            "technicalKnowledge":  0–10,
            "problemSolving":      0–10,
            "confidenceClarity":   0–10,
            "codeQuality":         0–10
        },
        "improvements": "…a few sentences of concrete suggestions…"
        }
        `.trim();

  // 3) Generate the structured feedback via Gemini
  const { object: raw } = await generateObject({
    model: google("gemini-2.0-flash-001", {
      structuredOutputs: false,
    }),
    prompt,
    schema: feedbackSchema,
    system: `You are an expert technical coding interview reviewer, based on the below transacript of the conversation between user and assistant
        with the submitted coding code by the user, please rate the candidate on a scale of 0 to 10 for each of the following parameters and also suggest some
        improvements, the interview style was of leetcode style function completion interview in c++.`,
  });
  const parsed = feedbackSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("Feedback schema mismatch:", parsed.error, raw);
    return NextResponse.json({ error: "Model returned invalid feedback" }, { status: 502 });
  }

  const feedback = parsed.data;
  try {
    const supabase = await createClient();
    await supabase.from("interview_feedback").insert({
      interview_id: interviewId,
      ratings: feedback.ratings, // JSONB column
      improvements: feedback.improvements, // TEXT column
      submitted_code: code,
    });
    await supabase.from("interviews").update({ finished: true }).eq("id", interviewId);
  } catch (dbErr) {
    console.error("DB insert error:", dbErr);
    // We still return feedback even if the DB insert fails
  }

  // 6) Return the structured feedback
  return NextResponse.json(feedback);
}
