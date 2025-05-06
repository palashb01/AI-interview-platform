// components/TopBar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { signOut } from "@/utils/supabase/actions";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 shadow">
      {/* Left: logo + name */}
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/assets/images/logo.png" alt="Logo" width={32} height={32} />
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">AI Interview</span>
      </Link>

      {/* Right: theme toggle + auth buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-gray-900" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </button>

        {userEmail ? (
          // signed-in: avatar that logs out on click
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Image
                src="/assets/images/avatar.png"
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
          // not signed-in: Log In / Sign Up
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
