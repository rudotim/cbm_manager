import { Revenue } from "./definitions";

export const formatCurrency = (amount: number) => {
  if (!amount) return "";
  return (amount || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

/**
 * Returns date in: yyyy-mm-dd (zero padded) string
 */
export const formatDateToShort = (
  dateStr: string,
  locale: string = "en-US",
) => {
  //   const date = new Date(dateStr);
  //   const mm = String(date.getMonth() + 1).padStart(2, "0");
  //   const dd = String(date.getDate()).padStart(2, "0");
  //   const yyyy = date.getFullYear();

  //   let result = `${yyyy}-${mm}-${dd}`;

  //   console.log("CONVERTING", dateStr, "to", result);
  try {
    return new Date(dateStr).toISOString().slice(0, 10);
  } catch (error) {
    return "";
  }
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = "en-US",
) => {
  //   const date = new Date(dateStr);
  //   const options: Intl.DateTimeFormatOptions = {
  //     day: "numeric",
  //     month: "short",
  //     year: "numeric",
  //   };
  //   const formatter = new Intl.DateTimeFormat(locale, options);
  //   return formatter.format(date);
  // Source - https://stackoverflow.com/a/15171030
  // Posted by Matt Johnson-Pint, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-02-18, License - CC BY-SA 4.0
  //   return new Date(dateStr).toLocaleString("en", {
  //     timeZone: "America/New_York",
  //   });
  //return new Date(dateStr).toLocaleDateString(locale);

  try {
    let parts = dateStr.split("-");
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  } catch (error) {
    return "";
  }
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.Amount));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 10000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const numToWords = (num: any = 0) => {
  if (num == 0) return "Zero";
  num = ("0".repeat((2 * (num += "").length) % 3) + num).match(/.{3}/g);
  let out = "",
    T10s = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ],
    T20s = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ],
    sclT = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion"];
  return (
    num.forEach((n: any, i: any) => {
      if (+n) {
        let hund = +n[0],
          ten = +n.substring(1),
          scl = sclT[num.length - i - 1];
        out +=
          (out ? " " : "") +
          (hund ? T10s[hund] + " Hundred" : "") +
          (hund && ten ? " " : "") +
          (ten < 20
            ? T10s[ten]
            : T20s[+n[1]] + (+n[2] ? "-" : "") + T10s[+n[2]]);
        out += (out && scl ? " " : "") + scl;
      }
    }),
    out
  );
};
