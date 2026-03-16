"use client";

const NeedToKnow = ({ tourData }) => {
  // Helper function to parse HTML content and render it
  const parseHTMLContent = (htmlString) => {
    if (!htmlString) return null;

    return (
      <div
        dangerouslySetInnerHTML={{ __html: htmlString }}
        className="prose prose-sm max-w-none"
      />
    );
  };

  // Check if we have needToKnow data
  const hasNeedToKnowData = tourData?.needToKnow;

  return (
    <section className="py-10 lg:px-0 px-4" id="know">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800">Need to Know</h2>
        <p className="text-gray-500 italic mb-6">
          Things to consider before the trip!
        </p>

        {hasNeedToKnowData ? (
          // Render dynamic content from tourData
          <div className="text-gray-700 text-sm">
            {parseHTMLContent(tourData.needToKnow)}
          </div>
        ) : (
          // Fallback to default content
          <>
            {/* Weather */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Weather</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                <li>Hot &amp; humid</li>
                <li>
                  For detailed Information about weather kindly visit{" "}
                  <a
                    href="https://www.accuweather.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-800 underline"
                  >
                    www.accuweather.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Transport */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Transport</h3>

              <h4 className="text-gray-700 font-medium mb-1">Air Travel:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm mb-3">
                <li>
                  Mumbai - Johannesburg//Johannesburg - Port Elizabeth//Cape
                  Town - Victoria Falls//Victoria Falls - Nairobi//Nairobi -
                  Mumbai
                </li>
              </ul>

              <h4 className="text-gray-700 font-medium mb-1">Coach Travel</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                <li>A/C coach - Seating capacity depends upon group size</li>
              </ul>
            </div>

            {/* Documents Required */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Documents Required for Travel
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                <li>
                  Original passport with minimum 6 months validity from the date
                  of tour arrival along with sufficient blank pages for the
                  stamping of visa
                </li>
                <li>A valid Tourist Visa for the duration of the tour</li>
                <li>
                  For all Schengen countries passport validity should not exceed
                  more than 10 years
                </li>
                <li>Handwritten passport is not acceptable</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NeedToKnow;
