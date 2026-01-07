import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user || locals.user.profile !== 'U') { throw redirect(303, '/'); }
  const landryId = locals.user.laundry_id;
  const userId = url.searchParams.get('userId') ?? '0';
  const invoiceId = url.searchParams.get('invoiceId') ?? '0';

  const db = platform?.env.DB;
  if (!db) {
    throw redirect(303, '/');
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
  };

};
