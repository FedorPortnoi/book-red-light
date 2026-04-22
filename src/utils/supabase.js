import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hosqexsglgfvhjgwdpau.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvc3FleHNnbGdmdmhqZ3dkcGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNzMyNjIsImV4cCI6MjA5MTk0OTI2Mn0.jeFWBVwRrYgk0jLOL9pSl7LNLjRoo7uopBQYVxLH3Bs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
