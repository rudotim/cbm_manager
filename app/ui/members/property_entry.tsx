import { MemberProperty } from "@/app/lib/definitions";
//import { CButton, CCollapse, CCard, CCardBody } from "@coreui/react";
import { useState } from "react";
import Expandable from "../expandable_props";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import { Button } from "../button";

export default function PropertyEntry({
  property,
}: {
  property: MemberProperty;
}) {
  const [visible, setVisible] = useState(false);

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

        <span>{property.property_address}</span>
      </div>

      <Expandable isOpen={visible} onToggle={() => setVisible(!visible)}>
        <div className="mt-3">
          {/* Property Owner Address */}
          <div className="col-span-full">
            <h2 className="text-1xl mt-4 font-semibold text-gray-900 dark:text-white">
              Property Owner Address #X
            </h2>
            <label
              htmlFor="street-address"
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              Street address
            </label>
            <div className="mt-2">
              <input
                id="street-address"
                name="street-address"
                type="text"
                autoComplete="street-address"
                defaultValue={property?.owner_address || ""}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />
            </div>
          </div>
          {/* Property City */}
          <div className="sm:col-span-2 sm:col-start-1">
            <label
              htmlFor="city"
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              City
            </label>
            <div className="mt-2">
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                defaultValue={property?.owner_city || ""}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />
            </div>
          </div>
          {/* Property State / Province */}
          <div className="sm:col-span-2">
            <label
              htmlFor="region"
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              State / Province
            </label>
            <div className="mt-2">
              <input
                id="region"
                name="region"
                type="text"
                autoComplete="address-level1"
                defaultValue={property?.owner_state || ""}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />
            </div>
          </div>
          {/* Zip / Postal Code */}
          <div className="sm:col-span-2">
            <label
              htmlFor="postal-code"
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              ZIP / Postal code
            </label>
            <div className="mt-2">
              <input
                id="postal-code"
                name="postal-code"
                type="text"
                autoComplete="postal-code"
                defaultValue={property?.owner_zip || ""}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />
            </div>
          </div>
          {/* Property Owner Phone */}
          <div className="sm:col-span-2">
            <label
              htmlFor="property_owner_phone"
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              Property Owner Phone
            </label>
            <div className="mt-2">
              <input
                id="property_owner_phone"
                name="property_owner_phone"
                type="tel"
                autoComplete="phone"
                defaultValue={property?.owner_phone || ""}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />
            </div>
          </div>
        </div>
      </Expandable>
    </div>
  );
}
