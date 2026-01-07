import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import { signSession, CLIENTAUTHINFO, SESSION_CONFIG } from '$lib/utils';

const Profile = {'A': '/admin', 'U': '/user'};

type User = {
  laundry_id: number;
  user_id: number;
  name: string;
  phone: string;
  profile: 'A' | 'U';
}

export const actions: Actions = {
  default: async ({ request, platform, cookies }) => {
    let user: User | null;
    try {
      const db = platform?.env.DB;
      if (!db) {
        throw 'DB: servicio no disponible';
      }
      const formData = await request.formData();
      const code = formData.get('code');
      user = await db.prepare('SELECT * FROM users WHERE password = ?').bind(code).first();
      if (!user) {
        throw 'Código incorrecto';
      }

      // Crear sesión
      const sessionUser: User = {
        laundry_id: user.laundry_id,
        user_id: user.user_id,
        name: user.name,
        phone: user.phone,
        profile: user.profile,
      };

      const signedSession = signSession(sessionUser);
      cookies.set(CLIENTAUTHINFO, signedSession, SESSION_CONFIG);

    } catch (error) {
      return fail(500, {
        error,
      });
    }
    // ====== REDIRECCIONAR SEGÚN PERFIL ======
    const redirectPath: string = Profile[user.profile];
    throw redirect(303, redirectPath);
  }
}
