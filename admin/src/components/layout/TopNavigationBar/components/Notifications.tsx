"use client";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import SimplebarReactClient from "@/components/wrappers/SimplebarReactClient";
import {
  Col,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Row,
} from "react-bootstrap";
import Image from "next/image";
import { timeSince } from "@/utils/date";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useGetAllBookingsQuery } from "@/app/redux/api/bookingsApi/bookingApi";

const LAST_SEEN_KEY = "notif_lastSeenTime";
const CLEARED_AT_KEY = "notif_clearedAt";

const Notifications = () => {
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [clearedAt, setClearedAt] = useState<string | null>(null);

  useEffect(() => {
    const storedLastSeen = localStorage.getItem(LAST_SEEN_KEY);
    const storedClearedAt = localStorage.getItem(CLEARED_AT_KEY);
    setLastSeen(storedLastSeen);
    setClearedAt(storedClearedAt);
  }, []);

  const { data: bookingsData, isLoading: bookingLoading } =
    useGetAllBookingsQuery(undefined);

  const bookings = bookingsData?.data?.bookings ?? [];

  // Build combined notification list from bookings + payments
  const allNotifications: any[] = [];

  bookings.forEach((booking: any) => {
    // 1. Booking notification
    allNotifications.push({
      id: booking._id,
      type: "booking",
      userName: booking.user?.name,
      tourTitle: booking.tourPackage?.title,
      tourImage: booking.tourPackage?.galleryImages?.[0],
      bookingStatus: booking.bookingStatus,
      amount: booking.pricing?.totalAmount,
      createdAt: booking.createdAt,
    });

    // 2. Payment notifications — loop through payments array
    booking.payments?.forEach((payment: any) => {
      allNotifications.push({
        id: payment._id,
        type: "payment",
        userName: booking.user?.name,
        tourTitle: booking.tourPackage?.title,
        tourImage: booking.tourPackage?.galleryImages?.[0],
        paymentStatus: payment.paymentStatus,
        paymentMethod: payment.paymentMethod,
        amount: payment.amount,
        createdAt: payment.paymentDate,
      });
    });
  });

  // Sort all notifications newest first
  allNotifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const visibleNotifications = allNotifications.filter(
    (n) => !clearedAt || new Date(n.createdAt) > new Date(clearedAt),
  );
  const unreadCount = visibleNotifications.filter(
    (n) => !lastSeen || new Date(n.createdAt) > new Date(lastSeen),
  ).length;

  // Bell opens — only reset badge count (lastSeen), NOT clearedAt
  const handleToggle = (isOpen: boolean) => {
    if (isOpen) {
      const now = new Date().toISOString();
      localStorage.setItem(LAST_SEEN_KEY, now);
      setLastSeen(now);
    }
  };
  const handleClearAll = () => {
    const now = new Date().toISOString();
    localStorage.setItem(CLEARED_AT_KEY, now);
    localStorage.setItem(LAST_SEEN_KEY, now);
    setClearedAt(now);
    setLastSeen(now);
  };

  const hasNotifications = visibleNotifications.length > 0;

  return (
    <div className="topbar-item">
      <Dropdown align={"end"} onToggle={handleToggle}>
        <DropdownToggle
          as={"button"}
          className="topbar-link drop-arrow-none"
          data-bs-toggle="dropdown"
          data-bs-offset="0,25"
          data-bs-auto-close="outside"
          aria-haspopup="false"
          aria-expanded="false"
        >
          <IconifyIcon icon="tabler:bell" className="animate-ring fs-22" />
          {unreadCount > 0 && (
            <span className="noti-icon-badge">{unreadCount}</span>
          )}
        </DropdownToggle>

        <DropdownMenu
          className="p-0 dropdown-menu-start dropdown-menu-lg"
          style={{ minHeight: 300 }}
        >
          <div className="p-3 border-bottom border-dashed">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0 fs-16 fw-semibold">Notifications</h6>
              </Col>
            </Row>
          </div>

          <SimplebarReactClient
            className="position-relative z-2 card shadow-none rounded-0"
            style={{ maxHeight: 300 }}
          >
            {bookingLoading && (
              <div className="p-3 text-center text-muted">Loading...</div>
            )}

            {!bookingLoading &&
              hasNotifications &&
              visibleNotifications.map((notif: any) => {
                const isUnread =
                  !lastSeen || new Date(notif.createdAt) > new Date(lastSeen);

                const bookingVariant =
                  notif.bookingStatus === "Confirmed"
                    ? "success"
                    : notif.bookingStatus === "Cancelled"
                      ? "danger"
                      : "warning";

                const paymentVariant =
                  notif.paymentStatus === "Success"
                    ? "success"
                    : notif.paymentStatus === "Failed"
                      ? "danger"
                      : "warning";

                const variant =
                  notif.type === "booking" ? bookingVariant : paymentVariant;

                const icon =
                  notif.type === "booking"
                    ? "tabler:map-pin"
                    : notif.paymentStatus === "Success"
                      ? "tabler:circle-check"
                      : "tabler:circle-x";

                const message =
                  notif.type === "booking" ? (
                    <>
                      <span className="fw-semibold text-dark">
                        {notif.userName}
                      </span>{" "}
                      booked{" "}
                      <span className="fw-semibold text-dark">
                        {notif.tourTitle}
                      </span>{" "}
                      — ₹{notif.amount?.toLocaleString()}
                    </>
                  ) : (
                    <>
                      <span className="fw-semibold text-dark">
                        {notif.userName}
                      </span>{" "}
                      {notif.paymentStatus === "Success"
                        ? "paid"
                        : "payment failed"}{" "}
                      ₹{notif.amount?.toLocaleString()} via{" "}
                      {notif.paymentMethod} for{" "}
                      <span className="fw-semibold text-dark">
                        {notif.tourTitle}
                      </span>
                    </>
                  );

                const badgeLabel =
                  notif.type === "booking"
                    ? notif.bookingStatus
                    : notif.paymentStatus;

                return (
                  <div
                    className="notification-item dropdown-item py-2 text-wrap border-bottom border-dashed"
                    key={notif.id + notif.createdAt}
                    style={isUnread ? { backgroundColor: "#f0f7ff" } : {}}
                  >
                    <span className="d-flex align-items-center">
                      {notif.tourImage ? (
                        <span className="me-3 position-relative shrink-0">
                          <Image
                            src={notif.tourImage}
                            className="avatar-md rounded-circle"
                            alt="tour"
                            width={40}
                            height={40}
                            style={{ objectFit: "cover" }}
                          />
                          <span
                            className={`position-absolute rounded-pill bg-${variant} notification-badge`}
                          >
                            <IconifyIcon icon={icon} />
                          </span>
                        </span>
                      ) : (
                        <div className="avatar-md shrink-0 me-3">
                          <span
                            className={`avatar-title bg-${variant}-subtle text-${variant} rounded-circle fs-22`}
                          >
                            <IconifyIcon icon={icon} />
                          </span>
                        </div>
                      )}

                      <span className="grow text-muted">
                        {message}
                        <br />
                        <span
                          className={`badge bg-${variant}-subtle text-${variant} me-1`}
                        >
                          {badgeLabel}
                        </span>
                        <span className="fs-12">
                          {timeSince(notif.createdAt)}
                        </span>
                      </span>
                    </span>
                  </div>
                );
              })}
          </SimplebarReactClient>

          {/* Empty state */}
          {!bookingLoading && !hasNotifications && (
            <div
              style={{ height: 300 }}
              className="d-flex align-items-center justify-content-center text-center position-absolute top-0 bottom-0 start-0 end-0 z-1"
            >
              <div>
                <IconifyIcon
                  icon="line-md:bell-twotone-alert-loop"
                  className="fs-80 text-secondary mt-2"
                />
                <h4 className="fw-semibold mb-0 fst-italic lh-base mt-3">
                  Hey! 👋 <br />
                  You have no any notifications
                </h4>
              </div>
            </div>
          )}

          <Link
            href=""
            onClick={(e) => {
              e.preventDefault();
              handleClearAll();
            }}
            className="dropdown-item notification-item position-fixed z-2 bottom-0 text-center text-reset text-decoration-underline link-offset-2 fw-bold notify-item border-top border-light py-2"
          >
            Clear All
          </Link>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default Notifications;
