"use client";
import React, { useState } from "react";

const accordions = [
  {
    title: "How to Buy",
    steps: [
      { icon: "/assets/img/gift-cards/i1.svg", title: "Pick an occasion" },
      {
        icon: "/assets/img/gift-cards/i2.svg",
        title: "Choose the amount and add your message",
      },
      {
        icon: "/assets/img/gift-cards/i3.svg",
        title: "Enter sender and recipient details with delivery info",
      },
      {
        icon: "/assets/img/gift-cards/i4.svg",
        title: "That’s it—your Gift Card is ready!",
      },
    ],
  },
  {
    title: "How to Redeem",
    steps: [
      {
        icon: "/assets/img/gift-cards/i6.svg",
        title: "Pick your tour",
        desc: "Choose any Heaven Holiday group tour or customised holiday",
      },
      {
        icon: "/assets/img/gift-cards/i7.svg",
        title: "Share your gift card code",
        desc: "Apply it online or at any Heaven Holiday office",
      },
      {
        icon: "/assets/img/gift-cards/i8.svg",
        title: "Verify with OTP",
        desc: "You will receive a one-time code on your email and mobile",
      },
      {
        icon: "/assets/img/gift-cards/i9.svg",
        title: "Pay the balance, if any",
        desc: "The gift card amount is deducted from your tour price!",
      },
    ],
    footer: (
      <p className="text-xs mt-2">
        To know more,{" "}
        <a href="#" className="text-blue-600 font-medium">
          Call us
        </a>{" "}
        or{" "}
        <a
          href="mailto:guestconnect@heavenHolidaycom"
          className="text-blue-600 font-medium"
        >
          Email us
        </a>
      </p>
    ),
  },
  {
    title: "Instant Delivery",
    steps: [
      {
        icon: "/assets/img/gift-cards/i10.svg",
        title:
          "Gift cards are delivered instantly via WhatsApp and email right after purchase.",
      },
      {
        icon: "/assets/img/gift-cards/i9.svg",
        title: "You can also schedule delivery for a later date and time",
      },
      {
        icon: "/assets/img/gift-cards/i8.svg",
        title: "Perfect for thoughtful, last-minute gifting!",
      },
    ],
  },
];

const GiftSteps = () => {
  const [openStep, setOpenStep] = useState(0);

  return (
    <div className="md:w-1/4 w-full space-y-4">
      {/* Accordions */}
      <div className="space-y-2  py-3 px-2 border rounded-lg border-gray-300 bg-white">
        {accordions.map((item, idx) => (
          <div key={idx} className="overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => setOpenStep(openStep === idx ? null : idx)}
              className="w-full flex justify-between items-center p-3 text-sm font-bold bg-gray-50 cursor-pointer"
            >
              {item.title}
              <span>{openStep === idx ? "−" : "+"}</span>
            </button>

            {/* Accordion Body */}
            {openStep === idx && (
              <div className="p-4 space-y-3">
                {item.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-3">
                    <img src={step.icon} alt="" className="w-6 h-6" />
                    <div className="text-xs text-gray-700">
                      <p className="font-medium">{step.title}</p>
                      {step.desc && (
                        <p className="text-gray-500">{step.desc}</p>
                      )}
                    </div>
                  </div>
                ))}
                {item.footer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Corporate Gifting Card */}
      <div className="border rounded-lg overflow-hidden shadow-sm">
        {/* Header with background image */}
        <div
          className="bg-cover bg-center p-3"
          style={{
            backgroundImage: "url('/assets/img/gift-cards/1.avif')",
          }}
        >
          <h4 className="text-xs font-semibold text-yellow-400 drop-shadow mb-1">
            Corporate Gifting
          </h4>
          <p className="text-md font-medium text-yellow-400 drop-shadow">
            Travel is the New Bonus
          </p>
        </div>

        {/* Content */}
        <div className="p-4 bg-yellow-50">
          <ul className="list-disc ml-4 space-y-1 text-xs text-gray-600">
            <li>
              Gift your team, clients, or partners a travel memory they will
              cherish.
            </li>
            <li>
              Recipients can choose from a wide range of tours across India and
              the world.
            </li>
            <li>
              Ideal for rewards, milestones, retirement gifts, festivals, and
              client appreciation.
            </li>
          </ul>
          <button className="mt-3 cursor-pointer text-blue-800 text-xs font-bold hover:underline">
            Buy Corporate Gift Card →
          </button>
        </div>
      </div>

      {/* Contact Form */}
      <div className="border rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-semibold text-gray-800">
          Get in touch with us
        </h4>
        <input
          type="text"
          placeholder="Name*"
          className="w-full border p-2 rounded text-xs"
        />
        <div className="flex gap-2">
          <select className="border p-2 rounded text-xs w-16">
            <option>+91</option>
          </select>
          <input
            type="text"
            placeholder="Mobile Number"
            className="w-full border p-2 rounded text-xs"
          />
        </div>
        <input
          type="email"
          placeholder="Email ID"
          className="w-full border p-2 rounded text-xs"
        />
        <button className="w-full cursor-pointer bg-red-700 hover:bg-red-500 text-white font-medium text-xs py-2 rounded">
          Request Call Back
        </button>

        <div className="text-xs text-gray-600 mt-2">
          <p>
            Call 📞{" "}
            <span className="font-medium text-black">+91 8291979222</span>
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:guestconnect@heavenHolidaycom"
              className="text-blue-600"
            >
              guestconnect@heavenHolidaycom
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GiftSteps;
