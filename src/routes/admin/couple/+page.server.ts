import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, platform }) => {

  if (!locals.user || locals.user.profile !== 'A') { throw redirect(303, '/'); }

  const laundryId = locals.user.laundry_id ?? 0;
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = 60;
  const offset = (page - 1) * limit;

  try {

    const db = platform?.env.DB;
    if (!db) {
      throw 'DB: servicio no disponible';
    }

    const totalsQuery = `SELECT COUNT(p.invoice_id) AS total_count FROM invoices p WHERE p.laundry_id = ?`;

    type Totals = { total_count: number; } | null;
    const stmtPage = db.prepare(totalsQuery);
    const totals: Totals = await stmtPage.bind(laundryId).first();
    const totalCount = totals?.total_count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    const stmt = db.prepare(`
      SELECT
        i.invoice_id,
        i.laundry_id,
        i.admin_id,
        i.user_id,
        i.invoice_number,
        i.garment_number,
        i.price,
        i.pay,
        i.visible,
        i.created_at,

        u.name  AS user_name,
        u.phone AS user_phone

      FROM invoices AS i
        JOIN users AS u
        ON u.user_id = i.user_id

      WHERE i.laundry_id = ?
      ORDER BY i.created_at DESC LIMIT ? OFFSET ?;`);

    const invoices = (await stmt.bind(laundryId, limit, offset).all()).results; //  as Invoice[]

    return {
      invoices,
      pagination: {
        page,
        totalPages,
        limit,
        totalCount
      }
    };

  } catch (error) {

    return fail(500, {
      error,
    });

  }
};
