import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import DockMemberTable from "@/app/ui/dock/table";
import { CreateDockRecord } from "@/app/ui/dock/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchCustomerPages } from "@/app/lib/data";

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
            <a href="#">Membership List</a>
          </li>
          <li>
            <a href="#">Membership Trend</a>
          </li>
        </ul>
      </div>

      <div className="link-container">
        <h2>Invoice Reports</h2>
        <ul>
          <li>
            <a href="#">Invoice Aging</a>
          </li>
          <li>
            <a href="#">Invoice Details</a>
          </li>
          <li>
            <a href="#">Credit Note Details</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
