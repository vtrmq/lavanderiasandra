import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user || locals.user.profile !== 'A') { throw redirect(303, '/'); }

  const laundryId = locals.user.laundry_id ?? 0;
  const userId = url.searchParams.get('userId') ?? 0;
  const invoiceId = url.searchParams.get('invoiceId') ?? 0;
  const page = Number(url.searchParams.get("page") ?? 1);

  try {

    const db = platform?.env.DB;
    if (!db) {
      throw 'DB: servicio no disponible';
    }

    const response = await db.prepare('SELECT user_id, name FROM users WHERE user_id = ? AND laundry_id = ?').bind(userId, laundryId).first();
    const customer = response === null ? {user_id: null, name: null} : response;

    const invoicesRaw = await db.prepare('SELECT * FROM invoices WHERE invoice_id = ? AND laundry_id = ? AND user_id = ?').bind(invoiceId, laundryId, userId).all();
    const invoice = invoicesRaw.results.map((row: any) => ({
      ...row,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items
    }))[0];

    return { 
      customer,
      invoice,
      invoiceId,
      page
    };

  } catch (error) {
    return fail(500, {
      error,
    });
  }
};
