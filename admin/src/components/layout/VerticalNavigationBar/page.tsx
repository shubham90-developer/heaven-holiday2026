"use client";
import LogoBox from "@/components/LogoBox";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import SimplebarReactClient from "@/components/wrappers/SimplebarReactClient";
import { useLayoutContext } from "@/context/useLayoutContext";
import { getMenuItems } from "@/helpers/Manu";
import AppMenu from "./components/AppMenu";
import HoverMenuToggle from "./components/HoverMenuToggle";
import Cookies from "js-cookie";
import { MenuItemType } from "@/types/menu";

const VerticalNavigationBar = () => {
  const allMenuItems = getMenuItems();

  // ─── PERMISSION FILTERING ──────────────────────────────
  const permissionsCookie = Cookies.get("adminPermissions");
  const userPermissions: string[] = permissionsCookie
    ? JSON.parse(permissionsCookie)
    : [];

  const isSuperAdmin = userPermissions.includes("*");

  const routePermissions: Record<string, string> = {
    "/dashboard": "dashboard:view",
    "/pages/hero-banner": "hero:view",
    "pages/users": "users:view",
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

  const filterMenuItems = (items: MenuItemType[]): MenuItemType[] => {
    return items
      .map((item) => {
        // title items always show
        if (item.isTitle) return item;

        // superadmin sees everything
        if (isSuperAdmin) return item;

        // item has children → filter children recursively
        if (item.children) {
          const filteredChildren = filterMenuItems(item.children);
          // hide parent if no children are allowed
          if (filteredChildren.length === 0) return null;
          return { ...item, children: filteredChildren };
        }

        // item has url → check permission
        if (item.url) {
          const requiredPermission = routePermissions[item.url];
          // no permission mapped → show by default
          if (!requiredPermission) return item;
          // check user has permission
          if (userPermissions.includes(requiredPermission)) return item;
          return null;
        }

        return item;
      })
      .filter(Boolean) as MenuItemType[];
  };

  const menuItems = isSuperAdmin ? allMenuItems : filterMenuItems(allMenuItems);
  // ─── END PERMISSION FILTERING ──────────────────────────

  const { toggleBackdrop } = useLayoutContext();

  return (
    <div className="sidenav-menu">
      <LogoBox />
      <HoverMenuToggle />
      <button onClick={toggleBackdrop} className="button-close-fullsidebar">
        <IconifyIcon icon="tabler:x" className="align-middle" />
      </button>
      <SimplebarReactClient data-simplebar>
        <AppMenu menuItems={menuItems} />
        <div className="clearfix" />
      </SimplebarReactClient>
    </div>
  );
};

export default VerticalNavigationBar;
