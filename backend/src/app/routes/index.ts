import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes';

import { bannerRouter } from '../modules/banner/banner.routes';
import { contractRouter } from '../modules/contact/contract.routes';
import { privacyPolicyRouter } from '../modules/privacy-policy/privacy-policy.routes';

import { TermsConditionRouter } from '../modules/terms-condition/terms-condition.routes';

import { offerBannerRouter } from '../modules/offer-banner/offer-banner.routes';
import { uploadRouter } from '../modules/upload/upload.routes';

import { teamRouter } from '../modules/team/team.routes';
import { aboutusRouter } from '../modules/aboutus/aboutus.routes';
import { counterRouter } from '../modules/counter/counter.routes';
import { heroBannerRouter } from '../modules/hero-banner/bannerRoutes';
import { galleryRouter } from '../modules/Gallery/galleryRoutes';
import { principleRouter } from '../modules/principles/principlesRoutes';
import { servicesRouter } from '../modules/services/servicesRoutes';
import { joinUsRouter } from '../modules/joinOurFamily/messageRoutes';
import { contactRouter } from '../modules/contactUs/contactUsRoutes';
import { footerInfoRouter } from '../modules/footerInfo/footerInfoRoute';
import { reviewsRouter } from '../modules/reviews/reviewsRoutes';
import { preambleRouter } from '../modules/preamble/preambleRoutes';
import { philosophyRouter } from '../modules/managementPhilosophy/philosophyRoutes';
import { purposePolicyRouter } from '../modules/purposePolicy/purposePolicyRoutes';
import { contactOfficeRouter } from '../modules/contactOffice/contactOfficeRoutes';
import { contactCitiesRouter } from '../modules/contactCities/contactCities.routes';
import { tourManagerRouter } from '../modules/tourManager/tourManagerRoutes';
import { tourManagerTeamRouter } from '../modules/tourManagerDirectory/tourManagerDirectoryRoutes';
import { tourPackageRouter } from '../modules/tourPackage/tourPackageRoutes';
import { trendingDestinationsRouter } from '../modules/trendingDestinations/destinationRoutes';
import { podcastRouter } from '../modules/podcasts/podcastRoutes';
import { toursGalleryRouter } from '../modules/toursGallery/toursGalleryRoutes';
import { FeedbackRouter } from '../modules/feedBackForm/feedbackRoutes';
import { careersRouter } from '../modules/careers/careersRoutes';
import { faqRouter } from '../modules/faq/faq.routes';
import {
  DepartmentRouter,
  JobRouter,
  LocationRouter,
} from '../modules/currentOpenings/openingRoutes';
import { howWeHireRouter } from '../modules/howWeHire/hireRoutes';
import { EmpoweringRouter } from '../modules/EmpoweringWomenSection/EmpoweringRoutes';
import { excitedToWorkRouter } from '../modules/excitedToWork/excitedToWorkRoutes';

import { contactInfoBoxRouter } from '../modules/contact-info-box/infoBoxRoutes';
import { travelDealBannerRouter } from '../modules/travel-deal-hero/travelDealsRoutes';
import { travelDealsHeadingRouter } from '../modules/travel-deal-Holiday/holidayRoutes';
import { celebrateRouter } from '../modules/travel-offer-banner/offer-bannerRoutes';
import { visaInfoRouter } from '../modules/singaporeVisa/singaporeVisaRoutes';
import { annualReturnRouter } from '../modules/annulReturn/returnRoutes';
import { onlineBookingRouter } from '../modules/booking/bookingRoutes';
import { blogsRouter } from '../modules/blogs/blogsRoutes';
import { videoBlogRouter } from '../modules/videoBlogs/videoBlogRoutes';
import { enquiryRouter } from '../modules/enquiry/enquiryRoutes';
import { CSRFAQRouter } from '../modules/csrFaq/faqRoutes';
import { JobApplicationRouter } from '../modules/jobApplications/applicationRoutes';
import { booksRouter } from '../modules/books/booksRoutes';
import { applnProcessRouter } from '../modules/applProcess/applProcessRoutes';
import { becomePartnerRouter } from '../modules/salesPartner/partnerRoutes';
import { becomePartnerFormRouter } from '../modules/becomePartnerForm/formRoutes';

import { IncludedRouter } from '../modules/toursIncluded/toursIncludedRoutes';
import { bookingRouter } from '../modules/bookPackage/bookingRoutes';
import { brandsRouter } from '../modules/brands/brandsRoutes';
import { generalSettingsRouter } from '../modules/general-settings/general-settings.routes';
import { adminRouter } from '../modules/admin/adminRoutes';
import { roleRouter } from '../modules/role-management/roleRoutes';
import { TitleRouter } from '../modules/titles/routes';
const router = Router();
const moduleRoutes = [
  {
    path: '/auth',
    route: authRouter,
  },

  {
    path: '/contracts',
    route: contractRouter,
  },

  {
    path: '/banners',
    route: bannerRouter,
  },

  {
    path: '/offer-banners',
    route: offerBannerRouter,
  },

  {
    path: '/faqs',
    route: faqRouter,
  },

  {
    path: '/privacy-policy',
    route: privacyPolicyRouter,
  },

  {
    path: '/terms-conditions',
    route: TermsConditionRouter,
  },

  {
    path: '/upload',
    route: uploadRouter,
  },

  {
    path: '/teams',
    route: teamRouter,
  },
  {
    path: '/aboutus',
    route: aboutusRouter,
  },
  {
    path: '/counter',
    route: counterRouter,
  },
  {
    path: '/hero-banner',
    route: heroBannerRouter,
  },
  {
    path: '/gallery',
    route: galleryRouter,
  },
  {
    path: '/principles',
    route: principleRouter,
  },
  {
    path: '/services',
    route: servicesRouter,
  },
  {
    path: '/joinUs',
    route: joinUsRouter,
  },
  {
    path: '/contact-us',
    route: contactRouter,
  },
  {
    path: '/footer-info',
    route: footerInfoRouter,
  },
  {
    path: '/reviews',
    route: reviewsRouter,
  },
  {
    path: '/csr-preamble',
    route: preambleRouter,
  },
  {
    path: '/csr-management',
    route: philosophyRouter,
  },
  {
    path: '/csr-purpose-policy',
    route: purposePolicyRouter,
  },
  {
    path: '/contact-office',
    route: contactOfficeRouter,
  },
  {
    path: '/contact-city',
    route: contactCitiesRouter,
  },
  {
    path: '/tour-manager',
    route: tourManagerRouter,
  },
  {
    path: '/tour-manager-team',
    route: tourManagerTeamRouter,
  },
  {
    path: '/tour-package',
    route: tourPackageRouter,
  },
  {
    path: '/offer-banner',
    route: offerBannerRouter,
  },
  {
    path: '/trending-destinations',
    route: trendingDestinationsRouter,
  },
  {
    path: '/podcasts',
    route: podcastRouter,
  },
  {
    path: '/tours-gallery',
    route: toursGalleryRouter,
  },
  {
    path: '/reviews-feedback',
    route: FeedbackRouter,
  },
  {
    path: '/careers-header',
    route: careersRouter,
  },
  {
    path: '/careers-department',
    route: DepartmentRouter,
  },
  {
    path: '/careers-location',
    route: LocationRouter,
  },
  {
    path: '/careers-jobs',
    route: JobRouter,
  },
  {
    path: '/hiring-process',
    route: howWeHireRouter,
  },
  {
    path: '/empowering-women',
    route: EmpoweringRouter,
  },
  {
    path: '/excited-to-work',
    route: excitedToWorkRouter,
  },

  {
    path: '/contact-info-box',
    route: contactInfoBoxRouter,
  },
  {
    path: '/travel-deal',
    route: travelDealBannerRouter,
  },
  {
    path: '/travel-deal-heading',
    route: travelDealsHeadingRouter,
  },
  {
    path: '/travel-deal-offer-banners',
    route: celebrateRouter,
  },
  {
    path: '/visa-info',
    route: visaInfoRouter,
  },
  {
    path: '/annual-return',
    route: annualReturnRouter,
  },
  {
    path: '/online-booking',
    route: onlineBookingRouter,
  },
  {
    path: '/blogs',
    route: blogsRouter,
  },
  {
    path: '/video-blogs',
    route: videoBlogRouter,
  },
  {
    path: '/enquiry',
    route: enquiryRouter,
  },
  {
    path: '/csr-faq',
    route: CSRFAQRouter,
  },
  {
    path: '/job-applications',
    route: JobApplicationRouter,
  },
  {
    path: '/books',
    route: booksRouter,
  },
  {
    path: '/application-process',
    route: applnProcessRouter,
  },
  {
    path: '/become-partner',
    route: becomePartnerRouter,
  },
  {
    path: '/become-partner-form',
    route: becomePartnerFormRouter,
  },

  {
    path: '/includes',
    route: IncludedRouter,
  },
  {
    path: '/register',
    route: authRouter,
  },
  {
    path: '/booking',
    route: bookingRouter,
  },
  {
    path: '/brands',
    route: brandsRouter,
  },
  {
    path: '/settings',
    route: generalSettingsRouter,
  },
  {
    path: '/admin',
    route: adminRouter,
  },
  {
    path: '/roles',
    route: roleRouter,
  },
  {
    path: '/titles',
    route: TitleRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
