"use client";

import React, { useState } from "react";
import { CustomerField } from "@/app/lib/definitions";
import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { createMember } from "@/app/lib/actions";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

export default function Form({ customers }: { customers: CustomerField[] }) {
  const [membershipType, setMembershipType] = useState("stockholder");

  const onNewMembershipType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMembershipType(e.target.value);
  };

  return (
    <form action={createMember}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="border-b border-gray-900/10 pb-12 dark:border-white/10">
          <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first_name"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                First name
              </label>
              <div className="mt-2">
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last_name"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Last name
              </label>
              <div className="mt-2">
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="cell_phone"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Cell Phone
              </label>
              <div className="mt-2">
                <input
                  id="cell_phone"
                  name="cell_phone"
                  type="tel"
                  autoComplete="phone"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="cape_phone"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Cape Phone
              </label>
              <div className="mt-2">
                <input
                  id="cape_phone"
                  name="cape_phone"
                  type="tel"
                  autoComplete="phone"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>
            <fieldset className="col-span-full">
              <legend className="text-sm/6 font-semibold text-gray-900">
                Membership Type
              </legend>
              <div className="flex flex-row items-center mt-6">
                <div className="flex items-center gap-x-3 mr-4">
                  <input
                    id="stockholder"
                    type="radio"
                    name="membership_type"
                    value="Stock"
                    onChange={onNewMembershipType}
                    className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                  />
                  <label
                    htmlFor="stockholder"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Stockholder
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="associate"
                    type="radio"
                    name="membership_type"
                    value="Associate"
                    onChange={onNewMembershipType}
                    className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                  />
                  <label
                    htmlFor="associate"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Associate
                  </label>
                </div>
              </div>
            </fieldset>

            {/* Status */}
            <div className="sm:col-span-3">
              <label
                htmlFor="status"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Status
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="status"
                  name="status"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-indigo-500"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Moved</option>
                  <option>Deceased</option>
                </select>
              </div>
            </div>

            {/* Mailing Address */}
            <div className="col-span-full">
              <h2 className="text-base/7 mt-4 font-semibold text-gray-900 dark:text-white">
                Mailing Address
              </h2>
              <p className="col-span-full mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                Use a permanent address where you can receive mail.
              </p>
              <label
                htmlFor="mailing_street"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Street address
              </label>
              <div className="mt-2">
                <input
                  id="mailing_street"
                  name="mailing_street"
                  type="text"
                  autoComplete="mailing_street"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* City */}
            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="mailing_city"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  id="mailing_city"
                  name="mailing_city"
                  type="text"
                  autoComplete="address-level2"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* State */}
            <div className="sm:col-span-2">
              <label
                htmlFor="mailing_state"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                State / Province
              </label>
              <div className="mt-2">
                <input
                  id="mailing_state"
                  name="mailing_state"
                  type="text"
                  autoComplete="address-level1"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Mailing zip code */}
            <div className="sm:col-span-2">
              <label
                htmlFor="mailing_zip"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  id="mailing_zip"
                  name="mailing_zip"
                  type="text"
                  autoComplete="mailing_zip"
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
          href="/dashboard/members"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Member</Button>
      </div>
    </form>
  );
}
