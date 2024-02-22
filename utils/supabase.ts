import { createClient } from "@supabase/supabase-js";
// types
import { Database } from "@/types/supabase";
//----------------------------------------------------------------------
// SUPABASE SETUP

const supabaseUrl = 'https://gbvjqnycoopylzviqeol.supabase.co'
const supabaseKey = process.env.EXPO_PUBLIC_API_KEY || ''
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)