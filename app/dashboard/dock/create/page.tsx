import Form from "@/app/ui/dock/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";

// Stop the query from being cached
export const dynamic = "force-dynamic";

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Dock", href: "/dashboard/dock" },
          {
            label: "Create New Dock Record",
            href: "/dashboard/dock/create",
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
