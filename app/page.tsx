"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import { motion } from "framer-motion";
import { ArrowRight, Code, Mic, Video, Zap } from "lucide-react";

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
    icon: <Mic className="w-6 h-6" />,
    title: "Voice Interaction",
    description: "Natural conversation with AI interviewer",
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Video Recording",
    description: "Record your interview for later review",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Real-time Coding",
    description: "Write and test code in real-time",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Feedback",
    description: "Get immediate AI-powered feedback",
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
                alt="AI Interview Illustration"
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
                1000+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Interviews Conducted</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-6">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                95%
              </div>
              <div className="text-gray-600 dark:text-gray-300">Success Rate</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-6">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                24/7
              </div>
              <div className="text-gray-600 dark:text-gray-300">Available Practice</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
