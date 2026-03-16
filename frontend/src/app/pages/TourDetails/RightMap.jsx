import { MapPin } from "lucide-react";
import React from "react";
import TourActions from "./TourActions";

const RightMap = () => {
  return (
    <>
      {/* Right: Sticky Map */}
      <div className="lg:col-span-1">
        <div className="sticky top-20">
          {/* Map Card */}
          <div className="rounded-xl p-4">
            {/* Map Preview */}
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d184425.59870086715!2d73.69814927513374!3d18.524870615022547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e1!3m2!1sen!2sin!4v1758871447447!5m2!1sen!2sin"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>

              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 px-4 py-2 rounded-lg shadow text-sm font-medium flex items-center gap-2">
                  <MapPin className="text-yellow-500 w-4 h-4" />
                  <span>Map View</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {/* Bottom Actions */}
            <TourActions />
          </div>
        </div>
      </div>
    </>
  );
};

export default RightMap;
