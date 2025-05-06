"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { companies } from "@/lib/companies";
import { motion } from "framer-motion";
import { Building2, Clock, ArrowRight, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import * as interviewIllustration from "@/public/lottie/interview-illustration.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

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

export default function StartInterviewPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  type Company = { id: string; name: string };
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Validate numeric experience
  useEffect(() => {
    if (experience === "") {
      setError("Experience is required");
    } else if (!/^\d+$/.test(experience)) {
      setError("Please enter a valid whole number");
    } else {
      setError("");
    }
  }, [experience]);

  const handleStart = async () => {
    if (!companyId || error) return;
    setLoading(true);
    try {
      const { data } = await axios.post("/api/interview/start", {
        companyId,
        experience: parseInt(experience, 10),
      });
      router.push(`/interview/${data.interviewId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration and Welcome Text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <div className="relative h-[400px]">
            <Lottie
              animationData={interviewIllustration}
              loop={true}
              className="w-full h-full"
            />
          </div>
          <motion.h1
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
          >
            Ready to Ace Your Interview?
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-gray-600 dark:text-gray-300 text-lg"
          >
            Select your target company and experience level to begin your
            personalized AI-powered interview session.
          </motion.p>
        </motion.div>

        {/* Right side - Interview Setup Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border-2 border-gray-100 dark:border-gray-700"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <h2 className="text-2xl font-bold text-center mb-2">
                Start Your Interview
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Choose your target company and experience level
              </p>
            </motion.div>

            {/* Company Selection */}
            <motion.div variants={fadeInUp} className="space-y-4 mb-6">
              <Label
                htmlFor="company"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Target Company
              </Label>
              <select
                id="company"
                value={companyId}
                onChange={(e) => {
                  setCompanyId(e.target.value);
                  const company = companies.find(
                    (c) => c.id === e.target.value,
                  );
                  setSelectedCompany(company || null);
                }}
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="" disabled>
                  Select a company
                </option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Experience Input */}
            <motion.div variants={fadeInUp} className="space-y-4 mb-8">
              <Label
                htmlFor="experience"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Years of Experience
              </Label>
              <Input
                id="experience"
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 3"
                className="w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 dark:text-red-400"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>

            {/* Start Button */}
            <motion.div variants={fadeInUp}>
              <Button
                onClick={handleStart}
                disabled={!companyId || !!error || loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Preparing Interview...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Start Interview <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
