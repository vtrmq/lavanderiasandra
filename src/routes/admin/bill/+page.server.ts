import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDateTime } from '$lib/utils';

type Data = {
  numeration_id: number;
  numeration: number;
  user_id: number | null;
  name: string;
  code: string;
  items: { count: number, garment: string, price: number, delivered: boolean }[];
  number_garment: number;
  price: number;
  pay: number;
};

type Numeration = {numeration_id: number | null; invoice_number: number};

export const load: PageServerLoad = async ({ locals, platform }) => {
  if (!locals.user || locals.user.profile !== 'A') { throw redirect(303, '/'); }
  const db = platform?.env.DB;
  if (!db) {
    throw redirect(303, '/');
  }
};

export const actions: Actions = {
	search: async ({ locals, request, platform }) => {

    try {

      if (!locals.user || locals.user.profile !== 'A') { 
        throw 'Exit';
      }
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

      return { 
        customer
      };

    } catch (error) {
      return fail(500, {
        error,
      });
    }
  },

  save: async ({ request, locals, platform }) => {

    try {

      if (!locals.user || locals.user.profile !== 'A') { 
        throw 'Exit';
      }
      const adminId = locals.user.user_id;
      const laundryId = locals.user.laundry_id;

      const db = platform?.env.DB;
      if (!db) {
        throw 'Exit';
      }

      const data: Data = await request.json();

      let userId = data.user_id;
      const code = data.code;
      const phone = Number(code);
      const password = String(code);
      const name = data.name;
      const items = JSON.stringify(data.items);
      const number_garment = data.number_garment;
      const price = data.price;
      const pay = data.pay;
      const create_at = getDateTime();

      const result = await db.prepare('SELECT numeration_id, invoice_number FROM numbering WHERE laundry_id = ?').bind(laundryId).first() as Numeration | null;
      const numeration: Numeration = result ?? { numeration_id: null, invoice_number: 0 };

      if (userId === null) {
        const response = await db.prepare('SELECT user_id, name FROM users WHERE laundry_id = ? AND password = ?').bind(laundryId, password).first();
        const customer = response === null ? {user_id: null, name: null} : response;

        if (customer.user_id === null) {
          const query_user = 'INSERT INTO users (laundry_id, admin_id, name, phone, password, profile, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
          const result_user = await db.prepare(query_user).bind(laundryId, adminId, name, phone, password, 'U', create_at).run();
          userId = result_user.meta.last_row_id;
        } else {
          userId = customer.user_id as number;
        }
      }

      const numerationInvoice = numeration.invoice_number + 1;
      const query_invoice = 'INSERT INTO invoices (laundry_id, admin_id, user_id, invoice_number, items, garment_number, price, pay, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      await db.prepare(query_invoice).bind(laundryId, adminId, userId, numerationInvoice, items, number_garment, price, pay, create_at).run();

      if (result === null) {
        const query_invoice = 'INSERT INTO numbering (laundry_id, invoice_number) VALUES (?, ?)';
        await db.prepare(query_invoice).bind(laundryId, numerationInvoice).run();
      } else {
        const query_numbering = 'UPDATE numbering SET invoice_number = ? WHERE laundry_id = ?';
        await db.prepare(query_numbering).bind(numerationInvoice, laundryId).run();
      }

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
