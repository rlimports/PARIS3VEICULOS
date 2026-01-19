
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ccscbairmjdoatubgjbf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc2NiYWlybWpkb2F0dWJnamJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NTAxMjUsImV4cCI6MjA4NDMyNjEyNX0.lgLZFOfAgUE9IvhIT7BDtBTQAMRqpIwTGJ7UuSvAuJs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
