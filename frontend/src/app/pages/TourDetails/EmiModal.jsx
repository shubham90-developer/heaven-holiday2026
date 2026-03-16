import React, { useState } from "react";

const EmiModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  return (
    <>
      {/* Trigger link */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className="text-blue-600 text-xs hover:underline block"
      >
        Check eligibility
      </a>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative">
            {/* Header */}
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-lg font-semibold">EMI plan with Sankash</h2>
              <button
                className="absolute top-2 right-2 text-gray-500 cursor-pointer bg-gray-300 p-2 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* EMI Table */}
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Months</th>
                    <th className="p-2 border">Monthly EMI (INR)</th>
                    <th className="p-2 border">Interest</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border">3</td>
                    <td className="p-2 border">₹1,56,546</td>
                    <td className="p-2 border">1.25%</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">6</td>
                    <td className="p-2 border">₹80,789</td>
                    <td className="p-2 border">1.25%</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">9</td>
                    <td className="p-2 border">₹55,571</td>
                    <td className="p-2 border">1.25%</td>
                  </tr>
                  {/* Add more rows */}
                </tbody>
              </table>

              {/* Form */}
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-medium mb-2">
                  Click here to check your SanKash EMI eligibility
                </p>
                <div className="flex items-center gap-2">
                  {/* Full Name */}
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="flex-1 border border-gray-400 p-2 text-xs rounded-xl"
                  />

                  {/* Phone */}
                  <input
                    type="text"
                    placeholder="+91 9999999999"
                    className="flex-1 border border-gray-400 p-2 text-xs rounded-xl"
                  />

                  {/* Proceed */}
                  <button className="bg-red-700 cursor-pointer px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap">
                    Proceed
                  </button>
                </div>
              </div>

              {/* Notes Section */}
              <div className="mt-4 border-t pt-3">
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="flex justify-between items-center w-full text-left text-sm font-medium bg-gray-100 px-3 py-2 rounded"
                >
                  Important notes related to EMI
                  <span>{showNotes ? "▲" : "▼"}</span>
                </button>

                {showNotes && (
                  <div className="mt-2 bg-gray-50 p-4 rounded text-sm text-gray-700 space-y-2">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        EMI is exclusive of the processing fee and applicable
                        GST.
                      </li>
                      <li>
                        To avail this EMI facility, traveller must book flight,
                        hotels, and packages for their preferred destination by
                        opting for SanKash as a payment mode.
                      </li>
                      <li>
                        Upon booking a tour with the EMI option, you agree to
                        the terms mentioned by EMI providing company.
                      </li>
                      <li>
                        In case of cancellation after loan disbursement, the
                        cashback if any, will be deducted and also the
                        cancellation charges will apply as per the policy.
                      </li>
                      <li>Adhere to the EMI repayment schedule.</li>
                      <li>
                        Heaven Holiday is just a facilitator and approval of
                        loans lies with the Finance company and Heaven Holiday
                        does not have any control over the same. If EMI is
                        rejected then guest will have to make the payment as per
                        their tour.
                      </li>
                      <li>
                        EMI-related disputes are to be resolved with the
                        financing Firm SanKash.
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmiModal;
