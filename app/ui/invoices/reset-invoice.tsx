"use client";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteInvoice, resetInvoices } from "@/app/lib/actions";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { useState } from "react";

import "@/app/ui/invoices/dialog.css";

export function ResetInvoiceDialog({
  isOpen = false,
  done,
}: {
  isOpen: boolean;
  done: any;
}) {
  const handleReset = (year: string) => {
    resetInvoices(year);
    close();
  };

  const close = () => {
    done();
  };

  return (
    /*
      Pass `isOpen` to the `open` prop, and use `onClose` to set
      the state back to `false` when the user clicks outside of
      the dialog or presses the escape key.
    */
    <Dialog open={isOpen} onClose={close} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="border-2 border-black max-w-lg space-y-4 border bg-white p-12">
          <DialogTitle>Reset Invoices for 2026</DialogTitle>

          <Description>
            This will delete and recreate all invoices for <b>2026</b>
          </Description>
          <p>
            Any edits you have made to any <b>2026</b> invoices will be undone.
            Are you sure you want to do this?
          </p>

          <div className="dialog-buttons">
            <button className="cancel" onClick={close}>
              No, Cancel
            </button>
            <button className="reset" onClick={() => handleReset("2026")}>
              Yes, Reset
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
