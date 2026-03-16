"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useGetAllFAQsQuery } from "../../../../store/csr-faqApi/csrFaqAPi";

const faqs = [
  {
    question: "Policy Statement",
    answer:
      "Our Vision: The CSR Policy focuses on addressing critical social, environmental and economic needs of the underprivileged sections of the society. Through this policy, we develop our CSR strategy in a way as to enrich the quality of life of different marginalized sections of this society. In line with the above Vision, the Company particularly aims to make efforts towards self-sustainability of CSR projects and to foster a culture of CSR amongst employees, business associates and stakeholders.",
  },
  {
    question: "How do I redeem a gift card?",
    answer:
      "You can redeem the gift card by contacting Heaven Holiday directly or visiting the nearest branch office.",
  },
  {
    question: "How long is my gift card valid for?",
    answer:
      "Gift cards are valid for 12 months from the date of issue unless otherwise specified.",
  },
  {
    question:
      "Can I use my gift card with other promotional offers or discounts?",
    answer:
      "Gift cards cannot be combined with any other promotional offers or discounts.",
  },
  {
    question:
      "What happens if the cost of my travel service exceeds the balance on my gift card?",
    answer:
      "If the travel cost is higher than the gift card value, the remaining balance must be paid separately.",
  },
  {
    question: "Can I refund or exchange my gift card?",
    answer: "Gift cards are non-refundable and cannot be exchanged for cash.",
  },
  {
    question: "What should I do if my gift card is lost or stolen?",
    answer:
      "Lost or stolen gift cards cannot be replaced. Please treat your gift card like cash.",
  },
  {
    question: "Can I transfer my gift card to someone else?",
    answer:
      "Yes, gift cards are transferable. The new user must provide a No Objection Certificate (NOC) from the original receiver.",
  },
];

const Collpse = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const { data, isLoading, error } = useGetAllFAQsQuery();
  if (isLoading) {
    return <p>loading</p>;
  }
  if (error) {
    return <p>error</p>;
  }

  const faq = data?.data || [];
  const activeFaq = faq.filter((item) => {
    return item.status == "active";
  });

  return (
    <section className="py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="space-y-3">
          {activeFaq.map((faq) => (
            <div
              key={faq._id}
              className="bg-white border rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(faq._id)}
                className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-medium text-gray-800"
              >
                {faq.question}
                <ChevronDown
                  className={`h-4 w-4 transform transition-transform duration-300 ${
                    openIndex === faq._id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === faq._id && (
                <div
                  className="px-4 pb-3 text-sm text-gray-600 border-t"
                  dangerouslySetInnerHTML={{ __html: faq.answer || "" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collpse;
