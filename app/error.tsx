"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <motion.div
        initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 5 }}
        className="w-full max-w-md mx-4"
      >
        <Card className="text-center">
          <CardHeader>
            <motion.div
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{
                scale: [0.5, 1.2, 0.8, 1],
                rotate: [-15, 10, -5, 0],
              }}
              transition={{
                delay: 0.2,
                duration: 1,
                times: [0, 0.5, 0.8, 1],
                type: "tween",
                ease: "easeOut",
              }}
            >
              <CardTitle className="text-4xl">😵‍💫 Whoopsie Daisy!</CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.p
              className="mb-4 text-lg"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                delay: 0.4,
                type: "spring",
                stiffness: 150,
                damping: 12,
              }}
            >
              {error.message || "Looks like our code monkeys tripped over a banana peel."}
            </motion.p>
            <motion.p
              className="mb-6 italic text-sm text-gray-600"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 150,
                damping: 12,
              }}
            >
              But don't worry, they're picking themselves up as we speak.
            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.1, 0.9, 1] }}
              transition={{
                delay: 0.6,
                duration: 0.8,
                type: "tween",
                times: [0, 0.5, 0.9, 1],
                ease: "easeOut",
              }}
              className="space-y-4"
            >
              <Button onClick={reset} className="w-full">
                Try Again 🔄
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/" className="block w-full">
                  Take me back home 🏠
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
