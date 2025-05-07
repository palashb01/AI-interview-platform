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
