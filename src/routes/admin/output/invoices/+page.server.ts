import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDateTime } from '$lib/utils';

type Data = {
  invoice_id: number;
  user_id: number;
  items: { count: number, garment: string, price: number, delivered: boolean }[];
  pay: number;
};

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user || locals.user.profile !== 'A') { throw redirect(303, '/'); }
  const landryId = locals.user.laundry_id;
  const code = url.searchParams.get('code');
  const userId = url.searchParams.get('userId') ?? '0';
  const invoiceId = url.searchParams.get('invoiceId') ?? '0';

  try {

    const db = platform?.env.DB;
    if (!db) {
      throw 'DB: servicio no disponible';
    }
    
    const profile = 'U';
    const response = await db.prepare('SELECT user_id, name FROM users WHERE laundry_id = ? AND user_id = ? AND profile = ?').bind(landryId, userId, profile).first();
    const customer = response === null ? {user_id: null, name: null} : response;

    const invoicesRaw = await db.prepare('SELECT * FROM invoices WHERE invoice_id = ? AND laundry_id = ? AND user_id = ?').bind(invoiceId, landryId, userId).all();
    const invoice = invoicesRaw.results.map((row: any) => ({
      ...row,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items
    }))[0];
    return { 
      customer,
      invoice,
      invoiceId,
      code
    };

  } catch (error) {
    return fail(500, {
      error,
    });
  }
};

export const actions: Actions = {
  save: async ({ request, locals, platform }) => {

    try {
      if (!locals.user || locals.user.profile !== 'A') { 
        throw 'Exit';
      }

      const adminId = locals.user.user_id;
      const laundryId = locals.user.laundry_id;

      const db = platform?.env.DB;
      if (!db) {
        throw 'DB: servicio no disponible';
      }

      const data: Data = await request.json();
      const userId = data.user_id;
      const invoiceId = data.invoice_id;
      const items = JSON.stringify(data.items);
      const pay = data.pay;
      const exitDate = getDateTime();

      const query_numbering = `UPDATE invoices SET items = ?, pay = ? WHERE laundry_id = ? AND invoice_id = ? AND user_id = ?`;
      await db.prepare(query_numbering).bind(items, pay, laundryId, invoiceId, userId).run();

      const query_user = 'INSERT INTO departures (laundry_id, invoice_id, admin_id, exit_at) VALUES (?, ?, ?, ?)';
      await db.prepare(query_user).bind(laundryId, invoiceId, adminId, exitDate).run();

      return { 
        save: true
      };

    } catch (error) {
      return fail(500, {
        message: error
      });
    }

  }
}
