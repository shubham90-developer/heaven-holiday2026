import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportToExcel = (data: any[], fileName: string, sheetName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};

const formatDate = (date: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (price: number | undefined) => {
  return `₹${price?.toLocaleString("en-IN") || "0"}`;
};

const mapBookingForExcel = (booking: any, index: number) => ({
  "#": index + 1,
  "Booking ID": booking.bookingId || "N/A",
  "Tour Package": booking.tourPackage?.title || "N/A",
  "Lead Traveler Name": booking.leadTraveler?.name || "N/A",
  "Lead Traveler Email": booking.leadTraveler?.email || "N/A",
  "Lead Traveler Phone": booking.leadTraveler?.phone || "N/A",
  "Departure City": booking.selectedDeparture?.departureCity || "N/A",
  "Departure Date": formatDate(booking.selectedDeparture?.departureDate),
  "Package Type": booking.selectedDeparture?.packageType || "N/A",
  Adults: booking.travelerCount?.adults || 0,
  Children: booking.travelerCount?.children || 0,
  Infants: booking.travelerCount?.infants || 0,
  "Total Travelers": booking.travelerCount?.total || 0,
  "Total Amount": formatPrice(booking.pricing?.totalAmount),
  "Advance Amount": formatPrice(booking.pricing?.advanceAmount),
  "Price Per Person": formatPrice(booking.pricing?.pricePerPerson),
  "Paid Amount": formatPrice(booking.pricing?.paidAmount),
  "Pending Amount": formatPrice(booking.pricing?.pendingAmount),
  "Payment Status": booking.paymentStatus || "N/A",
  "Booking Status": booking.bookingStatus || "N/A",
  "Booked On": formatDate(booking.bookingDate),
});

const mapRefundForExcel = (refund: any, index: number) => ({
  "#": index + 1,
  "Refund ID": refund.refundId || "N/A",
  "Booking ID": refund.bookingId || "N/A",
  "User Name": refund.user?.name || "N/A",
  "User Email": refund.user?.email || "N/A",
  "User Phone": refund.user?.phone || "N/A",
  "Tour Name": refund.tourName || "N/A",
  "Refund Amount": formatPrice(refund.amount),
  "Refund Status": refund.status || "N/A",
  Reason: refund.reason || "N/A",
  "Payment ID": refund.paymentId || "N/A",
  "Requested On": formatDate(refund.requestedDate),
});

export const exportAllBookings = (bookings: any[]) => {
  const data = bookings.map((booking, index) =>
    mapBookingForExcel(booking, index),
  );
  exportToExcel(data, "all-bookings", "All Bookings");
};

export const exportCancelledBookings = (bookings: any[]) => {
  const data = bookings.map((booking, index) =>
    mapBookingForExcel(booking, index),
  );
  exportToExcel(data, "cancelled-bookings", "Cancelled Bookings");
};

export const exportPendingRefunds = (refunds: any[]) => {
  const data = refunds.map((refund, index) => mapRefundForExcel(refund, index));
  exportToExcel(data, "pending-refunds", "Pending Refunds");
};
