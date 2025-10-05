"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import mysql from "mysql2/promise";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = await mysql.createConnection({
  host: process.env.MYSQL_URL!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
});

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
  fname: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});
const CreateMember = MemberFormSchema.omit({ id: true, date: true });
const UpdateMember = MemberFormSchema.omit({ id: true, date: true });

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
  const { fname, amount, status } = CreateMember.parse({
    fname: formData.get("fname"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];
  // Test it out:
  console.log(fname, amount, status);

  // await sql.execute(`
  //   INSERT INTO membership (MembershipID, Amount, Description, Date)
  //   VALUES (${fname}, ${amountInCents}, "${status}", "${date}")
  // `);

  revalidatePath("/dashboard/members");
  redirect("/dashboard/members");
}

export async function updateMember(id: string, formData: FormData) {
  // const { customerId, amount, status } = UpdateMember.parse({
  //   customerId: formData.get("customerId"),
  //   amount: formData.get("amount"),
  //   status: formData.get("status"),
  // });

  // const amountInCents = amount * 100;

  // await sql.execute(`
  //   UPDATE invoices
  //   SET membership_id = ${customerId}, amount = ${amountInCents}, description = "${status}"
  //   WHERE id = ${id}
  // `);

  revalidatePath("/dashboard/members");
  redirect("/dashboard/members");
}

export async function deleteMember(id: string) {
  await sql.execute(`DELETE FROM membership WHERE membership_id = ${id}`);
  revalidatePath("/dashboard/members");
}

export async function updateProperty(id: string, formData: FormData) {
  // const { customerId, amount, status } = UpdateMember.parse({
  //   customerId: formData.get("customerId"),
  //   amount: formData.get("amount"),
  //   status: formData.get("status"),
  // });

  // const amountInCents = amount * 100;

  // await sql.execute(`
  //   UPDATE invoices
  //   SET membership_id = ${customerId}, amount = ${amountInCents}, description = "${status}"
  //   WHERE id = ${id}
  // `);

  revalidatePath("/dashboard/properties");
  redirect("/dashboard/properties");
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
