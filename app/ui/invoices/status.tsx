import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function InvoiceStatus({ status }: { status: string }) {
  // let status;
  // if (payment > 0 && payment - amount === payment) status = "paid_to";
  // else if (payment - Math.abs(amount) < 0) status = "owed";
  // else if (payment > 0 && payment === amount) status = "paid";

  // console.log("amount:", amount, "payment:", payment, "status:", status);

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs",
        {
          "bg-red-400 text-white": status === "owed",
          "bg-green-500 text-white": status === "paid",
          "bg-blue-500 text-white": status === "paid_to",
        }
      )}
    >
      {status === "owed" ? (
        <>
          Owe
          <ClockIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === "paid" ? (
        <>
          Paid
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === "paid_to" ? (
        <>
          Pay Out
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
