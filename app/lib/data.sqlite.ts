import {
  CustomerField,
  MemberForm,
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
import { formatCurrency, formatDateToShort, numToWords } from "./utils";
import sql from "./db";

export async function fetchRevenue(): Promise<Revenue[]> {
  try {
    const data: Revenue[] = await sql
      .prepare(
        `
select strftime('%Y', date) as "Date", 
sum(amount) as "Amount", 
count(*) from invoice_history
WHERE date is not NULL
group by strftime('%Y', date)
order by date desc
limit 10
      `
      )
      .all();

    console.log("[dashboard]fetchRevenue fetch completed after 3 seconds:");

    return data.reverse();
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
    const data: LatestInvoice[] = await sql
      .prepare(
        `
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
  END as 'final',
  CASE WHEN inv.payment - inv.amount = inv.payment THEN
    'paid_to'
  WHEN inv.payment - ABS(inv.amount) < 0 THEN
    'owed' 
  ELSE
      'paid'
  END as "status",  
	concat(m.first_name, ' ', m.last_name) as name,	
  '/profile.jpg' as image_url,
	inv.id
FROM
	invoices inv
JOIN membership m ON
	inv.membership_id = m.membership_id
ORDER BY
	inv.date DESC
LIMIT 5      
    `
      )
      .all();
    const latestInvoices = data.map((invoice: LatestInvoice) => ({
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
    const customerCountPromise = sql
      .prepare(
        `SELECT COUNT(*) as "count" FROM membership
      WHERE lower(status) = ?;`
      )
      .bind("active")
      .all();
    const invoiceStatusPromise = await sql
      .prepare(
        `SELECT 
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
    `
      )
      .all();

    const data = await Promise.all([
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfCustomers = Number((data[0] as any)[0].count ?? 0);
    const numberOfInvoices = Number((data[1] as any)[0].count ?? 0);
    const totalPaidInvoices = formatCurrency(
      Number((data[1] as any)[0].paid ?? 0)
    );
    const totalPendingInvoices = formatCurrency(
      Number((data[1] as any)[0].pending ?? 0)
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
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  console.log("[invoices] fetchFilteredInvoices");

  try {
    const data: InvoicesTable[] = await sql
      .prepare(
        `
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
  END as 'final',
  CASE WHEN inv.payment - inv.amount = inv.payment THEN
    'paid_to'
  WHEN inv.payment - ABS(inv.amount) < 0 THEN
    'owed' 
  ELSE
      'paid'
  END as 'status',        
        strftime('%Y', date) as "year",        
        concat(m.first_name, ' ', m.last_name) as 'name',
        m.email as 'email',
        '/profile.jpg' as 'image_url'
      FROM invoices inv
      LEFT JOIN membership m
      ON m.membership_id = inv.membership_id
      WHERE 
        m.first_name like '${`%${query}%`}' OR
        m.last_name like '${`%${query}%`}' OR
        strftime('%Y', date) like '${`%${query}%`}'
      ORDER BY inv.date DESC
        limit ${ITEMS_PER_PAGE} OFFSET ${offset}
    `
      )
      .all();

    const invoices = data.map((invoice: InvoicesTable) => ({
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
    const data = await sql
      .prepare(
        `
      select count(*) as 'count'
      FROM invoices inv
      LEFT JOIN membership m
      ON m.membership_id = inv.membership_id
      WHERE 
        m.first_name like '${`%${query}%`}' OR
        strftime('%Y', date) like '${`%${query}%`}'
  `
      )
      .all();

    console.log("[invoices] fetchInvoicePages");

    return Math.ceil(Number((data as any)[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data: InvoiceForm[] = await sql
      .prepare(
        `
      SELECT
        id as "id",
        membership_id as "customer_id",
        amount as "amount",
        description as "status"
      FROM invoices
      WHERE id = ?;
    `
      )
      .bind(id)
      .all();
    // WHERE id = "${id}";
    console.log("[invoices] fetchInvoiceById");

    const invoices = data.map((invoice: InvoiceForm) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount,
    }));

    return invoices[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchMemberPropertiesByMemberId(id: string) {
  try {
    const data: MemberProperty[] = await sql
      .prepare(
        `
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
      m.membership_id = ?;
    `
      )
      .bind(id)
      .all();

    console.log("[properties] fetchMemberPropertyById");

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch member property record");
  }
}

export async function fetchMemberById(id: string) {
  try {
    const data: MemberForm[] = await sql
      .prepare(
        `
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
      WHERE membership_id = ?;
    `
      )
      .bind(id)
      .all();

    console.log("[members] fetchCustomerById");

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch member record");
  }
}

// Verify that this is called
export async function fetchCustomers() {
  try {
    const customers: CustomerField[] = await sql
      .prepare(
        `
      SELECT
        membership_id as "id",
        CONCAT(last_name, ', ', first_name) as "name"
      FROM membership
      ORDER BY last_name ASC
    `
      )
      .all();

    console.log("[membership] Fetching membership data");

    return customers;
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
    const data: CustomersTableType[] = await sql
      .prepare(
        `
SELECT
  m.membership_id as 'id',
  concat(m.first_name, ' ', m.last_name) as 'name',
  COUNT(i.membership_id) AS total_invoices,
  m.membership_type,
  IFNULL(d.slip_number, 0) as 'slip_number',
  SUM(CASE WHEN i.description = 'pending' THEN i.amount ELSE 0 END) AS total_pending,
  SUM(CASE WHEN i.description = 'paid' THEN i.amount ELSE 0 END) AS total_paid
FROM membership m
LEFT JOIN invoices i ON m.membership_id = i.membership_id
LEFT JOIN dock d on m.membership_id = d.membership_id
WHERE
  m.first_name LIKE '${`%${query}%`}' OR
  m.last_name LIKE '${`%${query}%`}'
  GROUP BY m.membership_id
ORDER BY m.first_name ASC
limit ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `
      )
      .all();

    console.log("[membership] Fetching filtered member data");

    const customers = data.map((customer: CustomersTableType) => ({
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
    const data = await sql
      .prepare(
        `
select count(*) as 'count'
      FROM membership m
      WHERE 
        m.first_name like '${`%${query}%`}' OR
        m.last_name like '${`%${query}%`}'
  `
      )
      .all();

    console.log(
      "[membership] fetching membership page count for pagination:",
      (data as any)[0].count
    );
    return Math.ceil(Number((data as any)[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchDockTableData(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data: DockTableType[] = await sql
      .prepare(
        `SELECT 
      d.dock_id as 'id', 
      d.slip_number, 
      concat(m.first_name, ' ', m.last_name) as 'name',
      strftime('%Y', date) as "Date",
      d.boat_size, 
      d.shore_power,
      d.t_slip
    FROM membership m
    INNER join dock d ON 
      d.membership_id = m.membership_id
    WHERE 
      m.first_name like '${`%${query}%`}' OR
      m.last_name like '${`%${query}%`}' OR    
      strftime('%Y', date) like '${`%${query}%`}'      
    ORDER BY d.slip_number asc
    limit ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `
      )
      .all();

    const dock_records = data.map((dock_record: DockTableType) => ({
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
    const data = await sql
      .prepare(
        `SELECT
      count(*) as 'count'
      FROM dock d
      INNER JOIN membership m
      ON m.membership_id = d.membership_id
      WHERE 
        m.first_name like '${`%${query}%`}' OR
        m.last_name like '${`%${query}%`}' OR    
        strftime('%Y', d.date) like '${`%${query}%`}'       
  `
      )
      .all();

    console.log("[dock] fetching dock page count for pagination");
    return Math.ceil(Number((data as any)[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchDockById(id: string) {
  try {
    const data: DockTableType[] = await sql
      .prepare(
        `
     SELECT 
      d.dock_id as 'id', 
      d.slip_number, 
      concat(m.first_name, ' ', m.last_name) as 'name',
      strftime('%Y', date) as "Date",
      d.boat_size, 
      d.shore_power,
      d.t_slip,
      m.membership_id
    FROM membership m
    INNER join dock d ON 
      d.membership_id = m.membership_id    
      WHERE dock_id = ?;
    `
      )
      .bind(id)
      .all();

    console.log("[dock] fetchDockById:", data);

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch dock record by id " + id);
  }
}

export async function fetchDockByMembershipId(id: string) {
  try {
    const data: DockTableType[] = await sql
      .prepare(
        `
     SELECT 
      d.dock_id as 'id', 
      d.slip_number, 
      concat(m.first_name, ' ', m.last_name) as 'name',
      strftime('%Y', date) as "Date",
      d.boat_size, 
      d.shore_power,
      d.t_slip,
      m.membership_id
    FROM membership m
    INNER join dock d ON 
      d.membership_id = m.membership_id    
      WHERE d.membership_id = ?;
    `
      )
      .bind(id)
      .all();

    console.log("[dock] fetchDockByMembershipId:", data);

    //return all ? data[0] : data[0][0];
    return data as DockTableType[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch dock record by id " + id);
  }
}

export async function fetchPropertyById(id: string) {
  try {
    const data: MemberProperty[] = await sql
      .prepare(
        `
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
      p.id = ?;
    `
      )
      .bind(id)
      .all();

    console.log("[properties] fetchPropertyById");

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch member record");
  }
}

export async function fetchPropertyPages(query: string) {
  try {
    const data = await sql
      .prepare(
        `
select count(*) as 'count'
      FROM properties p
      WHERE 
        p.owner_address like '${`%${query}%`}' OR
        p.owner_name like '${`%${query}%`}'
      ORDER BY p.property_address
  `
      )
      .all();

    let count = Number((data as any)[0].count);
    console.log(
      "[properties] fetching property page count for pagination:",
      count
    );
    return Math.ceil(count / ITEMS_PER_PAGE);
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
    const data: PropertyTableType[] = await sql
      .prepare(
        `SELECT 
        p.id,
        p.property_address,
        p.owner_name
      FROM properties p

      WHERE 
        p.property_address like '${`%${query}%`}' OR
        p.owner_name like '${`%${query}%`}'
      ORDER BY p.property_address
            limit ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `
      )
      .all();

    console.log("[properties] Fetching properties filtered table data");

    return data;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch dock table.");
  }
}

export async function fetchSettings(
  formatDateFunc: Function = formatDateToShort
) {
  try {
    const data: SettingsData[] = await sql
      .prepare(
        `SELECT 
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
	  `
      )
      .all();

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      date_of_invoice: formatDateFunc(invoice.date_of_invoice),
      invoice_due_date: formatDateFunc(invoice.invoice_due_date),
      early_payment_due_date: formatDateFunc(invoice.early_payment_due_date),
      no_boats_before_date: formatDateFunc(invoice.no_boats_before_date),
      max_badges_str: numToWords(invoice.max_badges),
    }));

    console.log("[settings] Fetching settings table data:", latestInvoices);

    return latestInvoices[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch settings data");
  }
}
