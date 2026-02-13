import { fetchInvoicesByOwedPaid } from "@/app/lib/reports";
import ReportHeader from "@/app/ui/reports/report_header";

import "./invoice_styles.css";

// Stop the query from being cached
export const dynamic = "force-dynamic";

export default async function OwedVsPaidPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const limit = Number(searchParams?.limit) || 0;
  // TODO: (timr) remove hardcoded value
  const year = "2025";

  const owedInvoices = await fetchInvoicesByOwedPaid(limit, year, false);
  const paidInvoices = await fetchInvoicesByOwedPaid(limit, year, true);

  return (
    <>
      <header className="print:hidden">
        <ReportHeader
          report_title={"Membership Owed vs Paid Invoices"}
          data={"fetchOwedVsPaidInvoices"}
        ></ReportHeader>
      </header>
      <main className="flex items-center justify-center">
        <div className="relative mx-auto flex w-full w-[8.5in] h-[11in]  p-4">
          <div>
            <h1>STILL OWES</h1>
            {owedInvoices.map((rep, i) => {
              return (
                <div key={rep.invoice_id}>
                  {i}: {rep.last_name}, {rep.first_name}
                </div>
              );
            })}
          </div>
          <div>
            <h1>PAID</h1>
            {paidInvoices.map((rep, i) => {
              return (
                <div key={rep.invoice_id}>
                  {i}: {rep.last_name}, {rep.first_name}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
