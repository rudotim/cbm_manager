//"use client";

import AcmeLogo from "@/app/ui/acme-logo";
import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";
import { fetchMembershipReport } from "@/app/lib/reports";
import clsx from "clsx";
import ReportHeader from "@/app/ui/reports/report_header";
// import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
// import ReactDOM from "react-dom";
// import { PDFViewer } from "@react-pdf/renderer";
// import { useEffect, useState } from "react";

// const styles = StyleSheet.create({
//   page: { backgroundColor: "tomato" },
//   secapp/dashboard/layout.tsxtion: { textAlign: "center", margin: 30 },
// });

// const MyDocument = () => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={[styles.section, { color: "white" }]}>
//         <Text>Section #1</Text>
//       </View>
//     </Page>
//   </Document>
// );

export default async function MembershipPage() {
  const report = await fetchMembershipReport();

  return (
    <>
      <header className="print:hidden">
        <ReportHeader report_title={"Active Membership Report"}></ReportHeader>
      </header>
      <main className="flex items-center justify-center">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
          <div className="flex text-white w-full items-end rounded-lg bg-blue-500 p-3">
            Active Membership Report
          </div>
          {report.map((rep, i) => {
            return (
              <div key={rep.id}>
                {i}: {rep.last_name}, {rep.first_name}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}

// export default function PDFApp() {
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     setLoaded(true);
//   }, []);

//   return (
//     <div className="">
//       {loaded && (
//         <PDFViewer>
//           <MyDocument />
//         </PDFViewer>
//       )}
//     </div>
//   );
// }

//ReactDOM.render(<App />, document.getElementById('root'));
