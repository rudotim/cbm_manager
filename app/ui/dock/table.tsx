import { fetchDockTableData } from "@/app/lib/data";
import { UpdateDock, DeleteDock } from "@/app/ui/dock/buttons";

export default async function DockMemberTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const dock_records = await fetchDockTableData(query, currentPage);
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Slip #
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Year
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Shore Power
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      T Slip
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {dock_records.map((dock_record) => (
                    <tr key={dock_record.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{dock_record.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {dock_record.slip_number}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {dock_record.year}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {dock_record.shore_power}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {dock_record.t_slip}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateDock id={dock_record.id} />
                          <DeleteDock id={dock_record.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
