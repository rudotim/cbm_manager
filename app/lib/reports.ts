import sql from "./db";
import { MemberInvoiceForm } from "@/app/lib/definitions";

export async function fetchMembershipReport() {
  try {
    const data = await sql.query<MemberInvoiceForm[]>(`SELECT
      membership_id as id,
      first_name, last_name, 
      mailing_street, mailing_city, mailing_state, mailing_zip,
      email, membership_type, senior_status
      FROM membership m
      WHERE LOWER(status) = "active"
      ORDER BY last_name asc
  `);

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch members for report");
  }
}

export async function fetchMembershipInvoices(limit: number = 0) {
  const limitStr = limit > 0 ? `limit ${limit}` : "";

  try {
    const data = await sql.query<MemberInvoiceForm[]>(`SELECT
      m.membership_id as id,
      m.first_name, m.last_name, m.membership_type,
      m.mailing_street, m.mailing_city, m.mailing_state, m.mailing_zip,
      d.slip_number, d.slip, d.shore_power, d.t_slip
      FROM membership m
      LEFT JOIN dock d
      ON m.membership_id = d.membership_id
      WHERE LOWER(m.status) = "active"      
      ORDER BY m.last_name asc
      ${limitStr}
  `);

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch member invoices for report");
  }
}

export async function fetchInvoicesByOwedPaid(
  limit: number = 0,
  year: string = "",
  paid: boolean = true,
) {
  const limitStr = limit > 0 ? `limit ${limit}` : "";
  const paidStr = paid
    ? " inv.payment >= inv.amount "
    : " (inv.payment < inv.amount OR IFNULL(inv.payment,0) = 0)";
  const yearStr = year;

  try {
    const data = await sql.query<MemberInvoiceForm[]>(`
    SELECT
	  inv.id as invoice_id,
      m.membership_id as customerId,
      m.first_name, m.last_name, m.membership_type,
      m.mailing_street, m.mailing_city, m.mailing_state, m.mailing_zip,
      inv.num_badges,
      inv.dock_slip,
      inv.amount,
      inv.payment,
	    YEAR(inv.date) as year
      FROM 
      	invoices inv
      INNER JOIN 
	    membership m
        ON inv.membership_id = m.membership_id
      WHERE YEAR(inv.date) = ${yearStr}
      AND ${paidStr}
      ${limitStr}
  `);

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch member invoices for report");
  }
}
