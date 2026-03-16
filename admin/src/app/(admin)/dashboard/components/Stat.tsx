"use client";
import React from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Card, CardBody, Col, Row } from "react-bootstrap";

import { useGetTourPackageCardsQuery } from "@/app/redux/api/tourManager/tourPackageApi";
import { useGetAllEnquiriesQuery } from "@/app/redux/api/enquiry/enquiryApi";
import { useGetAllBookingsQuery } from "@/app/redux/api/bookingsApi/bookingApi";
import { useGetTeamsQuery } from "@/app/redux/api/team/teamApi";
import { useGetAllOfficesQuery } from "@/app/redux/api/contactOffice/contactOfficeApi";
import { useGetAllJobApplicationsQuery } from "@/app/redux/api/jobApplications/jobApplicationsApi";

export type StatType = {
  title: string;
  icon: string;
  otherIcon: string;
  count: number | string;
  bgColor?: string;
};

const StatCard = ({ count, icon, otherIcon, title, bgColor }: StatType) => {
  return (
    <Card
      className="overflow-hidden text-black fw-bold border-0"
      style={{ backgroundColor: bgColor }}
    >
      <CardBody>
        <h5 className="fs-13 text-uppercase fw-bold">{title}</h5>

        <div className="d-flex align-items-center gap-2 my-2 py-1 position-relative">
          <div className="user-img fs-42 shrink-0">
            <span className="avatar-title bg-white text-dark rounded-circle fs-22">
              <IconifyIcon icon={icon} />
            </span>
          </div>

          <h3 className="mb-0 fw-bold">{count}</h3>

          <IconifyIcon
            icon={otherIcon}
            className="ms-auto display-1 position-absolute end-0 opacity-25 text-amber-50"
          />
        </div>
      </CardBody>
    </Card>
  );
};

const Stat = () => {
  const {
    data: tourCardsData,
    isLoading: isTourCardsLoading,
    error: isTourCardsError,
  } = useGetTourPackageCardsQuery(undefined);

  const {
    data: enquiryData,
    isLoading: isEnquiryLoading,
    error: isEnquiryError,
  } = useGetAllEnquiriesQuery(undefined);

  const {
    data: bookingsData,
    isLoading: isBookingLoading,
    error: isBookingError,
  } = useGetAllBookingsQuery(undefined);

  const {
    data: teamData,
    isLoading: isTeamLoading,
    error: isTeamError,
  } = useGetTeamsQuery(undefined);

  const {
    data: office,
    isLoading: isOfficeLoading,
    error: isOfficeError,
  } = useGetAllOfficesQuery(undefined);

  const {
    data: applications,
    isLoading: isApplicationsLoading,
    error: isApplicationsError,
  } = useGetAllJobApplicationsQuery(undefined);

  if (
    isTourCardsLoading ||
    isEnquiryLoading ||
    isBookingLoading ||
    isTeamLoading ||
    isOfficeLoading ||
    isApplicationsLoading
  ) {
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

  if (
    isTourCardsError ||
    isEnquiryError ||
    isBookingError ||
    isTeamError ||
    isOfficeError ||
    isApplicationsError
  ) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">please try again</span>
        </div>
      </div>
    );
  }

  const statData: StatType[] = [
    {
      title: "Total Bookings",
      icon: "solar:ticket-bold-duotone",
      otherIcon: "solar:calendar-bold-duotone",
      count: bookingsData?.data?.bookings?.length || 0,
      bgColor: "rgba(0,167,111,0.23)", // Indigo
    },
    {
      title: "Total Packages",
      icon: "solar:suitcase-bold-duotone",
      otherIcon: "solar:box-bold-duotone",
      count: tourCardsData?.data?.length || 0,
      bgColor: "rgb(63 75 134 / 19%)", // Green
    },
    {
      title: "Total Enquiries",
      icon: "solar:chat-round-dots-bold-duotone",
      otherIcon: "solar:letter-bold-duotone",
      count: enquiryData?.data?.length || 0,
      bgColor: "rgba(183,194,105,0.14)", // Red
    },
    {
      title: "Total Team",
      icon: "solar:users-group-rounded-bold-duotone",
      otherIcon: "solar:user-bold-duotone",
      count: teamData?.data?.length || 0,
      bgColor: "rgba(194,120,105,0.17)", // Orange
    },
    {
      title: "Total Offices",
      icon: "solar:buildings-bold-duotone",
      otherIcon: "solar:map-point-bold-duotone",
      count: office?.data?.length || 0,
      bgColor: "rgb(14 165 233 / 18%)", // Sky Blue
    },
    {
      title: "Total Job Applications",
      icon: "solar:document-text-bold-duotone",
      otherIcon: "solar:document-text-bold-duotone",
      count: applications?.data?.length || 0,
      bgColor: "rgb(147 51 234 / 18%)", // Purple
    },
  ];

  return (
    <Row className="row-cols-xxl-4 row-cols-md-3 row-cols-1 g-3">
      {statData.map((item, idx) => (
        <Col key={idx}>
          <StatCard {...item} />
        </Col>
      ))}
    </Row>
  );
};

export default Stat;
