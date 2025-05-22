"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // pull in the optional `next` param (default to '/')
  const next = (formData.get("next") as string | null) || "/";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }

  // re-render any layouts that depend on user state
  revalidatePath("/", "layout");

  // finally, send them on to `next`
  redirect(next);
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const formInputData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signUp(formInputData);
  if (data.user?.role != "authenticated" && data.user != null) {
    return { error: "User already exists! Please login." };
  }
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/login?auth=confirm");
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
  redirect("/login");
}

export async function getUserInterviewCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("Error fetching user or no user logged in:", userError?.message);
    // Or throw new Error("User not found");
    return 0; // As per requirement, return 0 if no user
  }

  const { data, error } = await supabase
    .from("user_profiles") // Assuming 'user_profiles' table
    .select("interview_count")
    .eq("user_id", user.id) // Assuming 'user_id' is the foreign key to auth.users
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // PGRST116: "The result contains 0 rows" - No profile found for the user
      console.log(`No profile found for user ${user.id}, returning count 0.`);
      return 0;
    }
    console.error("Error fetching interview count:", error.message);
    // Depending on desired error handling, you might throw error or return a specific error indicator
    // For now, returning 0 as per "If no profile is found or interview_count is null, it should return 0."
    return 0;
  }

  return data?.interview_count || 0;
}

export async function incrementUserInterviewCount(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error fetching user or no user logged in for increment:", userError?.message);
    // Or throw new Error("User not found");
    return; // Exit if no user
  }

  // Fetch current count first
  const { data: currentProfile, error: fetchError } = await supabase
    .from("user_profiles") // Assuming 'user_profiles' table
    .select("interview_count")
    .eq("user_id", user.id) // Assuming 'user_id' is the foreign key
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error fetching profile for increment:", fetchError.message);
    // Or throw new Error("Could not fetch profile for increment");
    return;
  }

  const currentCount = currentProfile?.interview_count || 0;
  const newCount = currentCount + 1;

  // Update the count or insert if profile didn't exist (upsert might be better if supported easily)
  // For simplicity, let's assume a profile row might not exist and we should create one.
  // However, the prompt implies incrementing an *existing* count.
  // If the profile might not exist, an upsert is safer.
  // Supabase `upsert` can handle this. If `user_profiles` has `user_id` as PK or unique constraint.

  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({ interview_count: newCount })
    .eq("user_id", user.id);

  if (updateError) {
    console.error("Error incrementing interview count:", updateError.message);
    // Or throw new Error("Could not increment interview count");
    // If the row didn't exist, update will fail.
    // Consider an upsert or creating the row if it's a valid scenario.
    // For now, sticking to "increment" which implies existence.
    // If PGRST116 occurred during fetch, and we try to update, it will also likely fail or do nothing.
    // A more robust solution would use upsert or ensure the profile row exists.
    // Let's refine this: if the profile didn't exist (PGRST116 on fetch), we should insert.

    if (fetchError && fetchError.code === "PGRST116") {
      // Profile didn't exist, so let's insert it with count 1
      console.log(
        `No profile found for user ${user.id}. Creating profile with interview_count = 1.`
      );
      const { error: insertError } = await supabase
        .from("user_profiles")
        .insert({ user_id: user.id, interview_count: 1 }); // Assuming 'user_id'

      if (insertError) {
        console.error("Error inserting new profile during increment:", insertError.message);
        // Or throw new Error("Could not insert new profile during increment");
      } else {
        console.log(
          `Successfully created profile and set interview_count to 1 for user ${user.id}`
        );
      }
    } else if (updateError) {
      // Only log update error if it wasn't due to non-existent row handled by insert
      console.error("Error incrementing interview count (update failed):", updateError.message);
    }
  } else {
    console.log(`Successfully incremented interview_count to ${newCount} for user ${user.id}`);
  }
}
