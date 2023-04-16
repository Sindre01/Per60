import { createClient } from '@supabase/auth-helpers-sveltekit';
import { env } from '$env/dynamic/public';
import { NEXT_PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY} from '$env/static/private';

export const supabaseClient = createClient(NEXT_PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
