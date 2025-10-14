import postgres from "postgres";
import {
  CustomerField,
  CustomerForm,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoice,
  LatestInvoiceRaw,
  DockTableType,
  Revenue,
  PropertyTableType,
  MemberProperty,
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

// Potentially use a pool
// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10, // Adjust this based on your max_user_connections
//     queueLimit: 0
//   });

//  export async function query(sql, params) {
//       const [rows] = await pool.execute(sql, params);
//       return rows;
//     }

export async function fetchRevenue(): Promise<Revenue[]> {
  try {
    const data = await //sql.execute(<Revenue[]>`SELECT * FROM invoice_history`)
    //sql.query<Revenue[]>(`SELECT * FROM invoice_history limit 10`);
    sql.query<Revenue[]>(
      `
select YEAR(date) as "Date", sum(amount) as "Amount", count(*) from invoice_history
WHERE date is not NULL
group by Year(date)
order by date desc
limit 10
      `
    );

    console.log("[dashboard]fetchRevenue fetch completed after 3 seconds:");

    return data[0].reverse();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice_history data.");
  }
}

export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
  console.log(
    "[dashboard]fetchLatestInvoices fetch completed after 3 seconds:"
  );

  try {
    const data = await sql.query<LatestInvoice[]>(`
      SELECT
	inv.amount,
  inv.payment,
  inv.description,
  CASE WHEN inv.payment - inv.amount = inv.payment THEN
    inv.payment
  WHEN inv.payment - ABS(inv.amount) < 0 THEN	
	  ABS(inv.payment - inv.amount)
  WHEN inv.payment - ABS(inv.amount) = 0 THEN	  
      inv.payment
  END as "final",
  CASE WHEN inv.payment - inv.amount = inv.payment THEN
    "paid_to"
  WHEN inv.payment - ABS(inv.amount) < 0 THEN
    "owed" 
  ELSE
      "paid"
  END as "status",  
	concat(m.first_name, " ", m.last_name) as name,	
  "/profile.jpg" as image_url,
	inv.id
FROM
	invoices inv
JOIN membership m ON
	inv.membership_id = m.membership_id
ORDER BY
	inv.date DESC
LIMIT 5      
    `);
    const latestInvoices = data[0].map((invoice) => ({
      ...invoice,
      final: formatCurrency(Number(invoice.final)),
      //payment: formatCurrency(Number(invoice.payment)),
    }));
    return latestInvoices;
    //return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  console.log("[dashboard]fetchCardData fetch completed after 3 seconds:");

  try {
    const customerCountPromise = await sql.query(
      `SELECT COUNT(*) as "count" FROM membership
      WHERE lower(status) = "active";`
    );
    const invoiceStatusPromise = await sql.query(`SELECT 
      count(*) as "count", 
      sum(p.pending) as "pending", 
      sum(p.paid) as "paid"
      FROM (
        SELECT 
        (sum(amount) - sum(payment)) as "pending", 
        sum(payment) as "paid"
        FROM invoices
        GROUP BY membership_id
      ) p;
    `);

    const data = await Promise.all([
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfCustomers = Number((data[0][0] as any)[0].count ?? 0);
    const numberOfInvoices = Number((data[1][0] as any)[0].count ?? 0);
    const totalPaidInvoices = formatCurrency(
      Number((data[1][0] as any)[0].paid ?? 0)
    );
    const totalPendingInvoices = formatCurrency(
      Number((data[1][0] as any)[0].pending ?? 0)
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

  console.log("[invoices] fetchFilteredInvoices");

  try {
    const data = await sql.query<InvoicesTable[]>(`
      select 
      inv.id as "id",
      inv.membership_id as "customer_id", 
        inv.amount,
        inv.payment,
        inv.description,
  CASE WHEN inv.payment - inv.amount = inv.payment THEN
    inv.payment
  WHEN inv.payment - ABS(inv.amount) < 0 THEN	
	  ABS(inv.payment - inv.amount)
  WHEN inv.payment - ABS(inv.amount) = 0 THEN	  
      inv.payment
  END as "final",
  CASE WHEN inv.payment - inv.amount = inv.payment THEN
    "paid_to"
  WHEN inv.payment - ABS(inv.amount) < 0 THEN
    "owed" 
  ELSE
      "paid"
  END as "status",        
        inv.date as "date",        
        concat(m.first_name, ' ', m.last_name) as "name",
        m.email as "email",
        "/profile.jpg" as "image_url"
      FROM invoices inv
      LEFT JOIN membership m
      ON m.membership_id = inv.membership_id
      WHERE 
        m.first_name like "${`%${query}%`}" OR
        m.last_name like "${`%${query}%`}" OR
        m.email like "${`%${query}%`}"
      ORDER BY inv.date DESC
        limit ${ITEMS_PER_PAGE} OFFSET ${offset}
    `);

    const invoices = data[0].map((invoice) => ({
      ...invoice,
      final: formatCurrency(Number(invoice.final)),
    }));

    return invoices;
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
      ON m.membership_id = inv.membership_id
      WHERE 
        m.first_name like "${`%${query}%`}" OR
        m.email like "${`%${query}%`}"
  `);

    console.log("[invoices] fetchInvoicePages");

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
        id as "id",
        membership_id as "customer_id",
        amount as "amount",
        description as "status"
      FROM invoices
      WHERE id = "${id}";
    `);

    console.log("[invoices] fetchInvoiceById");

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

export async function fetchMemberPropertiesByMemberId(id: string) {
  try {
    const data = await sql.query<MemberProperty[]>(`
      SELECT
        p.id,
        p.property_address,
        p.owner_name,
        p.owner_address,
        p.owner_city,
        p.owner_zip,
        p.owner_state,
        p.owner_phone,
        p.notes        
      FROM properties p
      INNER JOIN membership m ON
      m.property_id = p.id
      WHERE
      m.membership_id = "${id}";
    `);

    console.log("[properties] fetchMemberPropertyById");

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch member property record");
  }
}

export async function fetchMemberById(id: string) {
  try {
    const data = await sql.query<MemberForm>(`
      SELECT
        membership_id as "id",
        first_name,
        last_name,
        email,
        cell_phone,
        cape_phone,
        membership_type,
        status,
        mailing_street,
        mailing_street2,
        mailing_city,
        mailing_zip
        
      FROM membership
      WHERE membership_id = "${id}";
    `);

    console.log("[members] fetchCustomerById");

    return data[0][0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch member record");
  }
}

// Verify that this is called
export async function fetchCustomers() {
  try {
    const customers = await sql.query<CustomerField[]>(`
      SELECT
        membership_id as "id",
        CONCAT(last_name, ', ', first_name) as "name"
      FROM membership
      ORDER BY last_name ASC
    `);

    console.log("[membership] Fetching membership data");

    return customers[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql.query<CustomersTableType[]>(`
SELECT
  m.membership_id as "id",
  concat(m.first_name, " ", m.last_name) as "name",
  COUNT(i.membership_id) AS total_invoices,
  m.membership_type,
  IFNULL(d.slip_number, 0) as "slip_number",
  SUM(CASE WHEN i.description = 'pending' THEN i.amount ELSE 0 END) AS total_pending,
  SUM(CASE WHEN i.description = 'paid' THEN i.amount ELSE 0 END) AS total_paid
FROM membership m
LEFT JOIN invoices i ON m.membership_id = i.membership_id
LEFT JOIN dock d on m.membership_id = d.membership_id
WHERE
  m.first_name LIKE "${`%${query}%`}" OR
  m.last_name LIKE "${`%${query}%`}" OR
  m.email LIKE "${`%${query}%`}"
  GROUP BY m.membership_id
ORDER BY m.first_name ASC
limit ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `);

    console.log("[membership] Fetching filtered member data");

    const customers = data[0].map((customer) => ({
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

export async function fetchCustomerPages(query: string) {
  try {
    const data = await sql.query(`
select count(*) as "count"
      FROM membership m
      WHERE 
        m.first_name like "${`%${query}%`}" OR
        m.last_name like "${`%${query}%`}" OR
        m.email like "${`%${query}%`}"
  `);

    console.log(
      "[membership] fetching membership page count for pagination:",
      (data[0] as any)[0].count
    );
    return Math.ceil(Number((data[0] as any)[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchDockTableData(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql.query<DockTableType[]>(`SELECT 
      d.dock_id as "id", 
      d.slip_number, 
      concat(m.first_name, " ", m.last_name) as "name",
      "2025" as year,
      d.boat_size, 
      d.owed, 
      d.balance 
    FROM membership m
    INNER join dock d ON 
      d.membership_id = m.membership_id
    ORDER BY d.slip_number asc
    limit ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `);

    const dock_records = data[0].map((dock_record) => ({
      ...dock_record,
      owed: formatCurrency(dock_record.owed),
      balance: formatCurrency(dock_record.balance),
    }));

    console.log("[dock] Fetching dock table data");

    return dock_records;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch dock table.");
  }
}

export async function fetchDockPages(query: string) {
  try {
    const data = await sql.query(`SELECT
      count(*) as "count"
      FROM dock d
      INNER JOIN membership m
      ON m.membership_id = d.membership_id
  `);

    console.log("[dock] fetching dock page count for pagination");
    return Math.ceil(Number((data[0] as any)[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchPropertyById(id: string) {
  try {
    const data = await sql.query<MemberProperty>(`
      SELECT
        p.id,
        p.property_address,
        p.owner_name,
        p.owner_address,
        p.owner_city,
        p.owner_zip,
        p.owner_state,
        p.owner_phone,
        p.notes        
      FROM properties p
      WHERE
      p.id = "${id}";
    `);

    console.log("[properties] fetchPropertyById");

    return data[0][0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch member record");
  }
}

export async function fetchPropertyPages(query: string) {
  try {
    const data = await sql.query(`
select count(*) as "count"
      FROM properties p
      WHERE 
        p.owner_address like "${`%${query}%`}" OR
        p.owner_name like "${`%${query}%`}"
      ORDER BY p.property_address
  `);

    console.log(
      "[properties] fetching property page count for pagination:",
      data[0][0].count
    );
    return Math.ceil(Number((data[0] as any)[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchFilteredProperties(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql.query<PropertyTableType[]>(`SELECT 
        p.id,
        p.property_address,
        p.owner_name
      FROM properties p

      WHERE 
        p.property_address like "${`%${query}%`}" OR
        p.owner_name like "${`%${query}%`}"
      ORDER BY p.property_address
            limit ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `);

    // const data = await sql.query<PropertyTableType[]>(`SELECT
    //   d.dock_id as "id",
    //   d.slip_number,
    //   concat(m.first_name, " ", m.last_name) as "name",
    //   "2025" as year,
    //   d.boat_size,
    //   d.owed,
    //   d.balance
    // FROM membership m
    // INNER join dock d ON
    //   d.membership_id = m.membership_id
    // ORDER BY d.slip_number asc
    // limit ${ITEMS_PER_PAGE} OFFSET ${offset}
    // `);

    // const dock_records = data[0].map((dock_record) => ({
    //   ...dock_record,
    //   owed: formatCurrency(dock_record.owed),
    //   balance: formatCurrency(dock_record.balance),
    // }));

    console.log("[properties] Fetching properties filtered table data");

    return data[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch dock table.");
  }
}
