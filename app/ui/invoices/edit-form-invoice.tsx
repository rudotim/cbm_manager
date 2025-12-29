import { fetchMembershipInvoices } from "@/app/lib/reports";
import ReportHeader from "@/app/ui/reports/report_header";
import InvoiceEditTemplate from "@/app/ui/invoices/invoice_edit_template";
import { fetchSettings } from "@/app/lib/data";
import { formatDateToLocal } from "@/app/lib/utils";
import { updateInvoice } from "@/app/lib/actions";

import "@/app/reports/invoices/generate_members/invoice_styles.css";
import { MemberInvoiceForm } from "@/app/lib/definitions";

export default async function EditInvoiceForm({
  invoice,
}: {
  invoice: MemberInvoiceForm;
}) {
  const limit = 1;

  //const invoices = await fetchMembershipInvoices(limit);
  //const invoices = await fetchInvoiceById(invoice.id);

  const settings = await fetchSettings(formatDateToLocal);

  const updateInvoiceWithId = updateInvoice.bind(null, invoice.invoice_id);

  return (
    <form action={updateInvoiceWithId}>
      <main className="flex items-center justify-center">
        <div className="relative mx-auto flex w-full w-[8.5in] h-[11in] flex-col space-y-2.5 p-4">
          <InvoiceEditTemplate
            invoice={invoice}
            settings={settings}
          ></InvoiceEditTemplate>
        </div>
      </main>
    </form>
  );
}
