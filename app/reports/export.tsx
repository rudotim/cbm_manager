"use server"; // Mark as a server action

import fs from "fs/promises";
import path from "path";
import * as rep from "@/app/lib/reports";

function createCSVFileFromData(data: []) {
  let content = "";
  let headers_written = false;
  let dcount;
  let fieldLength = 0;

  //console.log("data=", data);
  for (const d of data) {
    if (!headers_written) {
      fieldLength = Object.keys(d).length;
      let hcount = fieldLength;
      for (const [key, value] of Object.entries(d)) {
        content += key;
        if (--hcount > 0) content += ",";
        else content += "\n";
      }
      headers_written = true;
    }
    dcount = fieldLength;
    for (const [key, value] of Object.entries(d)) {
      content += value;
      if (--dcount > 0) content += ",";
      else content += "\n";
    }
  }
  return content;
}

export async function generateAndSaveFile(data: any) {
  try {
    switch (data) {
      case "fetchMembershipReport":
        data = await rep.fetchMembershipReport();
        break;
      case "fetchMembershipInvoices":
        data = await rep.fetchMembershipInvoices();
        break;
    }

    const content = createCSVFileFromData(data);

    const fileName = `dynamic-file-${Date.now()}.txt`;
    const filePath = path.join(process.cwd(), "public", fileName);

    await fs.writeFile(filePath, content);
    return { success: true, filePath };
  } catch (error) {
    console.error("Error in Server Action:", error);
    return { success: false, error: error };
  }
}

export async function readFileW(filePath: string) {
  console.log("Reading file path:", filePath);
  return await fs.readFile(filePath, { encoding: "utf8" });
}
