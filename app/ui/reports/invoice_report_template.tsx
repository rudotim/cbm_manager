import { MemberInvoiceForm, SettingsData } from "@/app/lib/definitions";
import { formatCurrency } from "@/app/lib/utils";

export default function InvoiceReportTemplate({
  member_data,
  settings,
}: {
  member_data: MemberInvoiceForm;
  settings: SettingsData;
}) {
  let count = 1;
  return (
    <div>
      <div id="invoice">
        <div className="invoice">
          <div>
            <header>
              {/*ADDRESS VISIBLE THROUGH ENVELOPE WINDOW*/}
              <div className="window-address">
                {member_data.first_name} {member_data.last_name}
                <br />
                {member_data.mailing_street},
                <br />
                {member_data.mailing_city}, {member_data.mailing_state},{" "}
                {member_data.mailing_zip}
              </div>

              {/*HEADER*/}
              <div className="header">
                <div className="company-info">
                  <strong>Cape Breton Holding Company</strong>
                  <br />
                  51 Bretonian Drive, Brick, NJ 08723
                  <br />
                  info@capebretonnj.org
                </div>

                <div className="looogo">
                  <div className="logo-container">
                    <a className="logo" href="http://example.com">
                      <img
                        className="boat"
                        alt="My Image"
                        src="data:image/png;base64,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"
                      />
                    </a>
                  </div>
                </div>
              </div>

              <div className="invoice-meta">
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
                    <td className="qty"></td>
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
                  {member_data.slip_number > 0 ? (
                    <>
                      <tr>
                        <td className="no">{count++}</td>
                        <td className="text-left">Dock Slip Rental</td>
                        <td className="unit"></td>
                        <td className="qty">?</td>
                        <td className="total">
                          {formatCurrency(member_data.dock_slip)}
                        </td>
                      </tr>

                      {(member_data.t_slip ?? false) ? (
                        <tr>
                          <td className="no">{count++}</td>
                          <td className="text-left">Optional Tee Slip</td>
                          <td className="unit">
                            {formatCurrency(settings.t_slip_fee)}
                          </td>
                          <td className="qty">1</td>
                          <td className="total">
                            {formatCurrency(settings.t_slip_fee)}
                          </td>
                        </tr>
                      ) : (
                        <></>
                      )}

                      {(member_data.shore_power ?? false) ? (
                        <tr>
                          <td className="no">{count++}</td>
                          <td className="text-left">Optional Shore Power</td>
                          <td className="unit">
                            {formatCurrency(settings.shore_power_fee)}
                          </td>
                          <td className="qty">1</td>
                          <td className="total">
                            {formatCurrency(settings.shore_power_fee)}
                          </td>
                        </tr>
                      ) : (
                        <></>
                      )}
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
                  {/*
                  <tr>
                    <td colSpan={2}></td>
                    <td colSpan={2}>Early Payment Discount*</td>
                    <td>-{formatCurrency(settings.early_payment_discount)}</td>
                  </tr>
                  */}
                  <tr>
                    <td colSpan={2}></td>
                    <td colSpan={2}>GRAND TOTAL</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
              <div className="mt-2"></div>
              <div className="thanks">Thank you!</div>
              <div className="mt-4"></div>

              {/*
              <div className="notices">
                <div className="notice">
                  *Early Payment Discount: To qualify, payment must be{" "}
                  <b>
                    <i>received</i>
                  </b>{" "}
                  no later than {settings.early_payment_due_date}, 2026
                </div>
              </div>
                */}
              <div className="notices">
                {member_data.slip_number > 0 ? (
                  <>
                    <div className="notice">
                      50% deposit due by March 23, 2026. Remaining balance due
                      by April 15, 2026. No vessel may occupy a slip prior to
                      April 1, 2026 and not until full payment is made and proof
                      of liability insurance is provided. A signed copy of the
                      Cape Breton Dock and Boat slip rules must accompany your
                      payment.
                    </div>
                    <div className="mt-5"></div>
                    <div className="notice">
                      All Slip Rental fees and Options MUST be paid in full
                      before tying up your boat or Jet Ski at the dock. No boats
                      or Jet Skis at the dock before{" "}
                      {settings.no_boats_before_date}
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
      <p className="new-page"></p>
    </div>
  );
}
