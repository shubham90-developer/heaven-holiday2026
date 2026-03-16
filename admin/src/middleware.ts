import { NextRequest, NextResponse } from "next/server";

// route → permission key mapping
const routePermissions: Record<string, string> = {
  "/dashboard": "dashboard:view",
  "/pages/hero-banner": "hero:view",
  "/pages/users": "users:view",
  "/pages/about-us/about-us": "about-us:view",
  "/pages/about-us/principles": "principles:view",
  "/pages/about-us/services": "services:view",
  "/pages/about-us/gallery": "gallery:view",
  "/pages/about-us/footer-info": "footer-info:view",
  "/pages/about-us/join-us": "join-us:view",
  "/pages/about-us/reviews": "reviews:view",
  "/pages/about-us/contact": "contact:view",
  "/pages/csr-policy/preamble": "preamble:view",
  "/pages/csr-policy/managementPhilosophy": "management-philosophy:view",
  "/pages/csr-policy/purposePolicy": "purpose-policy:view",
  "/pages/csr-policy/faq": "csr-faq:view",
  "/pages/tour-manager/tour-manager": "tour-manager:view",
  "/pages/tour-manager/tour-manager-team": "tour-manager-team:view",
  "/pages/tour-manager/trending-destinations": "trending-destinations:view",
  "/pages/tour-manager/tours-gallery": "tours-gallery:view",
  "/pages/tour-manager/tour-includes": "tour-includes:view",
  "/pages/tour-manager/tour-packages": "tour-packages:view",
  "/pages/tour-bookings": "tour-bookings:view",
  "/pages/travel-deals/hero-banner": "travel-deals-hero:view",
  "/pages/travel-deals/holiday-section": "holiday-section:view",
  "/pages/travel-deals/banners": "offer-banners:view",
  "/pages/online-booking/steps": "online-booking:view",
  "/pages/become-sales-partner/steps": "sales-partner-steps:view",
  "/pages/become-sales-partner/become-partner": "become-partner:view",
  "/pages/become-sales-partner/enquiries": "partner-enquiries:view",
  "/pages/enquiries": "enquiries:view",
  "/pages/offer-banner/offer": "offer-banner:view",
  "/pages/podcasts": "podcasts:view",
  "/pages/books": "books:view",
  "/pages/blogs/blogs": "blogs:view",
  "/pages/blogs/video-blogs": "video-blogs:view",
  "/pages/team": "team:view",
  "/pages/careers/careersHeader": "careers-header:view",
  "/pages/careers/job-openings": "job-openings:view",
  "/pages/careers/hiring": "hiring:view",
  "/pages/careers/empowering-women": "empowering-women:view",
  "/pages/careers/excited-to-work": "excited-to-work:view",
  "/pages/careers/job-applications": "job-applications:view",
  "/pages/contact-office/office": "contact-office:view",
  "/pages/contact-office/contact-city": "contact-city:view",
  "/pages/contact-office/contact-info": "contact-info:view",
  "/pages/corporate-travel": "corporate-travel:view",
  "/pages/singapore-visa": "singapore-visa:view",
  "/pages/FAQ/faq": "faq:view",
  "/pages/counter": "counter:view",
  "/pages/annual-return": "annual-return:view",
  "/pages/privacy-policy": "privacy-policy:view",
  "/pages/terms&conditions": "terms-conditions:view",
  "/pages/settings": "settings:view",
  "/pages/role-management": "role-management:view",
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get("adminToken")?.value;
  const permissions = req.cookies.get("adminPermissions")?.value;
  const pathname = req.nextUrl.pathname;
  // ADD THESE LOGS
  console.log("PATHNAME →", pathname);
  console.log("PERMISSIONS COOKIE →", permissions);
  console.log(
    "PARSED PERMISSIONS →",
    permissions ? JSON.parse(permissions) : [],
  );
  console.log("REQUIRED PERMISSION →", routePermissions[pathname]);
  const isAuthPage = pathname.startsWith("/auth");
  const isRoot = pathname === "/";

  // ─── EXISTING LOGIC (untouched) ──────────────────
  if (isRoot && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isRoot && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ─── NEW PERMISSION CHECK ──────────────────────
  if (token && permissions) {
    const userPermissions: string[] = JSON.parse(permissions);

    // superadmin → bypass all checks
    if (userPermissions.includes("*")) {
      return NextResponse.next();
    }

    // check if current route needs a permission
    const requiredPermission = routePermissions[pathname];

    if (requiredPermission && !userPermissions.includes(requiredPermission)) {
      // no permission → redirect to unauthorized
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
