import { CustomerField } from "@/app/lib/definitions";
import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { createInvoice } from "@/app/lib/actions";

export default function Form({ customers }: { customers: CustomerField[] }) {
  return (
    <form action={createInvoice}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose Member
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
            >
              <option value="" disabled>
                Select a member
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Slip # */}
        <div className="mb-4">
          <label
            htmlFor="slip_number"
            className="mb-2 block text-sm font-medium"
          >
            Slip Number
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="slip_number"
                name="slip_number"
                type="number"
                step="1"
                placeholder="Enter slip number"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Boat Size */}
        <div className="mb-4">
          <label htmlFor="boat_size" className="mb-2 block text-sm font-medium">
            Boat Size (feet)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="boat_size"
                name="boat_size"
                type="number"
                step="1"
                placeholder="Length of boat"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        <fieldset>
          <legend className="text-sm/6 font-semibold text-gray-900">
            Optional Services
          </legend>
          <div className="mt-4 space-y-6">
            <div className="flex gap-3">
              <div className="flex h-6 shrink-0 items-center">
                <div className="group grid size-4 grid-cols-1">
                  <input
                    id="comments"
                    type="checkbox"
                    name="comments"
                    defaultChecked
                    aria-describedby="comments-description"
                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                  />
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="opacity-0 group-has-checked:opacity-100"
                    />
                    <path
                      d="M3 7H11"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="opacity-0 group-has-indeterminate:opacity-100"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-sm/6">
                <label htmlFor="comments" className="font-medium text-gray-900">
                  Shore Power
                </label>
                <p id="comments-description" className="text-gray-500">
                  Boater wants to plug in their boat to shore power
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 shrink-0 items-center">
                <div className="group grid size-4 grid-cols-1">
                  <input
                    id="comments"
                    type="checkbox"
                    name="comments"
                    defaultChecked
                    aria-describedby="comments-description"
                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                  />
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="opacity-0 group-has-checked:opacity-100"
                    />
                    <path
                      d="M3 7H11"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="opacity-0 group-has-indeterminate:opacity-100"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-sm/6">
                <label
                  htmlFor="candidates"
                  className="font-medium text-gray-900"
                >
                  T-Slip
                </label>
                <p id="candidates-description" className="text-gray-500">
                  Boater wants a premium T slip with easier access
                </p>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Invoice Status */}
        <fieldset className="mt-4">
          <legend className="mb-4 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  required
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
}
