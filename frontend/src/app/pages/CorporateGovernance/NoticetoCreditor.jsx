import Link from "next/link";
import React from "react";
import { FaFilePdf } from "react-icons/fa";

const NoticetoCreditor = () => {
  return (
    <>
      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(/assets/img/annual-return/1.avif)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">
            <p className="text-5xl font-bold">Notice to Creditor</p>
          </div>
        </div>
      </section>

      {/* table */}

      <section className="py-10 bg-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full border-collapse">
              {/* Table Head */}
              <thead>
                <tr className="bg-blue-900 text-white text-left">
                  <th className="px-6 py-3 text-white font-semibold">Title</th>
                  <th className="px-6 py-3 text-white font-semibold">
                    Particulars
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">Secured</td>
                  <td className="px-6 py-4">
                    <Link
                      href="/assets/pdf/annual-return/2023-2024.pdf"
                      className="flex items-center cursor-pointer gap-2 text-red-600 hover:text-red-800"
                      target="_blank"
                    >
                      <FaFilePdf /> View PDF
                    </Link>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">Unsecured</td>
                  <td className="px-6 py-4">
                    <Link
                      href="/assets/pdf/annual-return/2022-2023.pdf"
                      className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-800"
                      target="_blank"
                    >
                      <FaFilePdf /> View PDF
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default NoticetoCreditor;
