import { DockTableType } from "@/app/lib/definitions";
//import { CButton, CCollapse, CCard, CCardBody } from "@coreui/react";
import { useState } from "react";
import Expandable from "../expandable_props";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import { Button } from "../button";

export default function DockEntry({ property }: { property: DockTableType }) {
  const [visible, setVisible] = useState(false);

  //   id: number;
  // name: string;
  // year: number;
  // slip_number: number;
  // boat_size: number;
  // owed: number;
  // balance: number;
  // shore_power: number;
  // t_slip: number;
  // membership_id: number;

  return (
    <div>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          onClick={() => {
            setVisible(!visible);
          }}
          className="rounded-md border p-2 inline"
        >
          <span>{visible ? "Hide" : "View"} Details</span>
        </Button>

        <span>{property.year}</span>
      </div>

      <Expandable isOpen={visible} onToggle={() => setVisible(!visible)}>
        <div className="mt-3">
          {/* Boat Size */}
          <div className="col-span-full">
            <label
              htmlFor="boat_size"
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              Boat Size
            </label>
            <div className="mt-2">
              <input
                id="boat_size"
                name="boat_size"
                type="text"
                autoComplete="boat_size"
                defaultValue={property?.boat_size || ""}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />
            </div>
          </div>

          {/* Slip # */}
          <div className="sm:col-span-2 sm:col-start-1">
            <label
              htmlFor="slip_number"
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              Slip #
            </label>
            <div className="mt-2">
              <input
                id="slip_number"
                name="slip_number"
                type="text"
                autoComplete="address-level2"
                defaultValue={property?.slip_number || ""}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />
            </div>
          </div>

          {/* Shore Power */}
          <div className="sm:col-span-2">
            <label
              htmlFor="shore_power"
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              Shore Power
            </label>
            <div className="mt-2">
              <input
                id="shore_power"
                name="shore_power"
                type="text"
                autoComplete="address-level1"
                defaultValue={property?.shore_power ? "Yes" : "No"}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />
            </div>
          </div>

          {/* T-Slip */}
          <div className="sm:col-span-2">
            <label
              htmlFor="t_slip"
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              T-Slip
            </label>
            <div className="mt-2">
              <input
                id="t_slip"
                name="t_slip"
                type="text"
                autoComplete="t_slip"
                defaultValue={property?.t_slip ? "Yes" : "No"}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />
            </div>
          </div>
        </div>
      </Expandable>
    </div>
  );
}
