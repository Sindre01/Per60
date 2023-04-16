import { createClient } from '@supabase/auth-helpers-sveltekit';
// import { env } from '$env/dynamic/public';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY} from '$env/static/public';

export const supabaseClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
