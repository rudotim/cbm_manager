"use client";

import React, { useState } from "react";
import { SettingsData } from "@/app/lib/definitions";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateSettings } from "@/app/lib/actions";
import { formatDateToShort } from "@/app/lib/utils";

export default function EditSettingsForm({
  settings,
}: {
  settings: SettingsData;
}) {
  const updateSettingsWithId = updateSettings.bind(
    null,
    settings.year.toString()
  );

  return (
    <form action={updateSettingsWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="border-b border-gray-900/10 pb-12 dark:border-white/10">
          <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
            Settings Information
          </h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            {/* Membershp Fee */}
            <div className="col-span-full">
              <label
                htmlFor="membership_fee"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Membership Fee
              </label>
              <div className="mt-2">
                <input
                  id="membership_fee"
                  name="membership_fee"
                  type="text"
                  autoComplete="membership_fee"
                  defaultValue={settings?.membership_fee || ""}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Extra Badge Fee */}
            <div className="col-span-full">
              <label
                htmlFor="extra_badge_fee"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Extra Badge Fee
              </label>
              <div className="mt-2">
                <input
                  id="extra_badge_fee"
                  name="extra_badge_fee"
                  type="text"
                  autoComplete="extra_badge_fee"
                  defaultValue={settings?.extra_badge_fee || ""}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Max Extra Badges */}
            <div className="col-span-full">
              <label
                htmlFor="max_badges"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Maximum Additional Badges
              </label>
              <div className="mt-2">
                <input
                  id="max_badges"
                  name="max_badges"
                  type="text"
                  autoComplete="extra_badge_fee"
                  defaultValue={settings?.max_badges || ""}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Visionary Fund Fee */}
            <div className="col-span-full">
              <label
                htmlFor="visionary_fund_fee"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Visionary Fund Fee
              </label>
              <div className="mt-2">
                <input
                  id="visionary_fund_fee"
                  name="visionary_fund_fee"
                  type="text"
                  autoComplete="visionary_fund_fee"
                  defaultValue={settings?.visionary_fund_fee || ""}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Shore Power Fee */}
            <div className="col-span-full">
              <label
                htmlFor="shore_power_fee"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Shore Power Fee
              </label>
              <div className="mt-2">
                <input
                  id="shore_power_fee"
                  name="shore_power_fee"
                  type="text"
                  autoComplete="shore_power_fee"
                  defaultValue={settings?.shore_power_fee || ""}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* T Slip Fee */}
            <div className="col-span-full">
              <label
                htmlFor="t_slip_fee"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                T Slip Fee
              </label>
              <div className="mt-2">
                <input
                  id="t_slip_fee"
                  name="t_slip_fee"
                  type="text"
                  autoComplete="t_slip_fee"
                  defaultValue={settings?.t_slip_fee || ""}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Early Payment Discount */}
            <div className="col-span-full">
              <label
                htmlFor="early_payment_discount"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Early Payment Discount
              </label>
              <div className="mt-2">
                <input
                  id="early_payment_discount"
                  name="early_payment_discount"
                  type="text"
                  autoComplete="early_payment_discount"
                  defaultValue={settings?.early_payment_discount || ""}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Date of Invoice */}
            <div className="col-span-full">
              <label
                htmlFor="date_of_invoice"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Date of Invoice
              </label>
              <div className="mt-2">
                <input
                  id="date_of_invoice"
                  name="date_of_invoice"
                  type="date"
                  autoComplete="date_of_invoice"
                  defaultValue={
                    formatDateToShort(settings?.date_of_invoice) || ""
                  }
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Invoice Due Date */}
            <div className="col-span-full">
              <label
                htmlFor="invoice_due_date"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Invoice Due Date
              </label>
              <div className="mt-2">
                <input
                  id="invoice_due_date"
                  name="invoice_due_date"
                  type="date"
                  autoComplete="invoice_due_date"
                  defaultValue={
                    formatDateToShort(settings?.invoice_due_date) || ""
                  }
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Early Payment Due Date */}
            <div className="col-span-full">
              <label
                htmlFor="early_payment_due_date"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Early Payment Due Date
              </label>
              <div className="mt-2">
                <input
                  id="early_payment_due_date"
                  name="early_payment_due_date"
                  type="date"
                  autoComplete="early_payment_due_date"
                  defaultValue={
                    formatDateToShort(settings?.early_payment_due_date) || ""
                  }
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* No Boats Before Due Date */}
            <div className="col-span-full">
              <label
                htmlFor="no_boats_before_date"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                No Boats Before Due Date
              </label>
              <div className="mt-2">
                <input
                  id="no_boats_before_date"
                  name="no_boats_before_date"
                  type="date"
                  autoComplete="no_boats_before_date"
                  defaultValue={
                    formatDateToShort(settings?.no_boats_before_date) || ""
                  }
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* End of form */}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/settings"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Apply Changes</Button>
      </div>
    </form>
  );
}
