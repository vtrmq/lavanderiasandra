import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type Item = {
  count: number;
  garment: string;
  price: number;
};

type Invoice = {
  invoice_id?: number;
  admin_id?: number;
  user_id?: number;
  invoice_number?: number;
  items: Item[];            // 👈 ya parseado en el server
  garment_number?: number;
  price?: number;
  created_at?: string;
};

export const load: PageServerLoad = async ({ locals, platform }) => {

  if (!locals.user || locals.user.profile !== 'U') { throw redirect(303, '/'); }

  const userId = locals.user.user_id;
  const laundryId = locals.user.laundry_id ?? '0';

  try {

    const db = platform?.env.DB;
    if (!db) {
      throw 'DB: servicio no disponible';
    }

    const profile = 'U';
    const response = await db.prepare('SELECT user_id, name FROM users WHERE user_id = ? AND laundry_id = ? AND profile = ?')
      .bind(userId, laundryId, profile).first();

    const customer = response === null ? {user_id: null, name: null} : response;
    const invoicesRaw = await db.prepare('SELECT * FROM invoices WHERE laundry_id = ? AND user_id = ?').bind(laundryId, userId).all();
    const invoices: Invoice[] = invoicesRaw.results.map((inv: any) => ({
      ...inv,
      items: inv.items ? JSON.parse(inv.items) : []
    }));

    return { 
      customer,
      invoices,
    };

  } catch (error) {
    return fail(500, {
      error,
    });
  }
};
