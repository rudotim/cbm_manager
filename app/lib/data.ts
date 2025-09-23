import postgres from "postgres";
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoice,
  LatestInvoiceRaw,
  Revenue,
} from "./definitions";
import { formatCurrency } from "./utils";

//const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
import mysql from "mysql2/promise";

const sql = await mysql.createConnection({
  host: process.env.MYSQL_URL!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
});

export async function fetchRevenue(): Promise<Revenue[]> {
  try {
    const data = await //sql.execute(<Revenue[]>`SELECT * FROM invoice_history`)
    //sql.query<Revenue[]>(`SELECT * FROM invoice_history limit 10`);
    sql.query<Revenue[]>(
      `
select YEAR(Date) as "Date", sum(Amount) as "Amount", count(*) from new_invoice_history
WHERE Date is not NULL
group by Year(Date)
order by Date desc
limit 10
      `
    );

    console.log("fetchRevenue fetch completed after 3 seconds:");

    return data[0].reverse();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice_history data.");
  }
}

export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
  console.log("fetchLatestInvoices fetch completed after 3 seconds:");

  try {
    const data = await sql.query<LatestInvoice[]>(`
      SELECT
	i.amount,
	m.FirstName,	
	m.email,
  "/profile.jpg" as image_url,
	i.invoice_id
FROM
	invoices i
JOIN membership m ON
	i.MembershipID = m.MembershipID
ORDER BY
	i.date DESC
LIMIT 5      
    `);
    const latestInvoices = data[0].map((invoice) => ({
      ...invoice,
      amount: formatCurrency(Number(invoice.amount)),
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  console.log("fetchCardData fetch completed after 3 seconds:");

  try {
    const customerCountPromise = await sql.query(
      `SELECT COUNT(*) as "count" FROM membership`
    );
    const invoiceStatusPromise = await sql.query(`
      select count(*) as "count", (sum(Amount) - sum(Payment))/100 as "pending", sum(Payment) as "paid"
      FROM invoices
    `);

    const data = await Promise.all([
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfCustomers = Number((data[0][0] as any)[0].count ?? 0);
    const numberOfInvoices = Number((data[1][0] as any)[0].count ?? 0);
    const totalPaidInvoices = formatCurrency((data[1][0] as any)[0].paid ?? 0);
    const totalPendingInvoices = formatCurrency(
      (data[1][0] as any)[0].pending ?? 0
    );

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql.query<InvoicesTable[]>(`
      select 
      inv.invoice_id as "id",
      inv.MembershipID as "customer_id", 
        inv.Amount as "amount",
        inv.Date as "date",
        "paid" as "status",
        m.FirstName as "name",
        m.Email as "email",
        "/profile.jpg" as "image_url"
      FROM invoices inv
      LEFT JOIN membership m
      ON m.MembershipID = inv.MembershipID
      WHERE 
        m.FirstName like "${`%${query}%`}" OR
        m.email like "${`%${query}%`}"
      ORDER BY inv.Date DESC
        limit ${ITEMS_PER_PAGE} OFFSET ${offset}
    `);

    /*
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    */

    return invoices[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql.query(`
      select count(*) as 'count'
      FROM invoices inv
      LEFT JOIN membership m
      ON m.MembershipID = inv.MembershipID
      WHERE 
        m.FirstName like "${`%${query}%`}" OR
        m.email like "${`%${query}%`}"
  `);

    return Math.ceil(Number((data[0] as any)[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql.query<InvoiceForm[]>(`
      SELECT
        invoice_id as "id",
        MembershipID as "customer_id",
        Amount as "amount",
        Description as "status"
      FROM invoices
      WHERE invoice_id = "${id}";
    `);

    const invoice = data[0].map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchCustomers() {
  //const customers = await sql<CustomerField[]>`
  try {
    const customers = await sql.query<CustomerField[]>(`
      SELECT
        MembershipID as "id",
        CONCAT(LastName, ', ', FirstName) as "name"
      FROM membership
      ORDER BY LastName ASC
    `);

    return customers[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}
