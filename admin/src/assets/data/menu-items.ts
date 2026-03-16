import { MenuItemType } from "@/types/menu";

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: "navigation",
    label: "Navigation",
    isTitle: true,
  },
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "tabler:dashboard",
    url: "/dashboard",
  },

  {
    key: "hero",
    label: "Hero Banner",
    icon: "tabler:photo",
    url: "/pages/hero-banner",
  },
  {
    key: "users",
    label: "All Users",
    icon: "tabler:users",
    url: "/pages/users",
  },

  // Content Management
  {
    key: "about-us",
    label: "About Us",
    icon: "tabler:info-circle",
    children: [
      {
        key: "about-us",
        label: "About Us",
        url: "/pages/about-us/about-us",
      },
      {
        key: "principles",
        label: "Principles",
        url: "/pages/about-us/principles",
      },
      {
        key: "services",
        label: "Services",
        url: "/pages/about-us/services",
      },
      {
        key: "gallery",
        label: "Gallery",
        url: "/pages/about-us/gallery",
      },
      {
        key: "footer-info",
        label: "Footer Info",
        url: "/pages/about-us/footer-info",
      },
      {
        key: "join us",
        label: "Join Us",
        url: "/pages/about-us/join-us",
      },
      {
        key: "reviews",
        label: "Reviews",
        url: "/pages/about-us/reviews",
      },
      {
        key: "contact",
        label: "Contact",
        url: "/pages/about-us/contact",
      },
    ],
  },

  {
    key: "csr-policy",
    label: "CSR Policy",
    icon: "tabler:heart-handshake",
    children: [
      {
        key: "preamble",
        label: "Preamble",
        url: "/pages/csr-policy/preamble",
      },
      {
        key: "management-philosophy",
        label: "Management Philosophy",
        url: "/pages/csr-policy/managementPhilosophy",
      },
      {
        key: "purpose-policy",
        label: "Purpose Policy",
        url: "/pages/csr-policy/purposePolicy",
      },
      {
        key: "faq",
        label: "FAQ",
        url: "/pages/csr-policy/faq",
      },
    ],
  },

  // Tours & Packages
  {
    key: "tour-manager",
    label: "Tour Management",
    icon: "tabler:plane",
    children: [
      {
        key: "tour-manager-header",
        label: "Tour Manager Header",
        url: "/pages/tour-manager/tour-manager",
      },
      {
        key: "tour-manager-directory",
        label: "Tour Manager Team",
        url: "/pages/tour-manager/tour-manager-team",
      },
      {
        key: "trending-destinations",
        label: "Trending Destinations",
        url: "/pages/tour-manager/trending-destinations",
      },
      {
        key: "tours-gallery",
        label: "Tours Gallery",
        url: "/pages/tour-manager/tours-gallery",
      },
      {
        key: "tours-includes",
        label: "Tours Includes",
        url: "/pages/tour-manager/tour-includes",
      },
    ],
  },

  {
    key: "tour-packages",
    label: "Tour Packages",
    icon: "tabler:package",
    url: "/pages/tour-manager/tour-packages",
  },
  {
    key: "bookings",
    label: "Tour Bookings",
    icon: "tabler:package",
    url: "/pages/tour-bookings",
  },

  {
    key: "travel-deals",
    label: "Travel Deals",
    icon: "tabler:discount",
    children: [
      {
        key: "travel-deals-hero",
        label: "Hero Banner",
        url: "/pages/travel-deals/hero-banner",
      },
      {
        key: "holiday-section",
        label: "Holiday Section",
        url: "/pages/travel-deals/holiday-section",
      },
      {
        key: "offer-banners",
        label: "Offer Banners",
        url: "/pages/travel-deals/banners",
      },
    ],
  },

  // Booking & Enquiries
  {
    key: "online-booking",
    label: "Online Booking",
    icon: "tabler:calendar-check",
    children: [
      {
        key: "online-booking-steps",
        label: "Booking Steps",
        url: "/pages/online-booking/steps",
      },
    ],
  },
  {
    key: "become sales partner",
    label: "Become Sales Partner",
    icon: "tabler:calendar-check",
    children: [
      {
        key: "online-booking-steps",
        label: "Booking Steps",
        url: "/pages/become-sales-partner/steps",
      },
      {
        key: "become-partner",
        label: "Become Partner",
        url: "/pages/become-sales-partner/become-partner",
      },
      {
        key: "become-partner",
        label: "Become Partner Enquiries",
        url: "/pages/become-sales-partner/enquiries",
      },
    ],
  },

  {
    key: "enquiries",
    label: "Enquiries",
    icon: "tabler:message-circle",
    url: "/pages/enquiries",
  },

  // Banners & Media
  {
    key: "offer-banner",
    label: "Offer Banner",
    icon: "tabler:ad",
    url: "/pages/offer-banner/offer",
  },

  {
    key: "podcasts",
    label: "Podcasts",
    icon: "tabler:microphone",
    url: "/pages/podcasts",
  },

  {
    key: "books",
    label: "Books",
    icon: "tabler:microphone",
    url: "/pages/books",
  },

  {
    key: "blogs",
    label: "Blogs",
    icon: "tabler:article",
    children: [
      {
        key: "blogs",
        label: "Blogs",
        url: "/pages/blogs/blogs",
      },
      {
        key: "video-blogs",
        label: "Video Blogs",
        url: "/pages/blogs/video-blogs",
      },
    ],
  },

  // Team & Careers
  {
    key: "team",
    label: "Team",
    icon: "tabler:users",
    url: "/pages/team",
  },

  {
    key: "careers",
    label: "Careers",
    icon: "tabler:briefcase",
    children: [
      {
        key: "careers-header",
        label: "Careers Header",
        url: "/pages/careers/careersHeader",
      },
      {
        key: "job-openings",
        label: "Job Openings",
        url: "/pages/careers/job-openings",
      },
      {
        key: "hiring",
        label: "Hiring Process",
        url: "/pages/careers/hiring",
      },
      {
        key: "empowering-women",
        label: "Empowering Women",
        url: "/pages/careers/empowering-women",
      },
      {
        key: "excited-to-work",
        label: "Excited to Work",
        url: "/pages/careers/excited-to-work",
      },
      {
        key: "job-applications",
        label: "Job Applications",
        url: "/pages/careers/job-applications",
      },
    ],
  },

  // Contact & Office
  {
    key: "contact-office",
    label: "Contact Office",
    icon: "tabler:building",
    url: "/pages/contact-office/office",
  },

  {
    key: "contact-city",
    label: "Contact City",
    icon: "tabler:map-pin",
    url: "/pages/contact-office/contact-city",
  },

  {
    key: "contact-info-box",
    label: "Contact Info Box",
    icon: "tabler:info-square",
    url: "/pages/contact-office/contact-info",
  },
  {
    key: "corporate-travel",
    label: "Corporate Travel",
    icon: "tabler:info-square",
    url: "/pages/corporate-travel",
  },

  // Services & Info
  {
    key: "singapore-visa",
    label: "Singapore Visa",
    icon: "tabler:report",
    url: "/pages/singapore-visa",
  },

  {
    key: "FAQ",
    label: "FAQ",
    icon: "tabler:help-circle",
    url: "/pages/FAQ/faq",
  },

  {
    key: "counter",
    label: "Counter",
    icon: "tabler:numbers",
    url: "/pages/counter",
  },

  // Legal & Compliance
  {
    key: "annual-return",
    label: "Annual Return",
    icon: "tabler:report",
    url: "/pages/annual-return",
  },

  {
    key: "privacy-policy",
    label: "Privacy Policy",
    icon: "tabler:shield-lock",
    url: "/pages/privacy-policy",
  },

  {
    key: "terms-conditions",
    label: "Terms & Conditions",
    icon: "tabler:file-text",
    url: "/pages/terms&conditions",
  },
  {
    key: "General-settings",
    label: "General Settings",
    icon: "tabler:settings",
    url: "/pages/settings",
  },
  {
    key: "role-management",
    label: "Role Management",
    icon: "tabler:shield",
    url: "/pages/role-management",
  },
];
