import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://isveeimfwjvcykpgjxhv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_03tJT2ZZO_6UkXQ_rnI5ZA_PhrYfVFp';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


export default supabase;
