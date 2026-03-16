import React from "react";

const TermsConditions = () => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6 mb-6 py-10">
      <h2 className="text-center text-lg font-semibold mb-4">
        Terms & Conditions
      </h2>
      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
        <li>
          Gift Cards can be redeemed only for{" "}
          <a
            href="https://www.heavenHolidaycom"
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            Heaven Holiday
          </a>{" "}
          travel services, including{" "}
          <a href="#" className="text-blue-600 hover:underline">
            group tours
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            customised holidays
          </a>{" "}
          in India and around the{" "}
          <a href="#" className="text-blue-600 hover:underline">
            world
          </a>
          .
        </li>
        <li>
          Gift Cards are transferable. Family or friends of the receiver can
          redeem the card with a No Objection Certificate (NOC).
        </li>
        <li>Only one gift voucher can be redeemed per booking.</li>
        <li>
          If the value of the travel exceeds the gift card amount, the remaining
          balance must be paid by the guest.
        </li>
        <li>
          This Gift card/voucher is the property of Heaven Holiday and all{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Heaven Holiday terms and conditions
          </a>{" "}
          apply.
        </li>
        <li>
          The original gift card code must be provided at the time of
          redemption.
        </li>
        <li>
          For Branch and Sales Partner bookings, visit the{" "}
          <a href="#" className="text-blue-600 hover:underline">
            nearest Heaven Holiday
          </a>{" "}
          to you.
        </li>
        <li>
          For any assistance or support, kindly contact us at: Phone:{" "}
          <a href="tel:+918879972282" className="text-blue-600 hover:underline">
            +91 8879972282
          </a>{" "}
          Email:{" "}
          <a
            href="mailto:guestconnect@heavenHolidaycom"
            className="text-blue-600 hover:underline"
          >
            guestconnect@heavenHolidaycom
          </a>
        </li>
      </ul>
    </div>
  );
};

export default TermsConditions;
