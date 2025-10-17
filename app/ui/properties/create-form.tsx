"use client";

import React, { useState } from "react";
//import { CustomerField } from "@/app/lib/definitions";
import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { createProperty } from "@/app/lib/actions";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

export default function Form() {
  return (
    <form action={createProperty}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="border-b border-gray-900/10 pb-12 dark:border-white/10">
          <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            {/* Property Address */}
            <div className="col-span-full">
              <label
                htmlFor="property_address"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Property address
              </label>
              <div className="mt-2">
                <input
                  id="property_address"
                  name="property_address"
                  type="text"
                  autoComplete="property_address"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Property Owner */}
            <div className="col-span-full">
              <h2 className="text-1xl mt-4 font-semibold text-gray-900 dark:text-white">
                Property Owner
              </h2>
              <div className="mt-2">
                <input
                  id="owner_name"
                  name="owner_name"
                  type="text"
                  autoComplete="owner_name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Property Owner Address */}
            <div className="col-span-full">
              <h2 className="text-1xl mt-4 font-semibold text-gray-900 dark:text-white">
                Property Owner Address
              </h2>
              <label
                htmlFor="owner_address"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Street address
              </label>
              <div className="mt-2">
                <input
                  id="owner_address"
                  name="owner_address"
                  type="text"
                  autoComplete="owner_address"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* City */}
            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="owner_city"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  id="owner_city"
                  name="owner_city"
                  type="text"
                  autoComplete="address-level2"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* State */}
            <div className="sm:col-span-2">
              <label
                htmlFor="owner_state"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                State / Province
              </label>
              <div className="mt-2">
                <input
                  id="owner_state"
                  name="owner_state"
                  type="text"
                  autoComplete="address-level1"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Zip */}
            <div className="sm:col-span-2">
              <label
                htmlFor="owner_zip"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  id="owner_zip"
                  name="owner_zip"
                  type="text"
                  autoComplete="owner_zip"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Property Owner Phone */}
            <div className="sm:col-span-2">
              <label
                htmlFor="owner_phone"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Property Owner Phone
              </label>
              <div className="mt-2">
                <input
                  id="owner_phone"
                  name="owner_phone"
                  type="tel"
                  autoComplete="phone"
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
          href="/dashboard/properties"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create New Property Record</Button>
      </div>
    </form>
  );
}
