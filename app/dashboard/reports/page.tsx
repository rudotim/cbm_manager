import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import DockMemberTable from "@/app/ui/dock/table";
import { CreateDockRecord } from "@/app/ui/dock/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchCustomerPages } from "@/app/lib/data";
import Link from "next/link";

import "./report.styles.css";

export default async function ReportsPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCustomerPages(query);

  return (
    <div className="w-full">
      <div className="link-container">
        <h2>Membership Reports</h2>
        <ul>
          <li>
            <Link href={`/reports/membership/active`} target="_blank">
              Active Membership List
            </Link>
          </li>
        </ul>
      </div>

      <div className="link-container">
        <h2>Invoice Reports</h2>
        <ul>
          <li>
            <Link href={`/reports/invoices/generate_members`} target="_blank">
              Generate Invoices
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
