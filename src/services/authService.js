import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

export async function login(email, password) {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Backend is offline.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function logout() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function checkIsAdmin() {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return false;
  }

  try {
    const { data, error } = await supabase.rpc('is_admin');

    if (error) {
      console.error('[authService] Error checking admin status via RPC:', error);
      return false;
    }

    return !!data; // True if data exists (admin), false otherwise
  } catch (err) {
    console.error('[authService] Unexpected error checking admin status:', err);
    return false;
  }
}

export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session;
}

export function onAuthStateChange(callback) {
  if (!supabase) return () => {};
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}

export async function sendPasswordResetEmail(email) {
  if (!isSupabaseConfigured() || !supabase) return { success: false, error: 'Backend is offline.' };
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/#admin/reset-password',
  });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function updatePassword(newPassword) {
  if (!isSupabaseConfigured() || !supabase) return { success: false, error: 'Backend is offline.' };

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}
