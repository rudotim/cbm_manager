"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sql from "@/app/lib/db";
import { fetchMembershipInvoices } from "./reports";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  num_badges: z.coerce.number(),
  dock_slip_deposit: z.coerce.number(),
  dock_slip: z.coerce.number(),
  payment: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  notes: z.string(),
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

const DockFormSchema = z.object({
  id: z.string(),
  membership_id: z.string(),
  slip_number: z.coerce.number(),
  boat_size: z.coerce.number(),
  shore_power: z.number().optional(),
  t_slip: z.number().optional(),
  year: z.coerce.number(),
});
const CreateDock = DockFormSchema.omit({ id: true });
const UpdateDock = DockFormSchema.omit({ id: true });

const SettingsFormSchema = z.object({
  membership_fee: z.coerce.number(),
  extra_badge_fee: z.coerce.number(),
  visionary_fund_fee: z.coerce.number(),
  shore_power_fee: z.coerce.number(),
  t_slip_fee: z.coerce.number(),
  early_payment_discount: z.coerce.number(),
  max_badges: z.coerce.number(),
  date_of_invoice: z.string(),
  invoice_due_date: z.string(),
  early_payment_due_date: z.string(),
  no_boats_before_date: z.string(),
});
const UpdateSettings = SettingsFormSchema;

export async function resetInvoices() {
  const curr_year = "2026";

  await sql.execute(
    `
    DELETE from invoices where YEAR(date) = ?;
  `,
    [curr_year],
  );

  const rep = await fetchMembershipInvoices();

  console.log("rep resp=", rep.length);
  for (const r of rep) {
    //console.log("processing membership: ", r.first_name);

    await sql.execute(
      `
      INSERT INTO invoices (membership_id, amount, description, date)
      VALUES (?, ?, ?, ?)
    `,
      [r.id, 0, "owed", curr_year + "-01-01 00:00:00"],
    );
  }

  // await sql.execute(`
  //   SELECT first_name from membership;
  // `);

  // await sql.execute(`
  //   INSERT INTO from invoices where strftime('%Y', date) = "2025";
  // `);

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function createInvoice(formData: FormData) {
  console.log("Creating invoice on server");
  const { customerId, payment, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    payment: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = payment * 100;
  const date = new Date().toISOString().split("T")[0];
  // Test it out:
  console.log(customerId, payment, status);

  await sql.execute(`
    INSERT INTO invoices (membership_id, amount, description, date)
    VALUES (${customerId}, ${amountInCents}, "${status}", "${date}")
  `);

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
  const {
    customerId,
    num_badges,
    dock_slip,
    payment,
    status,
    dock_slip_deposit,
    notes,
  } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    num_badges: formData.get("num_badges"),
    dock_slip: formData.get("dock_slip"),
    payment: formData.get("payment"),
    status: formData.get("status"),
    notes: formData.get("notes"),
    dock_slip_deposit: formData.get("dock_slip_deposit"),
  });

  //const amountInCents = amount * 100;

  await sql.execute(`
    UPDATE invoices
    SET membership_id = ${customerId},
    num_badges = ${num_badges},
    dock_slip = ${dock_slip}, 
    payment = ${payment}, 
    description = "${status}",
    dock_slip_deposit = "${dock_slip_deposit}",
    notes = "${notes}"
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

export async function createDock(formData: FormData) {
  console.log("Creating dock record on server");
  const { membership_id, slip_number, boat_size, shore_power, t_slip, year } =
    CreateDock.parse({
      membership_id: formData.get("membership_id"),
      slip_number: formData.get("slip_number"),
      boat_size: formData.get("boat_size"),
      shore_power: (formData.get("shore_power") ?? 0) === "on" ? 1 : 0,
      t_slip: (formData.get("t_slip") ?? 0) === "on" ? 1 : 0,
      year: formData.get("year"),
    });

  const date = new Date();
  date.setFullYear(year);
  const dateStr = date.toISOString().split("T")[0];

  await sql.execute(`
    INSERT INTO dock (
    membership_id, slip_number, boat_size, shore_power, t_slip, date)
    VALUES (
    "${membership_id}", "${slip_number}", "${boat_size}", 
    "${shore_power}", "${t_slip}", "${dateStr}"
    )
  `);

  revalidatePath("/dashboard/dock");
  redirect("/dashboard/dock");
}

export async function updateDock(id: string, formData: FormData) {
  console.log("Updating dock on server", formData);
  const { membership_id, slip_number, boat_size, shore_power, t_slip, year } =
    UpdateDock.parse({
      membership_id: formData.get("membership_id"),
      slip_number: formData.get("slip_number"),
      boat_size: formData.get("boat_size"),
      shore_power: (formData.get("shore_power") ?? 0) === "on" ? 1 : 0,
      t_slip: (formData.get("t_slip") ?? 0) === "on" ? 1 : 0,
      year: formData.get("year"),
    });

  const date = new Date();
  date.setFullYear(year);
  const dateStr = date.toISOString().split("T")[0];

  await sql.execute(`
    UPDATE dock
    SET 
      slip_number = "${slip_number}", 
      boat_size = "${boat_size}", 
      shore_power = "${shore_power}",
      t_slip = "${t_slip}",
      date = "${dateStr}"
    WHERE dock_id = ${id}
  `);

  revalidatePath("/dashboard/dock");
  redirect("/dashboard/dock");
}

export async function deleteDock(id: string) {
  await sql.execute(`DELETE FROM dock WHERE dock_id = ${id}`);
  revalidatePath("/dashboard/dock");
}

export async function updateSettings(id: string, formData: FormData) {
  console.log("Updating settings on server", formData);
  const {
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
    no_boats_before_date,
  } = UpdateSettings.parse({
    membership_fee: formData.get("membership_fee"),
    extra_badge_fee: formData.get("extra_badge_fee"),
    visionary_fund_fee: formData.get("visionary_fund_fee"),
    shore_power_fee: formData.get("shore_power_fee"),
    t_slip_fee: formData.get("t_slip_fee"),
    early_payment_discount: formData.get("early_payment_discount"),
    max_badges: formData.get("max_badges"),
    date_of_invoice: formData.get("date_of_invoice"),
    invoice_due_date: formData.get("invoice_due_date"),
    early_payment_due_date: formData.get("early_payment_due_date"),
    no_boats_before_date: formData.get("no_boats_before_date"),
  });

  await sql.execute(`
    UPDATE settings
    SET 
      membership_fee = "${membership_fee}", 
      extra_badge_fee = "${extra_badge_fee}", 
      visionary_fund_fee = "${visionary_fund_fee}",
      shore_power_fee = "${shore_power_fee}",
      t_slip_fee = "${t_slip_fee}",
      early_payment_discount = "${early_payment_discount}",
      max_badges = "${max_badges}",
      date_of_invoice = "${date_of_invoice}",
      invoice_due_date = "${invoice_due_date}",
      early_payment_due_date = "${early_payment_due_date}",
      no_boats_before_date = "${no_boats_before_date}"
  `);

  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
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
