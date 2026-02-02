// Supabase Configuration
// Environment variables are injected at runtime by netlify-plugin-use-env-in-runtime
// For local development, replace the placeholders below with your actual credentials
// Get these from: https://app.supabase.com/project/YOUR_PROJECT/settings/api

// Check if running on Netlify (env vars injected by plugin) or local development
const SUPABASE_URL = window.env?.SUPABASE_DATABASE_URL || 'YOUR_SUPABASE_URL'; // e.g., 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = window.env?.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'; // Your anon/public key

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

