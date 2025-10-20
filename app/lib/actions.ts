"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
//import mysql from "mysql2/promise";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sql from "@/app/lib/db";

// const sql = await mysql.createConnection({
//   host: process.env.MYSQL_URL!,
//   user: process.env.MYSQL_USER!,
//   password: process.env.MYSQL_PASSWORD!,
//   database: process.env.MYSQL_DATABASE!,
// });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

const MemberFormSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  cell_phone: z.string(),
  cape_phone: z.string(),
  membership_type: z.string(),
  status: z.string(),
  mailing_street: z.string(),
  mailing_city: z.string(),
  mailing_state: z.string(),
  mailing_zip: z.string(),
  date: z.string(),
});
const CreateMember = MemberFormSchema.omit({ id: true, date: true });
const UpdateMember = MemberFormSchema.omit({ id: true, date: true });

const PropertyFormSchema = z.object({
  id: z.string(),
  property_address: z.string(),
  owner_name: z.string(),
  owner_address: z.string(),
  owner_city: z.string(),
  owner_zip: z.string(),
  owner_state: z.string(),
  owner_phone: z.string(),
  date: z.string(),
});
const CreateProperty = PropertyFormSchema.omit({ id: true, date: true });
const UpdateProperty = PropertyFormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  console.log("Creating invoice on server");
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];
  // Test it out:
  console.log(customerId, amount, status);

  await sql.execute(`
    INSERT INTO invoices (membership_id, amount, description, date)
    VALUES (${customerId}, ${amountInCents}, "${status}", "${date}")
  `);

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  await sql.execute(`
    UPDATE invoices
    SET membership_id = ${customerId}, amount = ${amountInCents}, description = "${status}"
    WHERE id = ${id}
  `);

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await sql.execute(`DELETE FROM invoices WHERE id = ${id}`);
  revalidatePath("/dashboard/invoices");
}

export async function createMember(formData: FormData) {
  console.log("Creating member on server");
  const {
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
    mailing_zip,
  } = CreateMember.parse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    cell_phone: formData.get("cell_phone"),
    membership_type: formData.get("membership_type"),
    cape_phone: formData.get("cape_phone"),
    status: formData.get("status"),
    mailing_street: formData.get("mailing_street"),
    mailing_city: formData.get("mailing_city"),
    mailing_state: formData.get("mailing_state"),
    mailing_zip: formData.get("mailing_zip"),
  });
  const date = new Date().toISOString().split("T")[0];

  await sql.execute(`
    INSERT INTO membership (
    first_name, last_name, email, cell_phone, cape_phone,
    membership_type, status, mailing_street, mailing_city,
    mailing_state, mailing_zip)
    VALUES (
    "${first_name}", "${last_name}", "${email}", "${cell_phone}", "${cape_phone}",
    "${membership_type}", "${status}", "${mailing_street}", 
    "${mailing_city}", "${mailing_state}",
    "${mailing_zip}"
    )
  `);

  revalidatePath("/dashboard/members");
  redirect("/dashboard/members");
}

export async function updateMember(id: string, formData: FormData) {
  console.log("Updating member on server", formData);
  const {
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
    mailing_zip,
  } = UpdateMember.parse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    cell_phone: formData.get("cell_phone"),
    membership_type: formData.get("membership_type"),
    cape_phone: formData.get("cape_phone"),
    status: formData.get("status"),
    mailing_street: formData.get("mailing_street"),
    mailing_city: formData.get("mailing_city"),
    mailing_state: formData.get("mailing_state"),
    mailing_zip: formData.get("mailing_zip"),
  });

  await sql.execute(`
    UPDATE membership
    SET first_name = "${first_name}", last_name = "${last_name}", email = "${email}",
    cell_phone = "${cell_phone}", cape_phone = "${cape_phone}", membership_type = "${membership_type}",
    status = "${status}", mailing_street = "${mailing_street}", mailing_city = "${mailing_city}",
    mailing_state = "${mailing_state}", mailing_zip = "${mailing_zip}"
    WHERE membership_id = ${id}
  `);

  revalidatePath("/dashboard/members");
  redirect("/dashboard/members");
}

export async function deleteMember(id: string) {
  await sql.execute(`DELETE FROM membership WHERE membership_id = ${id}`);
  revalidatePath("/dashboard/members");
}

export async function createProperty(formData: FormData) {
  console.log("Creating property on server");
  const {
    property_address,
    owner_name,
    owner_address,
    owner_city,
    owner_zip,
    owner_state,
    owner_phone,
  } = CreateProperty.parse({
    property_address: formData.get("property_address"),
    owner_name: formData.get("owner_name"),
    owner_address: formData.get("owner_address"),
    owner_city: formData.get("owner_city"),
    owner_zip: formData.get("owner_zip"),
    owner_state: formData.get("owner_state"),
    owner_phone: formData.get("owner_phone"),
  });
  const date = new Date().toISOString().split("T")[0];

  await sql.execute(`
    INSERT INTO properties (
    property_address, owner_name, owner_address, owner_city, owner_zip,
    owner_state, owner_phone)
    VALUES (
    "${property_address}", "${owner_name}", "${owner_address}", "${owner_city}", "${owner_zip}",
    "${owner_state}", "${owner_phone}"
    )
  `);

  revalidatePath("/dashboard/properties");
  redirect("/dashboard/properties");
}

export async function updateProperty(id: string, formData: FormData) {
  console.log("Updating property on server", formData);
  const {
    property_address,
    owner_name,
    owner_address,
    owner_city,
    owner_zip,
    owner_state,
    owner_phone,
  } = UpdateProperty.parse({
    property_address: formData.get("property_address"),
    owner_name: formData.get("owner_name"),
    owner_address: formData.get("owner_address"),
    owner_city: formData.get("owner_city"),
    owner_zip: formData.get("owner_zip"),
    owner_state: formData.get("owner_state"),
    owner_phone: formData.get("owner_phone"),
  });

  await sql.execute(`
    UPDATE properties
    SET property_address = "${property_address}", owner_name = "${owner_name}", owner_city = "${owner_city}",
    owner_zip = "${owner_zip}", owner_state = "${owner_state}", owner_phone = "${owner_phone}"    
    WHERE id = ${id}
  `);

  revalidatePath("/dashboard/properties");
  redirect("/dashboard/properties");
}

export async function updateDock(id: number, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  //   d.dock_id as "id",
  // d.slip_number,
  // concat(m.first_name, " ", m.last_name) as "name",
  // "2025" as year,
  // d.boat_size,
  // d.shore_power,
  // d.t_slip

  const amountInCents = amount * 100;

  await sql.execute(`
    UPDATE dock
    SET 
    membership_id = ${customerId}, 
    amount = ${amountInCents}, 
    description = "${status}"
    WHERE id = ${id}
  `);

  revalidatePath("/dashboard/dock");
  redirect("/dashboard/dock");
}

export async function deleteDock(id: string) {
  await sql.execute(`DELETE FROM dock WHERE id = ${id}`);
  revalidatePath("/dashboard/dock");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
