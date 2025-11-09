import Form from "@/app/ui/settings/edit-form";
import Breadcrumbs from "@/app/ui/members/breadcrumbs";
import { fetchSettings } from "@/app/lib/data";

export default async function Page() {
  const settings = await fetchSettings();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Edit Settings",
            href: `/dashboard/settings`,
            active: true,
          },
        ]}
      />
      <Form settings={settings} />
    </main>
  );
}
