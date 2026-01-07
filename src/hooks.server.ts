import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { CLIENTAUTHINFO, verifySession } from "$lib/utils";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.user = null;
  const signedSession = event.cookies.get(CLIENTAUTHINFO) ?? null;
  if (signedSession) {
    try {
      const userData = verifySession(signedSession) as App.Locals['user'];
      if (userData) { 
        event.locals.user = userData;
      } else {
        throw null;
      }
    } catch {
      event.cookies.delete(CLIENTAUTHINFO, { path: '/' });
      throw redirect(302, '/');
    }
  }
  return await resolve(event);
}
