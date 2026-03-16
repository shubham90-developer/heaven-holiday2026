"use client";
import React, { useState } from "react";
import {
  useGetAllCategoriesQuery,
  useGetAllFAQsQuery,
} from "../../../../store/faq/faqApi";

const FAQDataPage = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryLoading,
  } = useGetAllCategoriesQuery();

  const {
    data: faqData,
    error: faqError,
    isLoading: faqLoading,
  } = useGetAllFAQsQuery();

  // Handle loading state
  if (categoryLoading || faqLoading) {
    return (
      <div className="py-10 bg-gray-100 animate-pulse">
        <div className="w-full max-w-5xl mx-auto px-4 py-10 bg-white shadow rounded-lg">
          {/* Category Skeleton */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="h-8 w-24 bg-gray-300 rounded-full"></div>
            ))}
          </div>

          {/* FAQ Title Skeleton */}
          <div className="h-6 w-40 bg-gray-300 rounded mb-6"></div>

          {/* FAQ Items Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (categoryError || faqError) {
    return (
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-red-600">
            Failed to load FAQs. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // Extract data
  const categories = categoryData?.data || [];
  const activeCategoriesList = categories.filter((cat) => cat.isActive);
  const allFaqs = faqData?.data?.faqs || [];
  const activeFaqs = allFaqs.filter((faq) => faq.isActive);

  // Set default active category if not set
  if (activeCategory === null && activeCategoriesList.length > 0) {
    setActiveCategory(activeCategoriesList[0].category);
  }

  // Filter FAQs by active category
  const filteredFaqs = activeFaqs.filter(
    (faq) => faq.category === activeCategory,
  );

  return (
    <div className="py-10 bg-gray-100">
      <div className="w-full max-w-5xl mx-auto px-4 py-10 bg-white shadow-100">
        {/* Category Nav */}
        <div className="flex flex-wrap gap-2 mb-8">
          {activeCategoriesList.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setActiveCategory(cat.category);
                setOpenIndex(null);
              }}
              className={`px-4 py-1 text-sm rounded-full border cursor-pointer transition ${
                activeCategory === cat.category
                  ? "bg-blue-800 text-white border-blue-800"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{activeCategory}</h2>
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, i) => (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded-lg shadow-sm p-4"
                >
                  <button
                    className="w-full flex justify-between items-center cursor-pointer text-left font-medium"
                    onClick={() => toggleFAQ(i)}
                  >
                    <span>{item.question}</span>
                    <span className="ml-4">{openIndex === i ? "−" : "+"}</span>
                  </button>
                  {openIndex === i && (
                    <p
                      className="mt-2 text-sm text-gray-600"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No FAQs available for this category.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQDataPage;
