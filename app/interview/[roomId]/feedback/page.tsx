// app/interview/[roomId]/feedback/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// --- Enhanced Circular Progress component ---
function CircularProgress({ label, value }: { label: string; value: number }) {
  const radius = 36;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const dashOffset = circumference - (value / 10) * circumference;

  return (
    <motion.div variants={fadeInUp} className="flex flex-col items-center">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2}>
          {/* background circle */}
          <circle
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-700"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* foreground progress */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            stroke="currentColor"
            className="text-indigo-500"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        {/* center number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold"
        >
          {value}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-2 text-sm text-center capitalize font-medium"
      >
        {label}
      </motion.div>
    </motion.div>
  );
}

export default function FeedbackPage() {
  const { roomId } = useParams();
  const [feedback, setFeedback] = useState<{
    ratings: Record<string, number>;
    improvements: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      console.log(roomId);
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("interview_feedback")
        .select("ratings,improvements")
        .eq("interview_id", roomId)
        .single();

      if (error) {
        console.error("Error fetching feedback:", error);
      } else {
        setFeedback(data);
      }
      setLoading(false);
    })();
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner text="Loading Your Feedback" />
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-red-600 text-xl"
          >
            No feedback found.
          </motion.div>
          <Link href="/interview/start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Start New Interview
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
          >
            Interview Feedback
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-lg"
          >
            Here&apos;s how you performed in your interview
          </motion.p>
        </div>

        {/* Ratings grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
        >
          {Object.entries(feedback.ratings).map(([key, val]) => (
            <motion.div
              key={key}
              variants={fadeInUp}
              className="
                bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                rounded-xl p-6
                shadow-lg hover:shadow-xl
                transition-all duration-300
                transform hover:-translate-y-1
              "
            >
              <CircularProgress label={key} value={val} />
            </motion.div>
          ))}
        </motion.div>

        {/* Suggestions / Improvements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-xl p-8
            shadow-lg
          "
        >
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-6 w-6 text-indigo-500" />
            <h2 className="text-2xl font-semibold">Suggestions for Improvement</h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed"
          >
            {feedback.improvements}
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-4 pt-4"
        >
          <Link href="/interview/start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                px-6 py-3
                bg-gradient-to-r from-indigo-500 to-purple-600
                text-white rounded-lg
                hover:from-indigo-600 hover:to-purple-700
                transition-all duration-300
                flex items-center gap-2
                shadow-lg hover:shadow-xl
              "
            >
              Start New Interview <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
