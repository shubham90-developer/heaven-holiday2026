import Link from "next/link";
import React from "react";

const CustomBtn = ({ href = "", className, onClick, children }) => {
  return (
    <Link
      href={href}
      className="bg-red-700 hover:bg-red-500 text-white text-sm font-semibold px-6 py-3 rounded-md shadow"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default CustomBtn;
