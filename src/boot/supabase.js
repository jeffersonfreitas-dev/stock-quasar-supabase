import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bfbizobxxovoqqequxun.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmYml6b2J4eG92b3FxZXF1eHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc0NDU2OTksImV4cCI6MTk5MzAyMTY5OX0.2seCs4RgN0a1nnD_ixWwijhTN4voRf6MduokN9Q6HZY'
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('supabase -> ', supabase)

export default function useSupabase () {
  return { supabase }
}
