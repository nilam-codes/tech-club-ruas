import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are validly provided (not empty or default template string)
const isValidUrl = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
);

const isValidAnonKey = Boolean(
  supabaseAnonKey &&
  supabaseAnonKey.length > 20 &&
  !supabaseAnonKey.includes('your-supabase-anon-key')
);

export const isSupabaseConfigured = () => isValidUrl && isValidAnonKey;

// Safely instantiate client or export null if credentials are not configured yet
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

if (!isSupabaseConfigured() && import.meta.env.DEV) {
  // Helpful notification for developers during initial setup
  console.info(
    '[TECH CLUB] Supabase client is operating in offline/fallback mode. ' +
    'Provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to connect to live database.'
  );
}

export default supabase;

