import Image from "next/image";
import React from "react";

const MyHolidayRightCart = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-300 pb-3 mb-6">
        <h2 className="font-semibold text-lg text-gray-800">My Holiday Cart</h2>
        <p className="text-gray-600 text-sm">
          Your pending bookings are shown here
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-6">
          <Image
            src="/assets/img/my-booking/3.svg"
            alt="Holiday Illustration"
            width={140}
            height={140}
            className="object-contain"
          />
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-1">
              No Ongoing Bookings
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3 max-w-md">
              You can find your bookings which are incomplete due to any errors
              and continue the booking process here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyHolidayRightCart;
