import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

type Item = { count: number; garment: string; price: number };

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

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user || locals.user.profile !== 'A') { throw redirect(303, '/'); }
  const laundryId = locals.user.laundry_id ?? '0';
  const code = url.searchParams.get('code') ?? '0';

  try {

    const db = platform?.env.DB;
    if (!db) {
      throw 'DB: servicio no disponible';
    }

    const profile = 'U';
    const response = await db.prepare('SELECT user_id, name FROM users WHERE laundry_id = ? AND password = ? AND profile = ?').bind(laundryId, code, profile).first();
    const customer = response === null ? {user_id: null, name: null} : response;
    const userId = customer.user_id;
    const invoicesRaw = await db.prepare('SELECT * FROM invoices WHERE user_id = ?').bind(userId).all();
    const invoices: Invoice[] = invoicesRaw.results.map((inv: any) => ({
      ...inv,
      items: inv.items ? JSON.parse(inv.items) : []
    }));

    return { 
      customer,
      invoices,
      code
    };

  } catch (error) {
    return fail(500, {
      error,
    });
  }
};

export const actions: Actions = {
	search: async ({ locals, request, platform }) => {

    try {

      if (!locals.user || locals.user.profile !== 'A') { 
        throw 'Exit'; 
      }

      //const adminId = locals.user.user_id;
      const laundryId = locals.user.laundry_id;
      const db = platform?.env.DB;
      if (!db) {
        throw 'DB: servicio no disponible';
      }

      const formData = await request.formData();
      let code = formData.get('code_customer') as string;
      code = code.replace(/\s/g, '');
      const profile = 'U';
      const response = await db.prepare('SELECT user_id, name FROM users WHERE laundry_id = ? AND password = ? AND profile = ?').bind(laundryId, code, profile).first();
      const customer = response === null ? {user_id: null, name: null} : response;
      const userId = customer.user_id;
      const invoicesRaw = await db.prepare('SELECT * FROM invoices WHERE user_id = ?').bind(userId).all();
      const invoices: Invoice[] = invoicesRaw.results.map((inv: any) => ({
        ...inv,
        items: inv.items ? JSON.parse(inv.items) : []
      }));

      return { 
        customer,
        invoices
      };

    } catch (error) {
      return fail(500, {
        error,
      });
    }
  },
}
