import Form from "@/app/ui/members/edit-form";
import Breadcrumbs from "@/app/ui/members/breadcrumbs";
import { fetchMemberById, fetchMemberPropertyByMemberId } from "@/app/lib/data";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const customer = await fetchMemberById(id);
  const property = await fetchMemberPropertyByMemberId(id);

  console.log("Fetched customer:", customer, "id=", id);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Members", href: "/dashboard/members" },
          {
            label: "Edit Member",
            href: `/dashboard/members/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form customer={customer} property={property} />
    </main>
  );
}
