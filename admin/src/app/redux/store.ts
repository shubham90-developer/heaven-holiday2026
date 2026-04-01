import { configureStore } from "@reduxjs/toolkit";
import { aboutUsApi } from "./api/aboutus/aboutUsApi";
import { counterApi } from "./api/counter/counterApi";
import { heroBannerApi } from "./api/banner/hero-bannerApi";
import { galleryApi } from "./api/gallery/galleryApi";
import { principleApi } from "./api/aboutus/principlesApi";
import { servicesApi } from "./api/aboutus/servicesApi";
import { joinUsApi } from "./api/joinUs/joinUsApi";
import { contactUsApi } from "./api/aboutus/contactUsApi";
import { teamApi } from "./api/team/teamApi";
import { footerInfoApi } from "./api/aboutus/footerInfoApi";
import { tourReviewApi } from "./api/aboutus/reviewsApi";
import { preambleApi } from "./api/csrPolicy/csrPolicyApi";
import { managementApi } from "./api/csrPolicy/philosophyManageApi";
import { purposePolicyApi } from "./api/csrPolicy/purposePolicyApi";
import { contactOfficeApi } from "./api/contactOffice/contactOfficeApi";
import { cityApi } from "./api/contactCity/contactCityApi";
import { tourManagerApi } from "./api/tourManager/tourManagerHeaderApi";
import { tourManagerDirectoryApi } from "./api/tourManager/tourManagementTeamApi";
import { tourPackageApi } from "./api/tourManager/tourPackageApi";
import { offerBannerApi } from "./api/banner/offer-bennerApi";
import { trendingDestinationsApi } from "./api/tourManager/trendingDestinationsAPi";
import { podcastsApi } from "./api/podcasts/podcastsApi";
import { toursGalleryApi } from "./api/tourManager/toursGalleryApi";
import { careersApi } from "./api/careers/careersHeaderApi";
import { jobsApi, locationApi, departmentApi } from "./api/careers/jobsApi";
import { howWeHireApi } from "./api/careers/hiringApi";
import { empoweringApi } from "./api/careers/empowering-womenApi";
import { excitedToWorkApi } from "./api/careers/excitedToWorkApi";
import { faqApi } from "./api/faq/faqApi";

import { contactFeaturesApi } from "./api/contactCity/contactInfoBoxApi";
import { travelDealBannerApi } from "./api/travel-deals/main-bannerAPi";
import { holidaySectionApi } from "./api/travel-deals/travelDealsHeaderApi";
import { celebrateApi } from "./api/travel-deals/offer-bannersApi";
import { visaInfoApi } from "./api/singapore-visa/singaporevisaApi";
import { annualReturnApi } from "./api/annualReturn/annualReturnApi";
import { privacyPolicyApi } from "./api/privacy-policy/privacyPolicyApi";
import { termsConditionApi } from "./api/terms&conditions/terms&conditionsApi";
import { onlineBookingApi } from "./api/online-booking/onlineBookinApi";
import { blogApi } from "./api/blogs/blogsApi";
import { videoBlogApi } from "./api/video-blogs/videoBlogsApi";
import { enquiryApi } from "./api/enquiry/enquiryApi";
import { csrfaqApi } from "./api/csr-faq/csr-faqApi";
import { jobApplicationApi } from "./api/jobApplications/jobApplicationsApi";
import { bookApi } from "./api/books/booksApi";
import { applicationApi } from "./api/application-process/applicationProcessApi";
import { cardApi } from "./api/become-partner/becomePartnerApi";
import { becomePartnerFormApi } from "./api/become-partner/formApi";
import { includesApi } from "./api/tourManager/includes";
import { bookingApi } from "./api/bookingsApi/bookingApi";
import { brandsSectionApi } from "./api/corporate-travel/brandsApi";
import { settingsApi } from "./api/settings/settingsApi";
import { adminApi } from "./api/adminApi/authApi";
import { userApi } from "./api/users/usersApi";
import { pageTitlesApi } from "./api/titles/titlesApi";
export const store = configureStore({
  reducer: {
    [aboutUsApi.reducerPath]: aboutUsApi.reducer,
    [counterApi.reducerPath]: counterApi.reducer,
    [heroBannerApi.reducerPath]: heroBannerApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [principleApi.reducerPath]: principleApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [joinUsApi.reducerPath]: joinUsApi.reducer,
    [contactUsApi.reducerPath]: contactUsApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [footerInfoApi.reducerPath]: footerInfoApi.reducer,
    [tourReviewApi.reducerPath]: tourReviewApi.reducer,
    [preambleApi.reducerPath]: preambleApi.reducer,
    [managementApi.reducerPath]: managementApi.reducer,
    [purposePolicyApi.reducerPath]: purposePolicyApi.reducer,
    [contactOfficeApi.reducerPath]: contactOfficeApi.reducer,
    [cityApi.reducerPath]: cityApi.reducer,
    [tourManagerApi.reducerPath]: tourManagerApi.reducer,
    [tourManagerDirectoryApi.reducerPath]: tourManagerDirectoryApi.reducer,
    [tourPackageApi.reducerPath]: tourPackageApi.reducer,
    [offerBannerApi.reducerPath]: offerBannerApi.reducer,
    [trendingDestinationsApi.reducerPath]: trendingDestinationsApi.reducer,
    [podcastsApi.reducerPath]: podcastsApi.reducer,
    [toursGalleryApi.reducerPath]: toursGalleryApi.reducer,
    [careersApi.reducerPath]: careersApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [howWeHireApi.reducerPath]: howWeHireApi.reducer,
    [empoweringApi.reducerPath]: empoweringApi.reducer,
    [excitedToWorkApi.reducerPath]: excitedToWorkApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,

    [contactFeaturesApi.reducerPath]: contactFeaturesApi.reducer,
    [travelDealBannerApi.reducerPath]: travelDealBannerApi.reducer,
    [holidaySectionApi.reducerPath]: holidaySectionApi.reducer,
    [celebrateApi.reducerPath]: celebrateApi.reducer,
    [visaInfoApi.reducerPath]: visaInfoApi.reducer,
    [annualReturnApi.reducerPath]: annualReturnApi.reducer,
    [privacyPolicyApi.reducerPath]: privacyPolicyApi.reducer,
    [termsConditionApi.reducerPath]: termsConditionApi.reducer,
    [onlineBookingApi.reducerPath]: onlineBookingApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [videoBlogApi.reducerPath]: videoBlogApi.reducer,
    [enquiryApi.reducerPath]: enquiryApi.reducer,
    [csrfaqApi.reducerPath]: csrfaqApi.reducer,
    [jobApplicationApi.reducerPath]: jobApplicationApi.reducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,
    [cardApi.reducerPath]: cardApi.reducer,
    [becomePartnerFormApi.reducerPath]: becomePartnerFormApi.reducer,
    [includesApi.reducerPath]: includesApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [brandsSectionApi.reducerPath]: brandsSectionApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [pageTitlesApi.reducerPath]: pageTitlesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(aboutUsApi.middleware)
      .concat(counterApi.middleware)
      .concat(heroBannerApi.middleware)
      .concat(galleryApi.middleware)
      .concat(principleApi.middleware)
      .concat(servicesApi.middleware)
      .concat(joinUsApi.middleware)
      .concat(contactUsApi.middleware)
      .concat(teamApi.middleware)
      .concat(footerInfoApi.middleware)
      .concat(tourReviewApi.middleware)
      .concat(preambleApi.middleware)
      .concat(managementApi.middleware)
      .concat(purposePolicyApi.middleware)
      .concat(contactOfficeApi.middleware)
      .concat(cityApi.middleware)
      .concat(tourManagerApi.middleware)
      .concat(tourManagerDirectoryApi.middleware)
      .concat(tourPackageApi.middleware)
      .concat(offerBannerApi.middleware)
      .concat(trendingDestinationsApi.middleware)
      .concat(podcastsApi.middleware)
      .concat(toursGalleryApi.middleware)
      .concat(careersApi.middleware)
      .concat(jobsApi.middleware)
      .concat(departmentApi.middleware)
      .concat(locationApi.middleware)
      .concat(howWeHireApi.middleware)
      .concat(empoweringApi.middleware)
      .concat(excitedToWorkApi.middleware)
      .concat(faqApi.middleware)

      .concat(contactFeaturesApi.middleware)
      .concat(travelDealBannerApi.middleware)
      .concat(holidaySectionApi.middleware)
      .concat(celebrateApi.middleware)
      .concat(visaInfoApi.middleware)
      .concat(annualReturnApi.middleware)
      .concat(privacyPolicyApi.middleware)
      .concat(termsConditionApi.middleware)
      .concat(onlineBookingApi.middleware)
      .concat(blogApi.middleware)
      .concat(videoBlogApi.middleware)
      .concat(enquiryApi.middleware)
      .concat(csrfaqApi.middleware)
      .concat(jobApplicationApi.middleware)
      .concat(bookApi.middleware)
      .concat(applicationApi.middleware)
      .concat(cardApi.middleware)
      .concat(becomePartnerFormApi.middleware)
      .concat(includesApi.middleware)
      .concat(bookingApi.middleware)
      .concat(brandsSectionApi.middleware)
      .concat(settingsApi.middleware)
      .concat(adminApi.middleware)
      .concat(userApi.middleware)
      .concat(pageTitlesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
