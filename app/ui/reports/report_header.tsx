"use client";

const ReportHeader = ({ report_title }: { report_title: string }) => {
  const printPage = () => {
    window.print();
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
    </div>
  );
};

export default ReportHeader;
