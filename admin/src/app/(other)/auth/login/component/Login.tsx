"use client";
import { currentYear } from "@/context/constants";
import Image from "next/image";
import { Card, Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import TextFormInput from "@/components/form/TextFormInput";
import { useGetSettingsQuery } from "@/app/redux/api/settings/settingsApi";
import { useLoginAdminMutation } from "@/app/redux/api/adminApi/authApi";

interface ToastState {
  message: string;
  type: "success" | "error";
}

const Login = () => {
  const { data, isLoading } = useGetSettingsQuery(undefined);
  const [loginAdmin, { isLoading: isLoginLoading }] = useLoginAdminMutation();
  const [toast, setToast] = useState<ToastState | null>(null);
  const router = useRouter();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const showToast = (message: string, type: "success" | "error"): void => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 1000);
  };

  if (isLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: any) => {
    try {
      const res = await loginAdmin(data).unwrap();

      Cookies.set("adminToken", res.data.token, { expires: 7 });
      const decoded: any = jwtDecode(res.data.token);
      Cookies.set("adminPermissions", JSON.stringify(decoded.permissions), {
        expires: 7,
      });
      Cookies.set("adminRole", decoded.role, { expires: 7 });

      showToast("Login successful! Redirecting...", "success");

      // ADD THIS → smart redirect based on permissions
      if (
        decoded.permissions.includes("*") ||
        decoded.permissions.includes("dashboard:view")
      ) {
        router.push("/dashboard");
      } else {
        // redirect to first permitted route
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
          "/pages/csr-policy/managementPhilosophy":
            "management-philosophy:view",
          "/pages/csr-policy/purposePolicy": "purpose-policy:view",
          "/pages/csr-policy/faq": "csr-faq:view",
          "/pages/tour-manager/tour-manager": "tour-manager:view",
          "/pages/tour-manager/tour-manager-team": "tour-manager-team:view",
          "/pages/tour-manager/trending-destinations":
            "trending-destinations:view",
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

        const firstRoute = Object.entries(routePermissions).find(
          ([, permission]) => decoded.permissions.includes(permission),
        );
        router.push(firstRoute ? firstRoute[0] : "/unauthorized");
      }
    } catch (error: any) {
      const message = error?.data?.message || "Login failed";
      if (message.includes("Invalid email or password")) {
        showToast("Invalid email or password", "error");
      } else if (message.includes("not found")) {
        showToast("Admin not found", "error");
      } else {
        showToast(message, "error");
      }
    }
  };

  return (
    <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
      <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
        <Col xl={4} lg={5} md={6}>
          <Card className="overflow-hidden text-center h-100 p-xxl-4 p-3 mb-0">
            {/* Toast */}
            {toast && (
              <div
                className={`position-fixed top-0 start-50 translate-middle-x mt-3 px-4 py-2 rounded text-white text-sm fw-medium z-3 ${
                  toast.type === "success" ? "bg-success" : "bg-danger"
                }`}
              >
                {toast.message}
              </div>
            )}

            <a href="/" className="auth-brand mb-4">
              <Image
                src={data?.data?.companyLogo}
                alt="dark logo"
                height={26}
                width={26}
                className="logo-dark"
              />
              <Image
                src={data?.data?.companyLogo}
                alt="logo light"
                height={26}
                width={26}
                className="logo-light"
              />
            </a>
            <h4 className="fw-semibold mb-2 fs-18">Log in to your account</h4>
            <p className="text-muted mb-4">
              Enter your email address and password to access admin panel.
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              action="/"
              className="text-start mb-3"
            >
              <div className="mb-3">
                <TextFormInput
                  control={control}
                  name="email"
                  placeholder="Enter your email"
                  className="bg-light bg-opacity-50 border-light py-2"
                  label="Email"
                />
              </div>
              <div className="mb-3">
                <TextFormInput
                  control={control}
                  name="password"
                  placeholder="Enter your password"
                  className="bg-light bg-opacity-50 border-light py-2"
                  label="Password"
                />
              </div>
              <div className="d-grid">
                <button
                  disabled={isLoginLoading}
                  className="btn btn-primary fw-semibold"
                  type="submit"
                >
                  {isLoginLoading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
            <p className="mt-auto mb-0">
              {currentYear} © HeavenHoliday - By{" "}
              <span className="fw-bold text-decoration-underline text-uppercase text-reset fs-12">
                HeavenHoliday
              </span>
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
