"use client";

import { generateAndSaveFile, readFileW } from "@/app/reports/export";

const ReportHeader = ({
  report_title,
  data,
}: {
  report_title: string;
  data: string;
}) => {
  const printPage = () => {
    window.print();
  };

  const exportData = async () => {
    console.log("export_data0=", data);
    const file_path0 = (await generateAndSaveFile(data)).filePath;
    console.log("Generated");
    //const file_path0 = "/profile.jpg";
    if (file_path0) {
      console.log("Path si good:", file_path0);
      let fileData = await readFileW(file_path0);

      const blob = new Blob([fileData], {
        type: "data:application/octet-stream",
      });
      const url = URL.createObjectURL(blob);

      //console.log("generated path:", file_path);
      let textToSave = "this is a test";
      let hiddenElement = document.createElement("a");
      //hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
      hiddenElement.href = url; // "/" + file_path;
      // data:application/octet-stream
      hiddenElement.target = "_blank";
      hiddenElement.download = data + ".csv"; // "data.csv";
      hiddenElement.click();
    } else console.log("No file path:", file_path0);

    // const blob = new Blob([file_path], {
    //   type: "data:application/octet-stream",
    // });
    // const url = URL.createObjectURL(blob);

    // console.log("generated path:", file_path);
    // let textToSave = "this is a test";
    // let hiddenElement = document.createElement("a");
    // //hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
    // hiddenElement.href = url; // "/" + file_path;
    // // data:application/octet-stream
    // hiddenElement.target = "_blank";
    // hiddenElement.download = "data.csv";
    // hiddenElement.click();
  };

  return (
    <div className="flex gap-10 w-full bg-green-300 justify-center">
      {report_title}
      <button
        onClick={printPage}
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
      >
        Print
      </button>

      <button
        onClick={exportData}
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
      >
        Export CSV
      </button>
    </div>
  );
};

export default ReportHeader;
