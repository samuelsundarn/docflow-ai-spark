// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wsuqoonzmpaeyqchscin.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdXFvb256bXBhZXlxY2hzY2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzQ0ODUsImV4cCI6MjA2NDgxMDQ4NX0.cbueSuj80o3xbZTVDyve-jSI9F0Z41zRo5A0hFIYMaI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);