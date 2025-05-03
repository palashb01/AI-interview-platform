"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { companies } from "@/lib/companies";

export default function StartInterviewPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-6">
      <div
        className="
          w-full max-w-md space-y-6 p-8
          bg-card dark:bg-gray-800
          border border-border dark:border-gray-700
          rounded-lg
          shadow-lg dark:shadow-xl
          transition-colors
        "
      >
        <h2 className="text-2xl font-semibold text-foreground">
          Start Interview
        </h2>

        {/* Company */}
        <div className="space-y-1">
          <Label htmlFor="company" className="text-foreground">
            Company
          </Label>
          <select
            id="company"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="
              w-full
              bg-input dark:bg-gray-700
              text-foreground
              border border-border dark:border-gray-600
              rounded px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              transition-colors
            "
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
        </div>

        {/* Experience */}
        <div className="space-y-1">
          <Label htmlFor="experience" className="text-foreground">
            Experience (years)
          </Label>
          <Input
            id="experience"
            type="number"
            min="0"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="e.g. 3"
            className="
              bg-input dark:bg-gray-700
              text-foreground
              border border-border dark:border-gray-600
              focus:ring-2 focus:ring-primary/50 focus:border-primary
              transition-colors
            "
          />
          {error && (
            <p className="text-sm text-destructive dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          onClick={handleStart}
          disabled={!companyId || !!error || loading}
          className="w-full"
        >
          {loading ? "Starting…" : "Start Interview"}
        </Button>
      </div>
    </div>
  );
}
