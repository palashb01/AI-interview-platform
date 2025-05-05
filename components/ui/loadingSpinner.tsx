// components/ui/LoadingLottie.tsx
"use client";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import loadingAnimation from "../../public/lottie/loadingSpinner.json";
import clsx from "clsx";

interface LoadingLottieProps {
  text?: string;
  loop?: boolean;
  className?: string;
  size?: number;
}

export function LoadingSpinner({
  text = "Loading…",
  loop = true,
  className,
  size = 56,
}: LoadingLottieProps) {
  const { theme } = useTheme();

  // optional: tint the animation via CSS filter in dark mode
  const filterClass = theme === "dark" ? "filter invert" : "";

  return (
    <div
      className={clsx("flex flex-col items-center justify-center", className)}
    >
      <Lottie
        animationData={loadingAnimation}
        loop={loop}
        style={{
          width: size,
          height: size,
          background: "transparent", // ← force container transparent
        }}
        className={clsx("mx-auto", filterClass)}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{text}</p>
      )}
    </div>
  );
}
