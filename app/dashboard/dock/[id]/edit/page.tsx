import Form from "@/app/ui/dock/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchDockById, fetchCustomers } from "@/app/lib/data";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [invoice, customers] = await Promise.all([
    fetchDockById(id),
    fetchCustomers(),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Dock", href: "/dashboard/dock" },
          {
            label: "Edit Dock Record",
            href: `/dashboard/dock/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
