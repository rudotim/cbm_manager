import Form from "@/app/ui/members/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Members", href: "/dashboard/members" },
          {
            label: "Create New Member",
            href: "/dashboard/members/create",
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
