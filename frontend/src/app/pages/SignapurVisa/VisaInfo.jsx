"use client";
import React from "react";
import { useGetVisaInfoQuery } from "../../../../store/singaporeVisaApi/singaporevisaApi";
import { useGetContactDetailsQuery } from "../../../../store/aboutUsApi/contactApi";
import { useGetAllOfficesQuery } from "../../../../store/contactOffices/contactOfficesApi";

const VisaInfo = () => {
  const {
    data: visaInfo,
    isLoading: visaLoading,
    error: visaError,
  } = useGetVisaInfoQuery();
  const {
    data: contactDetails,
    isLoading: contactDetailsLoading,
    error: contactDetailsError,
  } = useGetContactDetailsQuery();
  const {
    data: offices,
    isLoading: officeLoading,
    error: officeError,
  } = useGetAllOfficesQuery();

  if (visaLoading || contactDetailsLoading || officeLoading) {
    return <p>loading</p>;
  }
  if (visaError || contactDetailsError || officeError) {
    return <p>error</p>;
  }

  const office = offices?.data || [];
  const activeOffice = office.filter((item) => {
    return item.status == "active";
  });

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-8 space-y-6">
          {/* Heading */}
          <p
            className="text-xs md:text-sm font-medium text-black mb-4"
            dangerouslySetInnerHTML={{
              __html: visaInfo?.data?.description || "",
            }}
          />
          {/* Contact Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-800">Contact Details</h3>
            <p className="text-gray-700">
              Heaven Holiday Pvt. Ltd. <br />
              Address:{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: contactDetails?.data?.offices?.description || "",
                }}
              />
            </p>
            <p className="mt-2 text-gray-700">
              Phone: +91 {contactDetails?.data?.callUs?.phoneNumbers[0] || ""} /
              +91 {contactDetails?.data?.callUs?.phoneNumbers[1] || ""} <br />
              Email: {contactDetails?.data?.writeToUs?.emails[0] || ""} /{" "}
              {contactDetails?.data?.writeToUs?.emails[1] || ""}
            </p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
          <div className="space-y-6 text-gray-900">
            <h3 className="text-lg font-bold">Heaven Holiday Branches</h3>

            {/* Branch List - Dynamic */}
            <div className="space-y-6 text-sm">
              {activeOffice.length === 0 ? (
                <p className="text-gray-500">No branches available</p>
              ) : (
                activeOffice.map((branch, index) => (
                  <div
                    key={branch._id}
                    className={`pb-4 ${
                      index !== activeOffice.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <p
                      className={`font-semibold ${
                        index === 0 ? "text-blue-500" : "text-gray-900"
                      }`}
                    >
                      {branch.city}
                    </p>
                    <div
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: branch.address || "",
                      }}
                    />
                    <p className="text-blue-500">Tel: +91 {branch.phone}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Button */}
          <button className="mt-6 w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition">
            View Branch Locations
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisaInfo;
