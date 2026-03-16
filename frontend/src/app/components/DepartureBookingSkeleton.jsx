const DepartureBookingSkeleton = () => {
  return (
    <section className="py-10 bg-gray-100 animate-pulse">
      <div className="max-w-6xl mx-auto px-4">
        {/* Intro Skeleton */}
        <div className="mb-6 space-y-2">
          <div className="h-5 bg-gray-300 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE – Departure Cards Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white p-4 rounded-xl shadow border border-gray-200"
              >
                <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE – Booking Summary Skeleton */}
          <div className="bg-white p-5 rounded-xl shadow border border-gray-200 col-span-1 md:col-span-1 lg:col-span-1 space-y-4">
            {/* Title */}
            <div className="h-5 bg-gray-300 rounded w-1/2"></div>

            {/* Summary Rows */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
              </div>
            ))}

            {/* Price */}
            <div className="pt-4 border-t border-dashed">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
              <div className="h-6 bg-gray-400 rounded w-1/2"></div>
            </div>

            {/* Button */}
            <div className="h-10 bg-gray-400 rounded-lg mt-4"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartureBookingSkeleton;
