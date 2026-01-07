import { redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import { CLIENTAUTHINFO } from '$lib/utils';

export const actions: Actions = {
  default: async ({ cookies }) => {
    const clientAuthInfo = cookies.get(CLIENTAUTHINFO) ?? null;
    if (clientAuthInfo) {
      cookies.delete(CLIENTAUTHINFO, { path: '/' });
    }
    throw redirect(303, '/');
  }
}
