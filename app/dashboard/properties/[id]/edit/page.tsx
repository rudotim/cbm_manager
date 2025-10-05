import Form from "@/app/ui/properties/edit-form";
import Breadcrumbs from "@/app/ui/members/breadcrumbs";
import { fetchPropertyById } from "@/app/lib/data";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const property = await fetchPropertyById(id);

  console.log("Fetched property:", id);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Properties", href: "/dashboard/properties" },
          {
            label: "Edit Property",
            href: `/dashboard/properties/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form property={property} />
    </main>
  );
}
