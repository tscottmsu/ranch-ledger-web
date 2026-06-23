import "server-only";

import { createClient } from "@/lib/supabase/server";

export type SignUpInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  emailRedirectTo: string;
};

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(input: SignUpInput) {
  const supabase = await createClient();
  return supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: input.emailRedirectTo,
      data: { first_name: input.firstName, last_name: input.lastName },
    },
  });
}

export async function signOut() {
  const supabase = await createClient();
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}

export async function exchangeCodeForSession(code: string) {
  const supabase = await createClient();
  return supabase.auth.exchangeCodeForSession(code);
}
