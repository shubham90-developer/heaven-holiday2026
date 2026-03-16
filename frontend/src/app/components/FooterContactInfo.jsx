"use client";

import React from "react";
import {
  Building2,
  Phone,
  Mail,
  Share2,
  Facebook,
  Youtube,
  Linkedin,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import { useGetFooterContactApiQuery } from "../../../store/footer-info/footer-contactApi";

const FooterContactInfo = () => {
  const { data, isLoading, error } = useGetFooterContactApiQuery();

  // Use empty defaults to avoid hydration mismatch
  const response = data?.data || {
    offices: { title: "", description: "", mapLink: "#" },
    callUs: { title: "", phoneNumbers: ["", ""] },
    writeToUs: { title: "", emails: ["", ""] },
    socialLinks: { facebook: "#", youtube: "#", linkedin: "#", instagram: "#" },
  };

  // Skeleton Loader
  if (isLoading) {
    return (
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              <div className="h-3 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-3 w-4/6 bg-gray-200 rounded"></div>
              <div className="flex gap-2 mt-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-8 w-8 bg-gray-200 rounded-full"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-red-600">
            Failed to load contact info. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700">
        {/* Our Offices */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-gray-800" />
            <h3 className="font-semibold text-lg">{response.offices.title}</h3>
          </div>
          <p
            className="text-xs mb-2"
            dangerouslySetInnerHTML={{ __html: response.offices.description }}
          ></p>
          <Link
            href={response.offices.mapLink}
            className="text-blue-800 font-semibold hover:underline"
          >
            Locate Us
          </Link>
        </div>

        {/* Call Us */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-5 h-5 text-gray-800" />
            <h3 className="font-semibold text-lg">{response.callUs.title}</h3>
          </div>
          <p className="text-xs mb-2">
            Request a quote or chat – we’re here to help anytime!
          </p>
          {response.callUs.phoneNumbers.map((phone, idx) => (
            <Link
              key={idx}
              href={`tel:${phone}`}
              className="text-blue-800 font-semibold hover:underline mr-2"
            >
              {phone || "-"}
            </Link>
          ))}
        </div>

        {/* Write to Us */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-gray-800" />
            <h3 className="font-semibold text-lg">
              {response.writeToUs.title}
            </h3>
          </div>
          <p className="text-sm mb-2">We’re always happy to help!</p>
          {response.writeToUs.emails.map((email, idx) => (
            <p key={idx} className="text-xs">
              <Link
                href={`mailto:${email}`}
                className="text-blue-800 font-semibold hover:underline"
              >
                {email || "-"}
              </Link>
            </p>
          ))}
        </div>

        {/* Connect with Us */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="w-5 h-5 text-gray-800" />
            <h3 className="font-semibold text-lg">Connect with us</h3>
          </div>
          <p className="text-xs mb-4">Reviews, podcasts, blogs and more...</p>
          <div className="flex gap-3">
            <Link
              href={response.socialLinks.facebook}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-600"
            >
              <Facebook className="w-4 h-4" />
            </Link>
            <Link
              href={response.socialLinks.youtube}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-600"
            >
              <Youtube className="w-4 h-4" />
            </Link>
            <Link
              href={response.socialLinks.linkedin}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-600"
            >
              <Linkedin className="w-4 h-4" />
            </Link>
            <Link
              href={response.socialLinks.instagram}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-600"
            >
              <Instagram className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterContactInfo;
