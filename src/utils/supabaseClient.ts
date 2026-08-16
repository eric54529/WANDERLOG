import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as unknown as { env?: Record<string, string> })?.env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://vhtmhoijypfcodpjyext.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZodG1ob2lqeXBmY29kcGp5ZXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4NTIwNzgsImV4cCI6MjEwMjQyODA3OH0.1mn9X-BlCwpxk5p48n31xWrHIkdN0UJl4vqLXreds1Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
