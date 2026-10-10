/* Public client config. The anon / publishable key is safe to commit — Row Level Security
   protects the data. Never put the service-role key, Anthropic key or family code here. */
window.APP_CONFIG = {
  SUPABASE_URL: 'https://fahzmhatfjvaeaaqcioj.supabase.co',
  SUPABASE_ANON_KEY: 'PASTE_PUBLISHABLE_KEY_HERE', // Supabase → Project Settings → API Keys
};
