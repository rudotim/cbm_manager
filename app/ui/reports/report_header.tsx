"use client";

const ReportHeader = ({ report_title }: { report_title: string }) => {
  const printPage = () => {
    window.print();
  };

  return (
    <div className="flex gap-10 w-full bg-green-300 justify-center">
      {report_title}
      <input type="button" value="Print" onClick={printPage}></input>
    </div>
  );
};

export default ReportHeader;
