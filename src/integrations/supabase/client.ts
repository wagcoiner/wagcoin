
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eesziftwzulrvotkzekz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlc3ppZnR3enVscnZvdGt6ZWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NDAwOTEsImV4cCI6MjA2MjMxNjA5MX0.skJ22FBsCBxge6Hkk7mCmmxA3yPJifC58aQCAt-MAtI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    // For faster development without email verification (comment this in production)
    flowType: 'pkce'
  }
});
