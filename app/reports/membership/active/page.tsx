"use server";

import AcmeLogo from "@/app/ui/acme-logo";
import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";
import { fetchMembershipReport } from "@/app/lib/reports";
import clsx from "clsx";
import ReportHeader from "@/app/ui/reports/report_header";

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
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
          <div className="flex text-white w-full items-end rounded-lg bg-blue-500 p-3">
            Active Membership Report
          </div>
          {report.map((rep, i) => {
            return (
              <div key={rep.id}>
                {i}: {rep.last_name}, {rep.first_name}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
