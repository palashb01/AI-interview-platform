"use client";
import React, { Suspense, useState } from "react";
import { login } from "../../../utils/supabase/actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import * as loginIllustration from "@/public/lottie/login.json";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { createClient } from "@/utils/supabase/client";
import { FcGoogle } from "react-icons/fc";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing In...
        </>
      ) : (
        <>
          Sign In <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

function LoginForm({ nextPath, emailConfirm }: { nextPath: string; emailConfirm: string | null }) {
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  async function signInWithGoogle() {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (error) {
      console.error(error);
      setIsGoogleLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-gray-100 dark:border-gray-800 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {emailConfirm === "confirm" && (
          <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-600 dark:text-blue-400">
              Please check your email and verify your account before logging in.
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
          </Alert>
        )}
        <form className="space-y-4" action={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>
          <input type="hidden" name="next" value={nextPath} />
          <SubmitButton />
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={signInWithGoogle}
          disabled={isGoogleLoading}
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
        </Button>

        <div className="text-center mt-6 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Don&apos;t have an account? </span>
          <Link
            href="/signup"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function LoginFormWithParams() {
  const params = useSearchParams();
  const nextPath = params.get("next") ?? "/";
  const emailConfirm = params.get("auth");

  return <LoginForm nextPath={nextPath} emailConfirm={emailConfirm} />;
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration and Welcome Text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <div className="relative h-[400px]">
            <Lottie animationData={loginIllustration} loop={true} className="w-full h-full" />
          </div>
          <motion.h1
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
          >
            Welcome Back!
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-gray-600 dark:text-gray-300 text-lg"
          >
            Continue your journey to mastering coding interviews with our AI-powered platform.
          </motion.p>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <LoginFormWithParams />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
