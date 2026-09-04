import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseConfig = {
  urlLoaded: Boolean(supabaseUrl),
  keyLoaded: Boolean(supabaseAnonKey),
  url: supabaseUrl ? `${supabaseUrl.slice(0, 30)}...` : '(empty)',
  keyPrefix: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 12)}...` : '(empty)',
};

export const supabase: SupabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);