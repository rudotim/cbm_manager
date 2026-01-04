"use client";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { resetInvoices } from "@/app/lib/actions";
import { ResetInvoiceDialog } from "./reset-invoice";
import { useState } from "react";

export function ResetInvoices() {
  let [isOpen, setIsOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const doneDialog = () => {
    setIsOpen(false);
  };

  return (
    <form>
      <button
        type="button"
        onClick={handleOpenDialog}
        title="Reset Invoices"
        className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block">Reset Invoices</span>
        <TrashIcon className="h-5 md:ml-2;" />
        <ResetInvoiceDialog isOpen={isOpen} done={doneDialog} />
      </button>
    </form>
  );
}
