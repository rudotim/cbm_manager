import {
  InvoiceForm,
  MemberInvoiceForm,
  SettingsData,
} from "@/app/lib/definitions";
import { formatCurrency } from "@/app/lib/utils";
import Link from "next/link";
import { Button } from "@/app/ui/button";

export default function InvoiceReportTemplate({
  invoice,
  settings,
}: {
  invoice: MemberInvoiceForm;
  settings: SettingsData;
}) {
  let count = 1;
  return (
    <div>
      <div id="invoice">
        <div>
          <div>
            <header className="header_static">
              {/*ADDRESS VISIBLE THROUGH ENVELOPE WINDOW*/}
              <div className="awindow-address">
                {invoice.first_name} {invoice.last_name}
                <br />
                {invoice.mailing_street},
                <br />
                {invoice.mailing_city}, {invoice.mailing_state},{" "}
                {invoice.mailing_zip}
              </div>

              <div>
                <strong>INVOICE</strong>
                <br />
                Date: {settings.date_of_invoice}
                <br />
                Due: {settings.invoice_due_date}
              </div>
            </header>

            <main>
              <table border={0} cellSpacing="0" cellPadding="0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="text-left">DESCRIPTION</th>
                    <th className="text-left">UNIT PRICE</th>
                    <th className="text-left">AMOUNT</th>
                    <th className="text-left">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="no">{count++}</td>
                    <td className="text-left">
                      Cape Breton Annual Service Fee
                    </td>
                    <td className="unit">
                      {formatCurrency(settings.membership_fee)}
                    </td>
                    <td className="qty">1</td>
                    <td className="total">
                      {formatCurrency(settings.membership_fee)}
                    </td>
                  </tr>
                  <tr>
                    <td className="no">{count++}</td>
                    <td className="text-left">
                      Additional badges, up to {settings.max_badges_str} (
                      {settings.max_badges})
                    </td>
                    <td className="unit">
                      {formatCurrency(settings.extra_badge_fee)}
                    </td>
                    <td className="qty invoice_input">
                      <input
                        id="num_badges"
                        name="num_badges"
                        type="number"
                        step="1"
                        placeholder="0"
                        defaultValue={invoice.num_badges}
                        className="peer block w-full border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                      />
                    </td>
                    <td className="total"></td>
                  </tr>
                  <tr>
                    <td className="no">{count++}</td>
                    <td className="text-left">Visionary Fund</td>
                    <td className="unit">
                      {formatCurrency(settings.visionary_fund_fee)}
                    </td>
                    <td className="qty">1</td>
                    <td className="total">
                      {formatCurrency(settings.visionary_fund_fee)}
                    </td>
                  </tr>
                  {invoice.slip > 0 ? (
                    <>
                      <tr>
                        <td className="no">{count++}</td>
                        <td className="text-left">Dock Slip Rental</td>
                        <td className="unit"></td>
                        <td className="qty"></td>
                        <td className="total invoice_input">
                          <input
                            id="dock_slip"
                            name="dock_slip"
                            type="number"
                            step="1"
                            placeholder="$0"
                            defaultValue={invoice.dock_slip}
                            className="peer block w-full border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                          />
                        </td>
                      </tr>

                      <tr>
                        <td className="no">{count++}</td>
                        <td className="text-left">Optional Tee Slip</td>
                        <td className="unit">
                          {formatCurrency(settings.t_slip_fee)}
                        </td>
                        <td className="qty"></td>
                        <td className="total">
                          <input
                            type="input"
                            name="t_slip"
                            defaultChecked={!!invoice.t_slip}
                            className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-2"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="no">{count++}</td>
                        <td className="text-left">Optional Shore Power</td>
                        <td className="unit">
                          {formatCurrency(settings.shore_power_fee)}
                        </td>
                        <td className="qty"></td>
                        <td className="total"></td>
                      </tr>
                    </>
                  ) : (
                    ""
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2}></td>
                    <td colSpan={2}>SUBTOTAL</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={2}></td>
                    <td colSpan={2}>Early Payment Discount*</td>
                    <td>-{formatCurrency(settings.early_payment_discount)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}></td>
                    <td colSpan={2}>GRAND TOTAL</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={2}></td>
                    <td colSpan={2}>TOTAL RECEIVED</td>
                    <td className="invoice_input">
                      <input
                        id="payment"
                        name="payment"
                        type="number"
                        step="1"
                        placeholder="$0"
                        defaultValue={invoice.payment}
                        className="peer block w-full border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                      />
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="notices">
                <div className="notice">
                  *Early Payment Discount: To qualify, payment must be{" "}
                  <b>
                    <i>received</i>
                  </b>{" "}
                  no later than {settings.early_payment_due_date}, 2026
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      <input type="hidden" name="status" value="pending" />
      <input type="hidden" name="customerId" value={invoice.customerId} />
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update Invoice</Button>
      </div>
    </div>
  );
}
