import { z } from "zod";

const codeGenerationSchema = z.object({
  correct: z.boolean(),
  mistake: z.string(),
});

const feedbackSchema = z.object({
  ratings: z.object({
    communication: z.number().min(0).max(10),
    technicalKnowledge: z.number().min(0).max(10),
    problemSolving: z.number().min(0).max(10),
    confidenceClarity: z.number().min(0).max(10),
    codeQuality: z.number().min(0).max(10),
  }),
  improvements: z.string(),
});

export { codeGenerationSchema, feedbackSchema };
