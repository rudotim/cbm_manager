import sql from "./db";
import { MemberInvoiceForm } from "@/app/lib/definitions";

export async function fetchMembershipReport() {
  try {
    const data = await sql.query<MemberInvoiceForm[]>(`SELECT
      membership_id as id,
      first_name, last_name
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

export async function fetchMembershipInvoices() {
  try {
    const data = await sql.query<MemberInvoiceForm[]>(`SELECT
      m.membership_id as id,
      m.first_name, m.last_name, m.membership_type,
      m.mailing_street, m.mailing_city, m.mailing_state, m.mailing_zip,
      d.slip, d.shore_power, d.t_slip
      FROM membership m
      LEFT JOIN dock d
      ON m.membership_id = d.membership_id
      WHERE LOWER(m.status) = "active"
      ORDER BY m.last_name asc
      limit 3
  `);

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch member invoices for report");
  }
}
