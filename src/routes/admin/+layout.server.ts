import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return {};
  }
  if (locals.user.profile !== 'A') {
    throw redirect(303, '/unauthorized');
  }
  return { 
    user: locals.user, 
  };
};
