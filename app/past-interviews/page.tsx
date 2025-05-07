"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, Code, Clock, MessageSquare, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { InterviewOverlay } from "@/components/ui/InterviewOverlay";

interface Interview {
  id: string;
  submitted_at: string;
  ratings: {
    codeQuality: number;
    communication: number;
    problemSolving: number;
    confidenceClarity: number;
    technicalKnowledge: number;
  };
  interview_id: string;
  improvements: string;
  submitted_code: string;
  interviews: {
    experience: string;
    questions: {
      body_md: string;
      company_id: string;
    };
  };
}

interface DatabaseRow {
  id: string;
  ratings: {
    codeQuality: number;
    communication: number;
    problemSolving: number;
    confidenceClarity: number;
    technicalKnowledge: number;
  };
  improvements: string;
  submitted_at: string;
  submitted_code: string;
  interview_id: string;
  interviews: {
    questions: {
      body_md: string;
      company_id: string;
    };
    experience: string;
  };
}

export default function PastInterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOverlay, setSelectedOverlay] = useState<{
    type: "feedback" | "solution";
    content: string;
    question?: string;
    ratings?: {
      codeQuality: number;
      communication: number;
      problemSolving: number;
      confidenceClarity: number;
      technicalKnowledge: number;
    };
  } | null>(null);

  useEffect(() => {
    async function fetchInterviews() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: rows, error } = await supabase
        .from("interview_feedback")
        .select(
          `
          id,
          ratings,
          improvements,
          submitted_at,
          submitted_code,
          interview_id,                       
          interviews!inner(
            experience,
            questions!inner(
              body_md,
              company_id
            )
          )
        `
        )
        .eq("interviews.user_email", user.email)
        .order("submitted_at", { ascending: true });

      if (error) {
        console.error("Error fetching interviews:", error);
        return;
      }

      // Transform the data to match the Interview interface
      const transformedData = ((rows || []) as unknown as DatabaseRow[]).map((row) => ({
        id: row.id,
        submitted_at: row.submitted_at,
        ratings: row.ratings,
        improvements: row.improvements,
        submitted_code: row.submitted_code,
        interview_id: row.interview_id,
        interviews: {
          experience: row.interviews.experience,
          questions: {
            body_md: row.interviews.questions.body_md,
            company_id: row.interviews.questions.company_id,
          },
        },
      }));

      setInterviews(transformedData);
      setLoading(false);
    }

    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Past Interviews</h1>
        <Link
          href="/interview/start"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Start New Interview
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      {interviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
        >
          <div className="max-w-md mx-auto">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Interviews Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start your first interview to begin your coding journey with AI feedback.
            </p>
            <Link
              href="/interview/start"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Start Your First Interview
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviews.map((interview, index) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-indigo-100 dark:hover:border-indigo-900">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {interview.interviews?.questions?.company_id?.charAt(0).toUpperCase() +
                          interview.interviews?.questions?.company_id?.slice(1).toLowerCase() ||
                          "Unknown Company"}{" "}
                        - {interview.interviews?.experience || "Unknown"} Level
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(interview.submitted_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <Clock className="h-3 w-3 ml-2" />
                        <span>
                          {new Date(interview.submitted_at).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      C++
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ratings Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Overall Score</span>
                      <span className="font-medium">
                        {Math.round(
                          (interview.ratings.problemSolving +
                            interview.ratings.codeQuality +
                            interview.ratings.communication +
                            interview.ratings.technicalKnowledge +
                            interview.ratings.confidenceClarity) /
                            5
                        )}
                        /10
                      </span>
                    </div>
                    <Progress
                      value={
                        (interview.ratings.problemSolving +
                          interview.ratings.codeQuality +
                          interview.ratings.communication +
                          interview.ratings.technicalKnowledge +
                          interview.ratings.confidenceClarity) *
                        2
                      }
                      className="h-1.5"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        setSelectedOverlay({
                          type: "feedback",
                          content: interview.improvements,
                          ratings: interview.ratings,
                        })
                      }
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Feedback
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        setSelectedOverlay({
                          type: "solution",
                          content: interview.submitted_code,
                          question: interview.interviews.questions.body_md,
                        })
                      }
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Solution
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Overlay */}
      {selectedOverlay && (
        <InterviewOverlay
          isOpen={!!selectedOverlay}
          onClose={() => setSelectedOverlay(null)}
          type={selectedOverlay.type}
          content={selectedOverlay.content}
          question={selectedOverlay.question}
          ratings={selectedOverlay.ratings}
        />
      )}
    </div>
  );
}
