// components/TopBar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, LogOut, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { signOut } from "@/utils/supabase/actions";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function TopBar() {
  const { toggleTheme } = useTheme();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [remainingInterviews, setRemainingInterviews] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setUserEmail(data.user?.email ?? null);
      if (data.user) {
        try {
          const response = await fetch("/api/user/interview-count");
          if (response.ok) {
            const jsonData = await response.json();
            if (typeof jsonData.interviewCount === "number") {
              const remaining = 5 - jsonData.interviewCount;
              setRemainingInterviews(remaining < 0 ? 0 : remaining); // Ensure not negative
            } else {
              console.error("Unexpected data format from /api/user/interview-count:", jsonData);
              setRemainingInterviews(null); // Or some error state indicator if preferred
            }
          } else {
            console.error("Failed to fetch interview count:", response.status, response.statusText);
            setRemainingInterviews(null); // Or some error state indicator
          }
        } catch (error) {
          console.error("Error fetching interview count:", error);
          setRemainingInterviews(null); // Or some error state indicator
        }
      } else {
        setRemainingInterviews(null); // Reset if user logs out
      }
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="container flex h-14 items-center justify-between">
        {/* Left: logo + name */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/assets/images/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-lg transition-transform hover:scale-105"
          />
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            AI Interview
          </span>
        </Link>

        {/* Middle: Navigation Links (visible on large screens) */}
        {userEmail && (
          <nav className="absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-6">
              <Link
                href="/past-interviews"
                className={`text-sm font-medium transition-colors relative group ${
                  pathname === "/past-interviews"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="relative z-10">Past Interviews</span>
                {pathname === "/past-interviews" && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-[1.5px] left-0 right-0 h-0.5 bg-indigo-500"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="absolute -bottom-[1.5px] left-0 right-0 h-0.5 bg-indigo-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </Link>
              {remainingInterviews === 0 ? (
                <span
                  className={`text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed relative group`}
                >
                  New Interview
                </span>
              ) : (
                <Link
                  href="/interview/start"
                  className={`text-sm font-medium transition-colors relative group ${
                    pathname === "/interview/start"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  } ${remainingInterviews === 0 ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                  aria-disabled={remainingInterviews === 0}
                  onClick={(e) => {
                    if (remainingInterviews === 0) e.preventDefault();
                  }}
                >
                  <span className="relative z-10">New Interview</span>
                  {pathname === "/interview/start" && remainingInterviews !== 0 && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-[1.5px] left-0 right-0 h-0.5 bg-indigo-500"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {remainingInterviews !== 0 && (
                    <div className="absolute -bottom-[1.5px] left-0 right-0 h-0.5 bg-indigo-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                  )}
                </Link>
              )}
            </div>
          </nav>
        )}

        {/* Right: theme toggle + interview count + auth buttons */}
        <div className="flex items-center space-x-4">
          {userEmail && remainingInterviews !== null && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 dark:border-indigo-500/10">
                    <Zap className="h-4 w-4 text-indigo-500" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-indigo-500">{remainingInterviews}</span>
                      <span className="text-xs text-muted-foreground">/5</span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Interviews remaining</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {userEmail ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative rounded-full shadow-none hover:bg-transparent"
                >
                  <Image
                    src="/assets/images/avatar.png"
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="rounded-full transition-transform hover:scale-105"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userEmail}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Mobile Navigation Links (only visible on mobile) */}
                <div className="md:hidden">
                  <DropdownMenuItem asChild>
                    <Link href="/past-interviews" className="cursor-pointer">
                      Past Interviews
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/interview/start" className="cursor-pointer">
                      New Interview
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400 cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white"
              >
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
