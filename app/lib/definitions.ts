// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.

import { RowDataPacket } from "mysql2";

// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = RowDataPacket & {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

// export type Invoice = {
//   id: string;
//   customer_id: string;
//   amount: number;
//   date: string;
//   // In TypeScript, this is called a string union type.
//   // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
//   status: "pending" | "paid";
// };

// export type Revenue = {
//   month: string;
//   revenue: number;
// };

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: "pending" | "paid";
};

export type LatestInvoice = RowDataPacket & {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
// export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
//   amount: number;
// };

export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number;
};

export type Revenue = RowDataPacket & {
  MembershipID: number;
  CodeNo: number;
  Date: string;
  Description: string;
  Amount: number;
  Payment: number;
};

export type InvoicesTable = RowDataPacket & {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

export type CustomersTableType = RowDataPacket & {
  id: string;
  name: string;
  email: string;
  membership_type: string;
  slip_number: number;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = RowDataPacket & {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = RowDataPacket & {
  id: string;
  name: string;
};

export type InvoiceForm = RowDataPacket & {
  id: string;
  customer_id: string;
  amount: number;
  status: "pending" | "paid";
};

export type MemberForm = RowDataPacket & {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  cell_phone: string;
  cape_phone: string;
  membership_type: string;
  status: string;
  mailing_street: string;
  mailing_street2: string;
  mailing_city: string;
  mailing_zip: string;
};

export type MemberProperty = RowDataPacket & {
  id: string;
  property_address: string;
  owner_name: string;
  owner_address: string;
  owner_city: string;
  owner_zip: string;
  owner_state: string;
  owner_phone: string;
  notes: string;
};

export type DockTableType = RowDataPacket & {
  id: number;
  name: string;
  year: number;
  slip_number: number;
  boat_size: number;
  owed: number;
  balance: number;
};

export type PropertyTableType = RowDataPacket & {
  id: number;
  property_address: string;
  owner_address: string;
  owner_name: string;
  membership_type: string;
};
