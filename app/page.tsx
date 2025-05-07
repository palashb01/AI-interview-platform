"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import { motion } from "framer-motion";
import { ArrowRight, Code, Mic, Video, Zap, Brain, MessageSquare, Clock } from "lucide-react";

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

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Powered Interviews",
    description: "Experience realistic technical interviews with our advanced AI interviewer",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Coding Challenges",
    description: "Solve real-world coding problems with our interactive code editor",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Detailed Feedback",
    description: "Get comprehensive feedback on your code quality and problem-solving approach",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Past Interviews",
    description: "Review your interview history and track your progress over time",
  },
];

export default function Home() {
  return (
    <>
      <TopBar />
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-5xl lg:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
              >
                Master Coding Interviews with AI
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300">
                Practice with our AI-powered interview platform. Get real-time feedback, improve
                your coding skills, and ace your next technical interview.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Button
                  asChild
                  size="lg"
                  className="px-8 py-6 text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  <Link href="/interview/start" className="flex items-center gap-2">
                    Start Interview <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] lg:h-[500px]"
            >
              <Image
                src="/assets/images/homepage.png"
                alt="AI Interview Platform"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-16">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container mx-auto px-6 py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div variants={fadeInUp} className="p-6">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                500+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Coding Problems</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-6">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                98%
              </div>
              <div className="text-gray-600 dark:text-gray-300">User Satisfaction</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-6">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                50+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Companies Covered</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center text-gray-600 dark:text-gray-400">
              Built with ❤️ by Palash Baderia
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
