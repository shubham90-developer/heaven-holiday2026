"use client";

const CancellationPolicy = ({ tourData }) => {
  // Helper function to parse HTML content and extract components
  const parseCancellationPolicy = (htmlString) => {
    if (!htmlString) return null;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    // Extract intro list items
    const introLists = tempDiv.querySelectorAll("ol > li");
    const introItems = [];
    let foundTable = false;

    for (let li of introLists) {
      if (foundTable) break;
      const nextSibling = li.nextElementSibling;
      if (nextSibling && nextSibling.tagName === "TABLE") {
        foundTable = true;
      }
      introItems.push(li.textContent.trim());
    }

    // Extract table data
    const table = tempDiv.querySelector("table");
    const tableData = [];

    if (table) {
      const rows = table.querySelectorAll("tr");
      // Skip the first row (header) and process data rows
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll("td");
        if (cells.length >= 5) {
          tableData.push({
            fromDays: cells[0].textContent.trim(),
            toDays: cells[1].textContent.trim(),
            fromDate: cells[2].textContent.trim(),
            toDate: cells[3].textContent.trim(),
            fee: cells[4].textContent.trim(),
          });
        }
      }
    }

    // Extract Payment Terms
    const h3Elements = tempDiv.querySelectorAll("h3");
    let paymentTermsText = "";
    let remarksItems = [];

    for (let h3 of h3Elements) {
      const text = h3.textContent.trim();

      if (text.includes("Payment Terms")) {
        const nextP = h3.nextElementSibling;
        if (nextP && nextP.tagName === "P") {
          paymentTermsText = nextP.textContent.trim();
        }
      }

      if (text.includes("Remarks")) {
        let currentElement = h3.nextElementSibling;
        while (currentElement) {
          if (currentElement.tagName === "OL") {
            const lis = currentElement.querySelectorAll("li");
            remarksItems = Array.from(lis).map((li) => li.textContent.trim());
            break;
          }
          currentElement = currentElement.nextElementSibling;
        }
      }
    }

    return {
      introItems,
      tableData,
      paymentTermsText,
      remarksItems,
    };
  };

  // Parse the cancellation policy or use defaults
  const policyContent = tourData?.cancellationPolicy
    ? parseCancellationPolicy(tourData.cancellationPolicy)
    : null;

  // Default values

  // Use parsed data or defaults
  const introItems =
    policyContent?.introItems.length > 0 ? policyContent.introItems : [];
  const tableData =
    policyContent?.tableData.length > 0 ? policyContent.tableData : [];
  const paymentTermsText = policyContent?.paymentTermsText;
  const remarksItems =
    policyContent?.remarksItems.length > 0 ? policyContent.remarksItems : [];

  return (
    <section className="py-10 lg:px-0 px-4" id="policy">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800">
          Cancellation Policy &amp; Payment Terms
        </h2>
        <ul className="list-disc list-inside text-gray-700 mt-3 mb-6 text-sm space-y-2">
          {introItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        {/* Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="p-3 text-left">From Days</th>
                <th className="p-3 text-left">To Days</th>
                <th className="p-3 text-left">From Date</th>
                <th className="p-3 text-left">To Date</th>
                <th className="p-3 text-left">Cancellation Fee (%)</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3">{row.fromDays}</td>
                  <td className="p-3">{row.toDays}</td>
                  <td className="p-3">{row.fromDate}</td>
                  <td className="p-3">{row.toDate}</td>
                  <td className="p-3">{row.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Terms */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-2">Payment Terms</h3>
          <p className="text-gray-700 text-sm">{paymentTermsText}</p>
        </div>

        {/* Remarks */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-2">Remarks</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
            {remarksItems.map((remark, index) => (
              <li key={index}>{remark}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CancellationPolicy;
