"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function Forex() {
  return (
    <div className="w-full lg:w-[650] bg-white px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* ---------- Left Side ---------- */}
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-md font-semibold text-blue-800">
            BUY & SELL FOREIGN CURRENCY
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src="/forex-2.svg"
            alt="US Dollar"
            width={35}
            height={35}
            className="object-contain"
          />
          <p className="text-sm font-medium text-gray-600">US Dollar $</p>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src="/forex-3.svg"
            alt="Euro"
            width={35}
            height={35}
            className="object-contain"
          />
          <p className="text-sm font-medium text-gray-600">EUR - Euro $</p>
        </div>

        <p className="italic text-sm text-gray-500 mt-2 ">
          &nbsp;&nbsp;and more…
        </p>

        <Link
          href="#"
          className="flex items-center text-blue-700 text-sm font-medium hover:underline mt-1"
        >
          All your FOREX needs taken care of <FiArrowRight className="ml-1" />
        </Link>
      </div>

      {/* ---------- Right Side ---------- */}
      <div className="flex flex-col space-y-6 mt-12 md:mt-20">
        <div className="flex items-center gap-3">
          <Image
            src="/forex-4.svg"
            alt="AED - UAE Dirham"
            width={35}
            height={35}
            className="object-contain"
          />
          <p className="text-sm font-medium text-gray-600">
            AED - UAE Dirham $
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src="/forex-4.svg"
            alt="GBP - British Pound"
            width={35}
            height={35}
            className="object-contain"
          />
          <p className="text-sm font-medium text-gray-600">
            GBP - British Pound £
          </p>
        </div>
      </div>
    </div>
  );
}
