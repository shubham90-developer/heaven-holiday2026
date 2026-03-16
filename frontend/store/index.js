import { configureStore } from "@reduxjs/toolkit";
import { aboutusApi } from "./aboutUsApi/aboutUsApi";
import { counterApi } from "./counterApi/counterApi";
import { teamApi } from "./teamApi/team";
import { principlesApi } from "./aboutUsApi/principlesApi";
import { servicesApi } from "./aboutUsApi/servicesApi";
import { galleryApi } from "./galleryApi/galleryApi";
import { joinUsApi } from "./aboutUsApi/joinUsApi";
import { reviewsApi } from "./reviewsApi/reviewsApi";
import { footerInfoApi } from "./footer-info/footer-infoApi";
import { footerContactApi } from "./footer-info/footer-contactApi";
import { preambleApi } from "./csrPolicy/preamble";
import { heroBannerApi } from "./heroBanner/heroBannerApi";
import { managementApi } from "./csrPolicy/philosophyApi";
import { purposePolicyApi } from "./csrPolicy/purposePolicyApi";
import { contactOfficeApi } from "./contact-office/contactOfficeApi";
import { cityApi } from "./contact-office/contactCityApi";
import { toursGalleryApi } from "./toursManagement/toursGalleryApi";
import { tourManagerDirectoryApi } from "./toursManagement/tourManagersApi";
import { tourManagerApi } from "./toursManagement/tourManagerHeader";
import { tourPackageApi } from "./toursManagement/toursPackagesApi";
import { offerBannerApi } from "./offer-banner/offer-bannerApi";
import { trendingDestinationsApi } from "./toursManagement/trendingDestinationsAPi";
import { feedbackApi } from "./reviewsFeedback/reviewsApi";
import { careersApi } from "./careers/careersHeaderApi";

import { podcastsApi } from "./podcasts/podcastApi";
import { contactFeaturesApi } from "./contact-office/contactInfoBoxApi";
import { departmentApi, jobsApi, locationApi } from "./careers/jobOpeningApi";
import { howWeHireApi } from "./careers/hiringStepsApi";
import { empoweringApi } from "./careers/empoweringWomen";
import { contactUsApi } from "./aboutUsApi/contactApi";
import { faqApi } from "./faq/faqApi";
import { travelDealBannerApi } from "./travelDealApi/banner";
import { holidaySectionApi } from "./travelDealApi/travelDealHeaderApi";
import { celebrateApi } from "./travelDealApi/offer-bannerApi";
import { visaInfoApi } from "./singaporeVisaApi/singaporevisaApi";
import { onlineBookingApi } from "./onlineBookingApi/stepsApi";
import { annualReturnApi } from "./annualReturn/annualReturnApi";
import { blogApi } from "./blogs/blogsApi";
import { videoBlogApi } from "./videoBlogs/videoBlogs";
import { enquiryApi } from "./enquiryApi/enquiryApi";
import { privacyPolicyApi } from "./privacyPolicyApi/privacyPolicyApi";
import { termsConditionApi } from "./terms&ConditionsAPi/terms&conditions";
import { csrfaqApi } from "./csr-faqApi/csrFaqAPi";
import { jobApplicationApi } from "./jobApplicationsApi/jobApplicationApi";
import { bookApi } from "./booksApi/booksApi";
import { becomePartnerFormApi } from "./becomeSalesPartner/formAPi";
import { cardApi } from "./becomeSalesPartner/cardAPi";
import { applicationApi } from "./becomeSalesPartner/applicationProcessApi";
import { commentApi } from "./commentApi/commentApi";
import { authApi } from "./authApi/authApi";
import { bookingApi } from "./bookingApi/bookingApi";
import { brandsSectionApi } from "./corporate-travel/corporate-travelApi";
import { settingsApi } from "./settings/settingsApi";
export const store = configureStore({
  reducer: {
    [aboutusApi.reducerPath]: aboutusApi.reducer,
    [counterApi.reducerPath]: counterApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [principlesApi.reducerPath]: principlesApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [joinUsApi.reducerPath]: joinUsApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [footerInfoApi.reducerPath]: footerInfoApi.reducer,
    [footerContactApi.reducerPath]: footerContactApi.reducer,
    [preambleApi.reducerPath]: preambleApi.reducer,
    [heroBannerApi.reducerPath]: heroBannerApi.reducer,
    [managementApi.reducerPath]: managementApi.reducer,
    [purposePolicyApi.reducerPath]: purposePolicyApi.reducer,
    [contactOfficeApi.reducerPath]: contactOfficeApi.reducer,
    [cityApi.reducerPath]: cityApi.reducer,
    [toursGalleryApi.reducerPath]: toursGalleryApi.reducer,
    [tourManagerApi.reducerPath]: tourManagerApi.reducer,
    [tourPackageApi.reducerPath]: tourPackageApi.reducer,
    [offerBannerApi.reducerPath]: offerBannerApi.reducer,
    [trendingDestinationsApi.reducerPath]: trendingDestinationsApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [careersApi.reducerPath]: careersApi.reducer,
    [podcastsApi.reducerPath]: podcastsApi.reducer,
    [tourManagerDirectoryApi.reducerPath]: tourManagerDirectoryApi.reducer,
    [contactFeaturesApi.reducerPath]: contactFeaturesApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
    [howWeHireApi.reducerPath]: howWeHireApi.reducer,
    [empoweringApi.reducerPath]: empoweringApi.reducer,
    [contactUsApi.reducerPath]: contactUsApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
    [travelDealBannerApi.reducerPath]: travelDealBannerApi.reducer,
    [holidaySectionApi.reducerPath]: holidaySectionApi.reducer,
    [celebrateApi.reducerPath]: celebrateApi.reducer,
    [visaInfoApi.reducerPath]: visaInfoApi.reducer,
    [onlineBookingApi.reducerPath]: onlineBookingApi.reducer,
    [annualReturnApi.reducerPath]: annualReturnApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [videoBlogApi.reducerPath]: videoBlogApi.reducer,
    [enquiryApi.reducerPath]: enquiryApi.reducer,
    [privacyPolicyApi.reducerPath]: privacyPolicyApi.reducer,
    [termsConditionApi.reducerPath]: termsConditionApi.reducer,
    [csrfaqApi.reducerPath]: csrfaqApi.reducer,
    [jobApplicationApi.reducerPath]: jobApplicationApi.reducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [becomePartnerFormApi.reducerPath]: becomePartnerFormApi.reducer,
    [cardApi.reducerPath]: cardApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [brandsSectionApi.reducerPath]: brandsSectionApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(aboutusApi.middleware)
      .concat(counterApi.middleware)
      .concat(teamApi.middleware)
      .concat(principlesApi.middleware)
      .concat(servicesApi.middleware)
      .concat(galleryApi.middleware)
      .concat(joinUsApi.middleware)
      .concat(reviewsApi.middleware)
      .concat(footerInfoApi.middleware)
      .concat(footerContactApi.middleware)
      .concat(preambleApi.middleware)
      .concat(heroBannerApi.middleware)
      .concat(managementApi.middleware)
      .concat(purposePolicyApi.middleware)
      .concat(contactOfficeApi.middleware)
      .concat(cityApi.middleware)
      .concat(toursGalleryApi.middleware)
      .concat(tourManagerDirectoryApi.middleware)
      .concat(tourManagerApi.middleware)
      .concat(tourPackageApi.middleware)
      .concat(offerBannerApi.middleware)
      .concat(trendingDestinationsApi.middleware)
      .concat(feedbackApi.middleware)
      .concat(careersApi.middleware)
      .concat(podcastsApi.middleware)
      .concat(contactFeaturesApi.middleware)
      .concat(locationApi.middleware)
      .concat(departmentApi.middleware)
      .concat(jobsApi.middleware)
      .concat(howWeHireApi.middleware)
      .concat(empoweringApi.middleware)
      .concat(contactUsApi.middleware)
      .concat(faqApi.middleware)
      .concat(travelDealBannerApi.middleware)
      .concat(holidaySectionApi.middleware)
      .concat(celebrateApi.middleware)
      .concat(visaInfoApi.middleware)
      .concat(onlineBookingApi.middleware)
      .concat(annualReturnApi.middleware)
      .concat(blogApi.middleware)
      .concat(videoBlogApi.middleware)
      .concat(enquiryApi.middleware)
      .concat(privacyPolicyApi.middleware)
      .concat(termsConditionApi.middleware)
      .concat(csrfaqApi.middleware)
      .concat(jobApplicationApi.middleware)
      .concat(bookApi.middleware)
      .concat(becomePartnerFormApi.middleware)
      .concat(cardApi.middleware)
      .concat(applicationApi.middleware)
      .concat(commentApi.middleware)
      .concat(authApi.middleware)
      .concat(bookingApi.middleware)
      .concat(brandsSectionApi.middleware)
      .concat(settingsApi.middleware),
});
