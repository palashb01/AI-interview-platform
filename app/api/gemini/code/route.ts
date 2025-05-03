import { NextRequest, NextResponse } from 'next/server'
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { codeGenerationSchema } from "../../../../constants/index";

export async function POST(req: NextRequest) {
    const { question, code } = await req.json()
    if (typeof question !== 'string' || typeof code !== 'string') {
        return NextResponse.json({ error: 'Missing question or code' }, { status: 400 })
      }
    const {object} = await generateObject({
        model: google("gemini-2.0-flash-001", {
            structuredOutputs: false,
          }),
        prompt: `You are a code reviewer for the C++ technical leetcode style function completion interview coding round, you are given a question and the code submitted by the user for the question, review the code and return if the code is correct or not in boolen value and if it is correct then return:
        {
         correct: true,
         mistake: '',
        }
         
        if the code is not correct then return the mistake in text format in the mistake field and return:
        {
          correct: false,
          mistake: 'the vector is not sorted',
        }
          
        Question: ${question}
        Code: ${code}`
        ,
        schema: codeGenerationSchema,
        system: `You are a code reviewer for the C++ technical leetcode style function completion interview coding round, you are given a question and the code submitted by the user for the question, review the code`
    })
    return NextResponse.json(object)
}