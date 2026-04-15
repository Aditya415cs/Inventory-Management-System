import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://luemjpymvwjlgbnctlby.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1ZW1qcHltdndqbGdibmN0bGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4OTgyMzMsImV4cCI6MjA5MTQ3NDIzM30.frr441ia8BeuFNUeBcMkHedqZm4xB6Zr0N43XMhMEho";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);