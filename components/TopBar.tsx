"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { signOut } from "@/utils/supabase/actions";
import { Button } from "./ui/button";

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 shadow">
      {/* left: logo + name */}
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/assets/images/logo.png"
          alt="Logo"
          width={32}
          height={32}
        />
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
          AI Interview
        </span>
      </Link>

      {/* right: theme toggle + user menu */}
      <div className="flex items-center space-x-4">
        {/* theme toggle */}
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

        {/* user avatar + dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image
              src="/assets/images/avatar.png"
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-30">
            <DropdownMenuItem asChild>
              <Button onClick={signOut}>Logout</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
