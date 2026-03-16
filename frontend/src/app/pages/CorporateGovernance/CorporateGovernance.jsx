import Link from "next/link";
import React from "react";

const CorporateGovernance = () => {
  return (
    <>
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div>
            <Link
              href={"/corporate-governance/general-information"}
              className="text-blue-900 text-2xl font-bold mb-4 block"
            >
              General Information
            </Link>
            <Link
              href={
                "https://docs.heavenHolidaycom/website/pdf/Vigil%20Mechanism.pdf?_gl=1*jkdfer*_gcl_aw*R0NMLjE3NTgxODg1OTIuQ2owS0NRancyNjdHQmhDU0FSSXNBT2pWSjRHOVRyNmZDQ29BdTdkMW1wbFgtbXppa2xabVN6S1dWUXBpWGRtUDhQOVI4RzRNOWl4RFVlMGFBazVlRUFMd193Y0I.*_gcl_au*MjkxMDE4OTg5LjE3NTgxODg1OTEuMTA5Njg0NjM0Mi4xNzU5MjE0Mjc0LjE3NTkyMTQyNzM."
              }
              target="_blank"
              className="text-blue-900 text-2xl font-bold mb-4 block"
            >
              Vigil Mechanism Policy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default CorporateGovernance;
