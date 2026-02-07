import {
  CustomerField,
  MemberForm,
  CustomersTableType,
  InvoiceForm,
  MemberInvoiceForm,
  InvoicesTable,
  LatestInvoice,
  LatestInvoiceRaw,
  DockTableType,
  Revenue,
  PropertyTableType,
  MemberProperty,
  SettingsData,
} from "./definitions";
import { formatCurrency, formatDateToShort, numToWords } from "./utils";
import sql from "./db";

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
      `,
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
    "[dashboard]fetchLatestInvoices fetch completed after 3 seconds:",
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
      WHERE lower(status) = "active";`,
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
      Number((data[1][0] as any)[0].paid ?? 0),
    );
    const totalPendingInvoices = formatCurrency(
      Number((data[1][0] as any)[0].pending ?? 0),
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

const ITEMS_PER_PAGE = 15;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
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
        YEAR(inv.date) as year,
  CASE WHEN inv.payment - inv.amount = inv.payment THEN
    inv.payment
  WHEN inv.payment - ABS(inv.amount) < 0 THEN	
	  ABS(inv.payment - inv.amount)
  WHEN inv.payment - ABS(inv.amount) = 0 THEN	  
      inv.payment
  END as "final",
  CASE WHEN inv.payment - inv.amount = inv.payment THEN
    "paid_to"
  WHEN (inv.payment - ABS(inv.amount) < 0) 
    OR (IFNULL(inv.payment,0) = 0 
        AND IFNULL(inv.amount,0) = 0) THEN
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
        YEAR(inv.date) like "${`%${query}%`}"
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
        m.last_name like "${`%${query}%`}" OR
        YEAR(inv.date) like "${`%${query}%`}"
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
	  YEAR(inv.date) as year,
      d.slip_number, d.slip, d.shore_power, d.t_slip
      FROM 
      	invoices inv
      INNER JOIN 
	    membership m
        ON inv.membership_id = m.membership_id
      LEFT JOIN 
        dock d
        ON m.membership_id = d.membership_id
      WHERE inv.id = "${id}";
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
    const data = await sql.query<MemberForm[]>(`
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
        mailing_city,
        mailing_state,
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
  currentPage: number,
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
  m.last_name LIKE "${`%${query}%`}"
  GROUP BY m.membership_id, 
  	m.first_name, 
    m.last_name,
	  m.membership_type,
	  d.slip_number
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
        m.last_name like "${`%${query}%`}"
  `);

    console.log(
      "[membership] fetching membership page count for pagination:",
      (data[0] as any)[0].count,
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
      YEAR(d.date) as year,
      d.boat_size, 
      d.shore_power,
      d.t_slip
    FROM membership m
    INNER join dock d ON 
      d.membership_id = m.membership_id
    WHERE 
      m.first_name like "${`%${query}%`}" OR
      m.last_name like "${`%${query}%`}" OR    
      YEAR(d.date) like "${`%${query}%`}"      
    ORDER BY d.slip_number asc
    limit ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `);

    const dock_records = data[0].map((dock_record) => ({
      ...dock_record,
      shore_power: dock_record.shore_power === 0 ? "-" : "Yes",
      t_slip: dock_record.t_slip === 0 ? "-" : "Yes",
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
      WHERE 
        m.first_name like "${`%${query}%`}" OR
        m.last_name like "${`%${query}%`}" OR    
        YEAR(d.date) like "${`%${query}%`}"  
  `);

    console.log("[dock] fetching dock page count for pagination");
    return Math.ceil(Number((data[0] as any)[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchDockById(id: string) {
  try {
    const data = await sql.query<DockTableType[]>(`
     SELECT 
      d.dock_id as "id", 
      d.slip_number, 
      concat(m.first_name, " ", m.last_name) as "name",
      YEAR(d.date) as year,
      d.boat_size, 
      d.shore_power,
      d.t_slip,
      m.membership_id
    FROM membership m
    INNER join dock d ON 
      d.membership_id = m.membership_id    
      WHERE dock_id = "${id}";
    `);

    //console.log("[dock] fetchDockById:", data[0]);

    return data[0][0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch dock record by id " + id);
  }
}

export async function fetchDockByMembershipId(id: string) {
  try {
    const data = await sql.query<DockTableType[]>(`
     SELECT 
      d.dock_id as "id", 
      d.slip_number, 
      concat(m.first_name, " ", m.last_name) as "name",
      YEAR(d.date) as year,
      d.boat_size, 
      d.shore_power,
      d.t_slip,
      m.membership_id
    FROM membership m
    INNER join dock d ON 
      d.membership_id = m.membership_id    
      WHERE d.membership_id = "${id}";
    `);

    //console.log("[dock] fetchDockByMembershipId:", data[0]);

    //return all ? data[0] : data[0][0];
    return data[0] as DockTableType[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch dock record by id " + id);
  }
}

export async function fetchPropertyById(id: string) {
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
        p.owner_phone 
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

    let count = Number((data[0] as any)[0].count);
    console.log(
      "[properties] fetching property page count for pagination:",
      count,
    );
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchFilteredProperties(
  query: string,
  currentPage: number,
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

    console.log("[properties] Fetching properties filtered table data");

    return data[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch dock table.");
  }
}

export async function fetchSettings(
  formatDateFunc: Function = formatDateToShort,
) {
  try {
    const data = await sql.query<SettingsData[]>(`SELECT 
        year,
        membership_fee,
        extra_badge_fee,
        visionary_fund_fee,
        shore_power_fee,
        t_slip_fee,
        early_payment_discount,
        max_badges,
        date_of_invoice,
        invoice_due_date,
        early_payment_due_date,
        no_boats_before_date
      FROM settings s
	  `);

    const latestInvoices = data[0].map((invoice) => ({
      ...invoice,
      date_of_invoice: formatDateFunc(invoice.date_of_invoice),
      invoice_due_date: formatDateFunc(invoice.invoice_due_date),
      early_payment_due_date: formatDateFunc(invoice.early_payment_due_date),
      no_boats_before_date: formatDateFunc(invoice.no_boats_before_date),
      max_badges_str: numToWords(invoice.max_badges),
    }));

    //console.log("[settings] Fetching settings table data:", latestInvoices);

    return latestInvoices[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch settings data");
  }
}
