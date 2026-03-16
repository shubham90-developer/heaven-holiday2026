import Link from "next/link";
import React from "react";

const GeneralInformation = () => {
  return (
    <>
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div>
            <Link
              href={
                "/corporate-governance/general-information/notice-to-creditor"
              }
              className="text-blue-900 text-2xl font-bold mb-4 block"
            >
              Notice to Creditor
            </Link>
            <Link
              href={
                "https://docs.heavenHolidaycom/website/pdf/Newspaper%20Notice%20of%20Petition%20-%208th%20Aug%202025.pdf?_gl=1*femcg3*_gcl_aw*R0NMLjE3NTgxODg1OTIuQ2owS0NRancyNjdHQmhDU0FSSXNBT2pWSjRHOVRyNmZDQ29BdTdkMW1wbFgtbXppa2xabVN6S1dWUXBpWGRtUDhQOVI4RzRNOWl4RFVlMGFBazVlRUFMd193Y0I.*_gcl_au*MjkxMDE4OTg5LjE3NTgxODg1OTEuMTA5Njg0NjM0Mi4xNzU5MjE0Mjc0LjE3NTkyMTQyNzM."
              }
              className="text-blue-900 text-2xl font-bold mb-4 block"
              target="_blank"
            >
              Newspaper Publication - Notice of Petition
            </Link>
            <Link
              href={
                "https://docs.heavenHolidaycom/website/pdf/Scheme%20of%20Merger.pdf?_gl=1*femcg3*_gcl_aw*R0NMLjE3NTgxODg1OTIuQ2owS0NRancyNjdHQmhDU0FSSXNBT2pWSjRHOVRyNmZDQ29BdTdkMW1wbFgtbXppa2xabVN6S1dWUXBpWGRtUDhQOVI4RzRNOWl4RFVlMGFBazVlRUFMd193Y0I.*_gcl_au*MjkxMDE4OTg5LjE3NTgxODg1OTEuMTA5Njg0NjM0Mi4xNzU5MjE0Mjc0LjE3NTkyMTQyNzM."
              }
              className="text-blue-900 text-2xl font-bold mb-4 block"
              target="_blank"
            >
              Scheme of Merger
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default GeneralInformation;
