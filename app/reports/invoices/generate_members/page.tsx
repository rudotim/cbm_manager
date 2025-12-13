import { fetchMembershipInvoices } from "@/app/lib/reports";
import ReportHeader from "@/app/ui/reports/report_header";
import InvoiceReportTemplate from "@/app/ui/reports/invoice_report_template";
import { fetchSettings } from "@/app/lib/data";
import { formatDateToLocal } from "@/app/lib/utils";

import "./invoice_styles.css";

export default async function MembershipPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const limit = Number(searchParams?.limit) || 0;

  const invoices = await fetchMembershipInvoices(limit);
  const settings = await fetchSettings(formatDateToLocal);

  return (
    <>
      <header className="print:hidden">
        <ReportHeader
          report_title={"Membership Invoices"}
          data={"fetchMembershipInvoices"}
        ></ReportHeader>
      </header>
      <main className="flex items-center justify-center">
        <div className="relative mx-auto flex w-full w-[8.5in] h-[11in] flex-col space-y-2.5 p-4">
          {invoices.map((member_invoice, i) => {
            return (
              <div key={member_invoice.id}>
                <InvoiceReportTemplate
                  member_data={member_invoice}
                  settings={settings}
                ></InvoiceReportTemplate>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
