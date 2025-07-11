import { supabase } from './supabaseClient';

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export function getCurrentUser() {
  return supabase.auth.getUser();
}
