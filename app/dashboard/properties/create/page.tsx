import Form from "@/app/ui/properties/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Properties", href: "/dashboard/properties" },
          {
            label: "Create New Property Record",
            href: "/dashboard/properties/create",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
