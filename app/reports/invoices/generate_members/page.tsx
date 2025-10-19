import AcmeLogo from "@/app/ui/acme-logo";
import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";
import { fetchMembershipInvoices } from "@/app/lib/reports";
import clsx from "clsx";
import ReportHeader from "@/app/ui/reports/report_header";
import InvoiceReportTemplate from "@/app/ui/reports/invoice_report_template";
import { MemberInvoiceForm } from "@/app/lib/definitions";

import "./invoice_styles.css";

export default async function MembershipPage() {
  const invoices = await fetchMembershipInvoices();

  return (
    <>
      <header className="print:hidden">
        <ReportHeader report_title={"Membership Invoices"}></ReportHeader>
      </header>
      <main className="flex items-center justify-center">
        <div className="relative mx-auto flex w-full w-[8.5in] h-[11in] flex-col space-y-2.5 p-4">
          {invoices.map((member_invoice, i) => {
            return (
              <div key={member_invoice.id}>
                <InvoiceReportTemplate
                  member_data={member_invoice}
                ></InvoiceReportTemplate>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}

// export default function PDFApp() {
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     setLoaded(true);
//   }, []);

//   return (
//     <div className="">
//       {loaded && (
//         <PDFViewer>
//           <MyDocument />
//         </PDFViewer>
//       )}
//     </div>
//   );
// }

//ReactDOM.render(<App />, document.getElementById('root'));
