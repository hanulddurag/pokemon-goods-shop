import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rcqaonpsdvnwlmcpqpzg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjcWFvbnBzZHZud2xtY3BxcHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQzNjMzOTUsImV4cCI6MjEwOTkzOTM5NX0.7StAld_jQcpoqNujo-xio5yFxU4NbqtcL34BlaNmIsc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'rcqaonpsdvnwlmcpqpzg';
export const SUPABASE_URL = supabaseUrl;
