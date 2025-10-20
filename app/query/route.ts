// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
import sql from "@/app/lib/db";

//import mysql from "mysql2/promise";

console.log("mysql url>", process.env.MYSQL_URL!);

// const sql = await mysql.createConnection({
//   host: process.env.MYSQL_URL!,
//   user: process.env.MYSQL_USER!,
//   password: process.env.MYSQL_PASSWORD!,
//   database: process.env.MYSQL_DATABASE!,
// });

async function listInvoices() {
  // const data = await sql`
  //   SELECT invoices.amount, customers.name
  //   FROM invoices
  //   JOIN customers ON invoices.customer_id = customers.id
  //   WHERE invoices.amount = 666;
  // `;

  const [results, fields] = await sql.execute(
    "SELECT FirstName FROM `membership` WHERE `Over75` = ?",
    [true]
  );

  return results;
}

export async function GET() {
  // return Response.json({
  //   message:
  //     "Uncomment this file and remove this line. You can delete this file when you are finished.",
  // });
  try {
    return Response.json(await listInvoices());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
