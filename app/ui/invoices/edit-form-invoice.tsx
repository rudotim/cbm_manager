import { fetchMembershipInvoices } from "@/app/lib/reports";
import ReportHeader from "@/app/ui/reports/report_header";
import InvoiceEditTemplate from "@/app/ui/invoices/invoice_edit_template";
import { fetchSettings } from "@/app/lib/data";
import { formatDateToLocal } from "@/app/lib/utils";
import { updateInvoice } from "@/app/lib/actions";

import "@/app/reports/invoices/generate_members/invoice_styles.css";
import { InvoiceForm } from "@/app/lib/definitions";

export default async function MembershipPage(invoice: InvoiceForm) {
  const limit = 1;

  const invoices = await fetchMembershipInvoices(limit);
  const settings = await fetchSettings(formatDateToLocal);

  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);

  return (
    <>
      <form action={updateInvoiceWithId}>
        <main className="flex items-center justify-center">
          <div className="relative mx-auto flex w-full w-[8.5in] h-[11in] flex-col space-y-2.5 p-4">
            {invoices.map((member_invoice, i) => {
              return (
                <div key={member_invoice.id}>
                  <InvoiceEditTemplate
                    invoice={member_invoice}
                    settings={settings}
                  ></InvoiceEditTemplate>
                </div>
              );
            })}
          </div>
        </main>
      </form>
    </>
  );
}
