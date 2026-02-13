import AcmeLogo from "@/app/ui/acme-logo";
import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";
import { fetchMembershipReport } from "@/app/lib/reports";
import clsx from "clsx";
import ReportHeader from "@/app/ui/reports/report_header";

// Stop the query from being cached
export const dynamic = "force-dynamic";

export default async function MembershipPage() {
  const report = await fetchMembershipReport();

  return (
    <>
      <header className="print:hidden">
        <ReportHeader
          data={"fetchMembershipReport"}
          report_title={"Active Membership Report"}
        ></ReportHeader>
      </header>
      <main className="flex items-center justify-center">
        <div className="relative mx-auto flex w-full flex-col space-y-2.5 p-4">
          <div className="flex text-white w-full items-end rounded-lg bg-blue-500 p-3">
            Active Membership Report
          </div>
          {report.map((rep, i) => {
            return (
              <div key={rep.id}>
                {i}: {rep.last_name}, {rep.first_name}, {rep.mailing_street},{" "}
                {rep.mailing_city}, {rep.mailing_state}, {rep.mailing_zip},{" "}
                {rep.email}, {rep.membership_type}, {rep.senior_status}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
