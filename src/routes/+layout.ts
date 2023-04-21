import type { LayoutLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { inject } from '@vercel/analytics';
 
inject();
export const load: LayoutLoad = async (event) => {
	const { session } = await getSupabase(event);
	return { session };
};
