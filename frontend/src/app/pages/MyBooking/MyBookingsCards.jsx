"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaStar,
  FaTimes,
  FaUser,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { User, Calendar, MapPin, Users } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useGetUserBookingsQuery,
  useUpdateBookingTravelersMutation,
  useCancelBookingMutation,
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
  useHandlePaymentFailureMutation,
} from "store/bookingApi/bookingApi";
import toast from "react-hot-toast";

// ==================== EDIT BOOKING MODAL ====================
const EditBookingModal = ({ isOpen, onClose, booking }) => {
  const [
    updateBookingTravelers,
    { isLoading, isSuccess, data: updateData, reset },
  ] = useUpdateBookingTravelersMutation();

  const [openTravelerForms, setOpenTravelerForms] = useState([]);
  const [passportImages, setPassportImages] = useState({});
  const [formData, setFormData] = useState({ travelers: [] });
  const [errors, setErrors] = useState({});
  const [hasInitialized, setHasInitialized] = useState(false);
  const [roomConfig, setRoomConfig] = useState([
    { roomType: "Single", count: 0 },
    { roomType: "Double", count: 0 },
    { roomType: "Triple", count: 0 },
  ]);
  const [childOption, setChildOption] = useState(null);
  const [infantOption, setInfantOption] = useState(null);
  const [dynamicPricing, setDynamicPricing] = useState({
    totalAmount: 0,
    baseAmount: 0,
    gstAmount: 0,
    adultCost: 0,
    childCost: 0,
    infantCost: 0,
    pricePerPerson: 0,
    difference: 0,
    refundAmount: 0,
    extraToPay: 0,
    oldTotal: 0,
    tscCharge: 0,
    tscAmount: 0,
  });

  // ── INITIALIZE MODAL DATA ──
  useEffect(() => {
    if (isOpen && booking && !hasInitialized) {
      const travelers = booking.travelers.map((traveler) => ({
        type: traveler.type,
        title: traveler.title,
        firstName: traveler.firstName,
        lastName: traveler.lastName,
        dateOfBirth:
          typeof traveler.dateOfBirth === "string"
            ? traveler.dateOfBirth.split("T")[0]
            : new Date(traveler.dateOfBirth).toISOString().split("T")[0],
        age: traveler.age,
        gender: traveler.gender,
        isLeadTraveler: traveler.isLeadTraveler,
        email: traveler.email || "",
        phone: traveler.phone || "",
        passportImage: traveler.passportImage || "",
        passportNo: traveler.passportNo || "",
        passportExpiryDate: traveler.passportExpiryDate
          ? new Date(traveler.passportExpiryDate).toISOString().split("T")[0]
          : "",
      }));

      setFormData({ travelers });
      setOpenTravelerForms([]);
      setPassportImages({});
      setErrors({});
      reset();

      // FIXED ✅
      const defaultRooms = [
        { roomType: "Single", count: 0 },
        { roomType: "Double", count: 0 },
        { roomType: "Triple", count: 0 },
      ];

      const existingRooms = booking.selectedDeparture?.roomConfiguration || [];

      const mergedRooms = defaultRooms.map((defaultRoom) => {
        const existingRoom = existingRooms.find(
          (r) => r.roomType === defaultRoom.roomType,
        );
        return existingRoom
          ? { ...defaultRoom, count: existingRoom.count }
          : defaultRoom;
      });

      setRoomConfig(mergedRooms);
      setChildOption(booking.selectedDeparture?.childOption || null);
      setInfantOption(booking.selectedDeparture?.infantOption || null);

      const oldTotal = booking.pricing?.totalAmount || 0;
      setDynamicPricing({
        totalAmount: oldTotal,
        baseAmount: booking.pricing?.baseAmount || 0,
        gstAmount: booking.pricing?.gstAmount || 0,
        adultCost: booking.pricing?.adultCost || 0,
        childCost: booking.pricing?.childCost || 0,
        infantCost: booking.pricing?.infantCost || 0,
        pricePerPerson: 0,
        difference: 0,
        refundAmount: 0,
        extraToPay: 0,
        oldTotal,
        tscCharge: booking.pricing?.tscCharge || 0,
        tscAmount: booking.pricing?.tscAmount || 0,
      });
      setHasInitialized(true);
    }
    if (!isOpen) {
      setHasInitialized(false);
    }
  }, [isOpen, booking, reset, hasInitialized]);

  // ── FIX 1: SINGLE CLEAN isSuccess useEffect ──
  useEffect(() => {
    if (isSuccess && updateData) {
      const changes = updateData?.data?.changes;

      if (changes?.pricing) {
        const diff = changes.pricing.difference;
        if (diff > 0) {
          toast(`₹${diff.toLocaleString("en-IN")} extra payment required.`);
        } else if (diff < 0) {
          toast(
            `Refund of ₹${Math.abs(diff).toLocaleString("en-IN")} will be processed.`,
          );
        }
      }

      if (changes?.refundInfo) {
        toast.success(
          `Refund of ₹${changes.refundInfo.refundAmount.toLocaleString("en-IN")} initiated. ID: ${changes.refundInfo.refundId}`,
        );
      }

      toast.success("Booking updated successfully!");
      reset();
      onClose();
    }
  }, [isSuccess, updateData, reset, onClose]);

  // ── DYNAMIC PRICE CALCULATION ──
  useEffect(() => {
    if (!booking) return;
    const pb = booking.tourPackage?.priceBreakdown;

    if (!pb) return;

    const departure = booking.tourPackage?.departures?.find(
      (d) =>
        d._id?.toString() ===
        booking.selectedDeparture?.departureId?.toString(),
    );

    const departurePrice =
      booking.selectedDeparture?.packageType === "Full Package"
        ? departure?.fullPackagePrice
        : departure?.joiningPrice;

    if (!departurePrice) return;

    const counts = {
      adults: formData.travelers.filter((t) => t.type === "Adult").length,
      children: formData.travelers.filter((t) => t.type === "Child").length,
      infants: formData.travelers.filter((t) => t.type === "Infant").length,
    };

    const adultBaseCost = counts.adults * departurePrice;
    const roomSurchargeMap = {
      Single: pb.adultSingleSharing || 0,
      Double: pb.adultDoubleSharing || 0,
      Triple: pb.adultTripleSharing || 0,
    };
    const roomCapacity = { Single: 1, Double: 2, Triple: 3 };
    const roomSurchargeCost = roomConfig.reduce((sum, room) => {
      return (
        sum +
        (roomSurchargeMap[room.roomType] || 0) *
          (roomCapacity[room.roomType] || 1) *
          room.count
      );
    }, 0);
    const adultCost = adultBaseCost + roomSurchargeCost;

    const childBaseCost = counts.children * departurePrice;
    const childSurcharge =
      counts.children > 0 && childOption
        ? counts.children *
          (childOption === "WithBed" ? pb.childWithBed : pb.childWithoutBed)
        : 0;
    const childCost = childBaseCost + childSurcharge;

    const infantCost =
      counts.infants > 0 && infantOption
        ? counts.infants *
          (infantOption === "WithRoom" ? pb.infantWithRoom : pb.infantBasePrice)
        : 0;

    const baseAmount = adultCost + childCost + infantCost;
    const gstAmount = Math.round(baseAmount * 0.05);
    const tscCharge = booking.tourPackage?.tscCharge || 0; // ADD
    const totalTravelers = formData.travelers.length; // ADD
    const tscAmount = tscCharge * totalTravelers; // ADD
    const totalAmount = baseAmount + gstAmount + tscAmount; // UPDATED
    const oldTotal = booking.pricing?.totalAmount || 0;
    const difference = totalAmount - oldTotal;

    setDynamicPricing({
      totalAmount,
      baseAmount,
      gstAmount,
      tscCharge, // ADD
      tscAmount, // ADD
      adultCost,
      childCost,
      infantCost,
      pricePerPerson: departurePrice,
      difference,
      refundAmount: difference < 0 ? Math.abs(difference) : 0,
      extraToPay: difference > 0 ? difference : 0,
      oldTotal,
    });
  }, [formData.travelers, roomConfig, childOption, infantOption, booking]);

  // ── TRAVELER FORM HANDLERS ──
  const toggleTravelerForm = (index) => {
    if (openTravelerForms.includes(index)) {
      setOpenTravelerForms(openTravelerForms.filter((i) => i !== index));
    } else {
      setOpenTravelerForms([...openTravelerForms, index]);
    }
  };

  const closeTravelerForm = (index) => {
    setOpenTravelerForms(openTravelerForms.filter((i) => i !== index));
  };

  const isTravelerFormFilled = (traveler) => {
    const basicFieldsFilled =
      traveler.firstName &&
      traveler.lastName &&
      traveler.dateOfBirth &&
      traveler.title &&
      traveler.gender;

    if (traveler.isLeadTraveler) {
      return basicFieldsFilled && traveler.email && traveler.phone;
    }
    return basicFieldsFilled;
  };

  const handleTravelerChange = (index, field, value) => {
    setFormData((prev) => {
      const travelers = [...prev.travelers];
      travelers[index] = { ...travelers[index], [field]: value };

      if (field === "dateOfBirth" && value) {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        travelers[index].age = age;
      }
      return { ...prev, travelers };
    });
  };

  // ── ADD TRAVELER ──
  const handleAddTraveler = (type) => {
    const newTraveler = {
      type,
      title: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      age: "",
      gender: "",
      isLeadTraveler: false,
      email: "",
      phone: "",
      passportNo: "",
      passportExpiryDate: "",
    };

    setFormData((prev) => ({
      ...prev,
      travelers: [...prev.travelers, newTraveler],
    }));
    setOpenTravelerForms([...openTravelerForms, formData.travelers.length]);
  };

  // ── FIX 4: REMOVE TRAVELER WITH CHILD/INFANT OPTION RESET ──
  const handleRemoveTraveler = (index) => {
    const traveler = formData.travelers[index];

    const adultCount = formData.travelers.filter(
      (t) => t.type === "Adult",
    ).length;
    if (traveler.type === "Adult" && adultCount === 1) {
      toast.error("You must have at least one adult traveler!");
      return;
    }

    if (traveler.isLeadTraveler) {
      toast.error(
        "Cannot remove lead traveler. Please assign another traveler as lead first.",
      );
      return;
    }

    const confirmRemove = window.confirm(
      `Are you sure you want to remove ${traveler.firstName || "this"} ${traveler.lastName || "traveler"}?`,
    );

    if (confirmRemove) {
      // Calculate updated travelers FIRST
      const updatedTravelers = formData.travelers.filter((_, i) => i !== index);

      setFormData((prev) => ({
        ...prev,
        travelers: updatedTravelers,
      }));

      // Reset childOption if no more children
      const stillHasChildren = updatedTravelers.some((t) => t.type === "Child");
      if (!stillHasChildren) setChildOption(null);

      // Reset infantOption if no more infants
      const stillHasInfants = updatedTravelers.some((t) => t.type === "Infant");
      if (!stillHasInfants) setInfantOption(null);

      setOpenTravelerForms(openTravelerForms.filter((i) => i !== index));
    }
  };

  // ── ROOM HANDLERS ──
  const handleRoomChange = (roomType, value) => {
    setRoomConfig((prev) =>
      prev.map((room) =>
        room.roomType === roomType
          ? { ...room, count: Math.max(0, value) }
          : room,
      ),
    );
  };

  const getTotalAllocated = () => {
    const capacity = { Single: 1, Double: 2, Triple: 3 };
    return roomConfig.reduce(
      (sum, room) => sum + (capacity[room.roomType] || 0) * room.count,
      0,
    );
  };

  const getRemainingAdults = () => {
    return (
      formData.travelers.filter((t) => t.type === "Adult").length -
      getTotalAllocated()
    );
  };

  // ── CHANGE LEAD TRAVELER ──
  const handleChangeLeadTraveler = (index) => {
    const traveler = formData.travelers[index];
    if (traveler.type !== "Adult") {
      toast.error("Only adults can be lead travelers!");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      travelers: prev.travelers.map((t, i) => ({
        ...t,
        isLeadTraveler: i === index,
        email: i === index ? t.email || "" : t.email,
        phone: i === index ? t.phone || "" : t.phone,
      })),
    }));
  };

  // ── VALIDATION ──
  const validateForm = () => {
    const newErrors = {};

    const adultCount = formData.travelers.filter(
      (t) => t.type === "Adult",
    ).length;
    if (adultCount === 0) {
      toast.error("You must have at least one adult traveler!");
      return false;
    }

    const leadTravelerCount = formData.travelers.filter(
      (t) => t.isLeadTraveler,
    ).length;
    if (leadTravelerCount === 0) {
      toast.error("Please select a lead traveler!");
      return false;
    }
    if (leadTravelerCount > 1) {
      toast.error("Only one traveler can be the lead traveler!");
      return false;
    }

    formData.travelers.forEach((traveler, index) => {
      if (!traveler.title) newErrors[`traveler_${index}_title`] = "Required";
      if (!traveler.firstName)
        newErrors[`traveler_${index}_firstName`] = "Required";
      if (!traveler.lastName)
        newErrors[`traveler_${index}_lastName`] = "Required";
      if (!traveler.dateOfBirth)
        newErrors[`traveler_${index}_dob`] = "Required";
      if (!traveler.gender) newErrors[`traveler_${index}_gender`] = "Required";

      if (traveler.isLeadTraveler) {
        if (!traveler.email) newErrors[`traveler_${index}_email`] = "Required";
        if (!traveler.phone) newErrors[`traveler_${index}_phone`] = "Required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── FIX 2+3: HANDLE SUBMIT — removed double onClose/toast after unwrap ──
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    // Room allocation check
    if (getRemainingAdults() > 0) {
      toast.error(`${getRemainingAdults()} adult(s) still need a room`);
      return;
    }
    if (getRemainingAdults() < 0) {
      toast.error(
        `Over-allocated by ${Math.abs(getRemainingAdults())} person(s)`,
      );
      return;
    }

    // Child option check
    const hasChildren = formData.travelers.some((t) => t.type === "Child");
    if (hasChildren && !childOption) {
      toast.error("Please select child room option");
      return;
    }

    // Infant option check
    const hasInfants = formData.travelers.some((t) => t.type === "Infant");
    if (hasInfants && !infantOption) {
      toast.error("Please select infant option");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("bookingId", booking.bookingId);
      fd.append(
        "selectedDeparture",
        JSON.stringify({
          departureId: booking.selectedDeparture.departureId?.toString(),
          departureCity: booking.selectedDeparture.departureCity,
          departureDate: booking.selectedDeparture.departureDate,
          packageType: booking.selectedDeparture.packageType,
          roomConfiguration: roomConfig.filter((r) => r.count > 0),
          childOption: childOption || undefined,
          infantOption: infantOption || undefined,
        }),
      );
      fd.append(
        "travelers",
        JSON.stringify(
          formData.travelers.map((t) => ({
            type: t.type,
            title: t.title,
            firstName: t.firstName,
            lastName: t.lastName,
            dateOfBirth: t.dateOfBirth,
            age: parseInt(t.age),
            gender: t.gender,
            isLeadTraveler: t.isLeadTraveler,
            email: t.email || undefined,
            phone: t.phone || undefined,
            passportImage: t.passportImage || undefined,
            passportNo: t.passportNo || undefined,
            passportExpiryDate: t.passportExpiryDate || undefined,
          })),
        ),
      );

      Object.entries(passportImages).forEach(([key, file]) => {
        fd.append(key, file);
      });

      // FIX 2: removed onClose() and toast.success() from here
      // isSuccess useEffect handles those
      await updateBookingTravelers(fd).unwrap();
    } catch (error) {
      toast.error(
        `Update failed: ${error?.data?.message || "Please try again"}`,
      );
    }
  };

  if (!isOpen || !booking) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const travelerCounts = {
    adults: formData.travelers.filter((t) => t.type === "Adult").length,
    children: formData.travelers.filter((t) => t.type === "Child").length,
    infants: formData.travelers.filter((t) => t.type === "Infant").length,
    total: formData.travelers.length,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-5xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="border-b p-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Edit Booking Details
            </h2>
            <p className="text-sm text-gray-600">
              Booking ID: {booking.bookingId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                  <FaInfoCircle className="text-blue-600 mt-1 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">
                      Update Traveler Information
                    </p>
                    <p>
                      You can add, remove, or update traveler details. Changes
                      may affect pricing.
                    </p>
                  </div>
                </div>

                {/* ADD TRAVELER BUTTONS */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Add Traveler
                  </h4>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAddTraveler("Adult")}
                      className="flex-1 bg-green-400 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition flex items-center justify-center gap-2"
                    >
                      <FaPlus /> Add Adult
                    </button>
                    <button
                      onClick={() => handleAddTraveler("Child")}
                      className="flex-1 bg-blue-400 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition flex items-center justify-center gap-2"
                    >
                      <FaPlus /> Add Child
                    </button>
                    <button
                      onClick={() => handleAddTraveler("Infant")}
                      className="flex-1 bg-purple-400 text-white py-2 px-4 rounded-lg hover:bg-purple-500 transition flex items-center justify-center gap-2"
                    >
                      <FaPlus /> Add Infant
                    </button>
                  </div>
                </div>
              </div>

              {/* ROOM CONFIGURATION */}
              <div className="border rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-gray-800 mb-1">
                  Room Allocation
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  Allocate{" "}
                  {formData.travelers.filter((t) => t.type === "Adult").length}{" "}
                  adult(s) into rooms
                </p>

                <div
                  className={`mb-3 p-2 rounded text-sm font-medium ${
                    getRemainingAdults() === 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {getRemainingAdults() === 0
                    ? "✅ All adults allocated"
                    : getRemainingAdults() > 0
                      ? `❌ ${getRemainingAdults()} adult(s) still need a room`
                      : `❌ Over-allocated by ${Math.abs(getRemainingAdults())}`}
                </div>

                <div className="space-y-3">
                  {[
                    {
                      type: "Single",
                      capacity: 1,
                      surcharge:
                        booking?.tourPackage?.priceBreakdown
                          ?.adultSingleSharing,
                    },
                    {
                      type: "Double",
                      capacity: 2,
                      surcharge:
                        booking?.tourPackage?.priceBreakdown
                          ?.adultDoubleSharing,
                    },
                    {
                      type: "Triple",
                      capacity: 3,
                      surcharge:
                        booking?.tourPackage?.priceBreakdown
                          ?.adultTripleSharing,
                    },
                  ].map(({ type, capacity, surcharge }) => {
                    const room = roomConfig.find((r) => r.roomType === type);
                    return (
                      <div
                        key={type}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{type} Room</p>
                          <p className="text-xs text-gray-500">
                            {capacity} person(s) • +₹
                            {surcharge?.toLocaleString("en-IN")}{" "}
                            surcharge/person
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleRoomChange(type, (room?.count || 0) - 1)
                            }
                            className="w-8 h-8 rounded-full border hover:bg-gray-100"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {room?.count || 0}
                          </span>
                          <button
                            onClick={() =>
                              handleRoomChange(type, (room?.count || 0) + 1)
                            }
                            className="w-8 h-8 rounded-full border hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Child Option */}
                  {formData.travelers.some((t) => t.type === "Child") && (
                    <div className="border rounded-lg p-4 mt-3">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Child Room Option
                      </h4>
                      <div className="space-y-2">
                        {[
                          {
                            value: "WithBed",
                            label: "With Bed",
                            price:
                              booking?.tourPackage?.priceBreakdown
                                ?.childWithBed,
                          },
                          {
                            value: "WithoutBed",
                            label: "Without Bed",
                            price:
                              booking?.tourPackage?.priceBreakdown
                                ?.childWithoutBed,
                          },
                        ].map(({ value, label, price }) => (
                          <label
                            key={value}
                            className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer ${
                              childOption === value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="editChildOption"
                                value={value}
                                checked={childOption === value}
                                onChange={() => setChildOption(value)}
                              />
                              <span className="font-medium">{label}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              +₹{price?.toLocaleString("en-IN")}/child
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Infant Option */}
                  {formData.travelers.some((t) => t.type === "Infant") && (
                    <div className="border rounded-lg p-4 mt-3">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Infant Option
                      </h4>
                      <div className="space-y-2">
                        {[
                          {
                            value: "Base",
                            label: "Base Price",
                            price:
                              booking?.tourPackage?.priceBreakdown
                                ?.infantBasePrice,
                          },
                          {
                            value: "WithRoom",
                            label: "With Room",
                            price:
                              booking?.tourPackage?.priceBreakdown
                                ?.infantWithRoom,
                          },
                        ].map(({ value, label, price }) => (
                          <label
                            key={value}
                            className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer ${
                              infantOption === value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="editInfantOption"
                                value={value}
                                checked={infantOption === value}
                                onChange={() => setInfantOption(value)}
                              />
                              <span className="font-medium">{label}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              ₹{price?.toLocaleString("en-IN")}/infant
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* TRAVELER FORMS */}
                {formData.travelers.map((traveler, index) => {
                  const isFormOpen = openTravelerForms.includes(index);
                  const isFormFilled = isTravelerFormFilled(traveler);

                  return (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-4 mt-4"
                    >
                      {!isFormOpen && (
                        <div
                          onClick={() => toggleTravelerForm(index)}
                          className={`w-full p-4 rounded-lg border-2 border-dashed flex items-center justify-between transition-all ${
                            isFormFilled
                              ? "bg-green-50 border-green-300 hover:bg-green-100"
                              : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isFormFilled
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-300 text-gray-600"
                              }`}
                            >
                              {isFormFilled ? <FaCheckCircle /> : <FaUser />}
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-gray-800">
                                {traveler.type} {index + 1}
                                {traveler.isLeadTraveler && (
                                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    Lead Traveler
                                  </span>
                                )}
                              </p>
                              {isFormFilled && (
                                <p className="text-sm text-gray-600">
                                  {traveler.title} {traveler.firstName}{" "}
                                  {traveler.lastName}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-blue-600">
                              Edit Details
                            </span>
                            {!traveler.isLeadTraveler && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveTraveler(index);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                                title="Remove traveler"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {isFormOpen && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-4 pb-3 border-b">
                            <div className="flex items-center gap-2">
                              <FaUser className="text-blue-600" />
                              <h4 className="font-semibold text-gray-800">
                                {traveler.type} {index + 1}
                                {traveler.isLeadTraveler && (
                                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    Lead Traveler
                                  </span>
                                )}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2">
                              {!traveler.isLeadTraveler &&
                                traveler.type === "Adult" && (
                                  <button
                                    onClick={() =>
                                      handleChangeLeadTraveler(index)
                                    }
                                    className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 transition"
                                  >
                                    Make Lead
                                  </button>
                                )}
                              {!traveler.isLeadTraveler && (
                                <button
                                  onClick={() => handleRemoveTraveler(index)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                  title="Remove traveler"
                                >
                                  <FaTrash size={14} />
                                </button>
                              )}
                              <button
                                onClick={() => closeTravelerForm(index)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                              >
                                <FaTimes size={18} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Title <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={traveler.title}
                                onChange={(e) =>
                                  handleTravelerChange(
                                    index,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Ms">Ms</option>
                                <option value="Master">Master</option>
                                <option value="Miss">Miss</option>
                              </select>
                              {errors[`traveler_${index}_title`] && (
                                <p className="text-red-600 text-xs mt-1">
                                  {errors[`traveler_${index}_title`]}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                First Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={traveler.firstName}
                                onChange={(e) =>
                                  handleTravelerChange(
                                    index,
                                    "firstName",
                                    e.target.value,
                                  )
                                }
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="First Name"
                              />
                              {errors[`traveler_${index}_firstName`] && (
                                <p className="text-red-600 text-xs mt-1">
                                  {errors[`traveler_${index}_firstName`]}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Last Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={traveler.lastName}
                                onChange={(e) =>
                                  handleTravelerChange(
                                    index,
                                    "lastName",
                                    e.target.value,
                                  )
                                }
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Last Name"
                              />
                              {errors[`traveler_${index}_lastName`] && (
                                <p className="text-red-600 text-xs mt-1">
                                  {errors[`traveler_${index}_lastName`]}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Date of Birth{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <DatePicker
                                selected={
                                  traveler.dateOfBirth
                                    ? new Date(traveler.dateOfBirth)
                                    : null
                                }
                                onChange={(date) => {
                                  const formatted = date
                                    ? date.toISOString().split("T")[0]
                                    : "";
                                  handleTravelerChange(
                                    index,
                                    "dateOfBirth",
                                    formatted,
                                  );
                                }}
                                dateFormat="dd MMM yyyy"
                                maxDate={new Date()}
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                placeholderText="Select Date of Birth"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                              />
                              {errors[`traveler_${index}_dob`] && (
                                <p className="text-red-600 text-xs mt-1">
                                  {errors[`traveler_${index}_dob`]}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Age
                              </label>
                              <input
                                type="number"
                                value={traveler.age}
                                readOnly
                                className="w-full p-2 border rounded bg-gray-50"
                                placeholder="Auto-calculated"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Gender <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={traveler.gender}
                                onChange={(e) =>
                                  handleTravelerChange(
                                    index,
                                    "gender",
                                    e.target.value,
                                  )
                                }
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                              {errors[`traveler_${index}_gender`] && (
                                <p className="text-red-600 text-xs mt-1">
                                  {errors[`traveler_${index}_gender`]}
                                </p>
                              )}
                            </div>

                            {/* Passport Photo */}
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Passport Photo
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    setPassportImages((prev) => ({
                                      ...prev,
                                      [`passportImage_${index}`]:
                                        e.target.files[0],
                                    }));
                                  }
                                }}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                              />
                              {passportImages[`passportImage_${index}`] && (
                                <div className="mt-2">
                                  <img
                                    src={URL.createObjectURL(
                                      passportImages[`passportImage_${index}`],
                                    )}
                                    alt="Passport preview"
                                    className="w-24 h-24 object-cover rounded border border-green-300"
                                  />
                                  <p className="text-xs text-green-600 mt-1">
                                    ✓{" "}
                                    {
                                      passportImages[`passportImage_${index}`]
                                        .name
                                    }
                                  </p>
                                </div>
                              )}
                              {booking?.travelers?.[index]?.passportImage &&
                                !passportImages[`passportImage_${index}`] && (
                                  <div className="mt-2">
                                    <img
                                      src={
                                        booking.travelers[index].passportImage
                                      }
                                      alt="Existing passport"
                                      className="w-24 h-24 object-cover rounded border border-blue-300"
                                    />
                                    <p className="text-xs text-blue-600 mt-1">
                                      ✓ Existing passport on file
                                    </p>
                                  </div>
                                )}
                            </div>

                            {/* Passport Number */}
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Passport No
                              </label>
                              <input
                                type="text"
                                value={traveler.passportNo || ""}
                                onChange={(e) =>
                                  handleTravelerChange(
                                    index,
                                    "passportNo",
                                    e.target.value,
                                  )
                                }
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. A1234567"
                              />
                            </div>

                            {/* Passport Expiry */}
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Passport Expiry Date
                              </label>
                              <DatePicker
                                selected={
                                  traveler.passportExpiryDate
                                    ? new Date(traveler.passportExpiryDate)
                                    : null
                                }
                                onChange={(date) => {
                                  const formatted = date
                                    ? date.toISOString().split("T")[0]
                                    : "";
                                  handleTravelerChange(
                                    index,
                                    "passportExpiryDate",
                                    formatted,
                                  );
                                }}
                                dateFormat="dd MMM yyyy"
                                minDate={(() => {
                                  const d = new Date();
                                  d.setMonth(d.getMonth() + 6);
                                  return d;
                                })()}
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                placeholderText="Select Expiry Date"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            {/* Lead Traveler Fields */}
                            {traveler.isLeadTraveler && (
                              <>
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Email{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="email"
                                    value={traveler.email || ""}
                                    onChange={(e) =>
                                      handleTravelerChange(
                                        index,
                                        "email",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="email@example.com"
                                  />
                                  {errors[`traveler_${index}_email`] && (
                                    <p className="text-red-600 text-xs mt-1">
                                      {errors[`traveler_${index}_email`]}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Phone{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="tel"
                                    value={traveler.phone || ""}
                                    onChange={(e) =>
                                      handleTravelerChange(
                                        index,
                                        "phone",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="+91 9876543210"
                                  />
                                  {errors[`traveler_${index}_phone`] && (
                                    <p className="text-red-600 text-xs mt-1">
                                      {errors[`traveler_${index}_phone`]}
                                    </p>
                                  )}
                                </div>
                              </>
                            )}
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                              onClick={() => closeTravelerForm(index)}
                              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                if (isTravelerFormFilled(traveler)) {
                                  closeTravelerForm(index);
                                } else {
                                  toast.error(
                                    "Please fill all required fields before saving",
                                  );
                                }
                              }}
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              Save Details
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SIDEBAR - BOOKING SUMMARY */}
            <div className="lg:col-span-1">
              <div className="bg-white p-5 rounded-xl shadow border border-gray-200 sticky top-4">
                <h2 className="flex items-center gap-2 font-semibold text-lg mb-4 border-b pb-2">
                  <Calendar className="text-blue-600" />
                  BOOKING SUMMARY
                </h2>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-800">
                    {booking.tourPackage?.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {booking.tourPackage?.subtitle}
                  </p>
                </div>

                {booking.selectedDeparture && (
                  <>
                    <div className="mb-2 flex justify-between text-sm text-gray-700">
                      <span>Dept. city</span>
                      <span className="font-medium">
                        {booking.selectedDeparture.departureCity}
                      </span>
                    </div>
                    <div className="mb-2 flex justify-between text-sm text-gray-700">
                      <span>Dept. date</span>
                      <span className="font-semibold text-black">
                        {formatDate(booking.selectedDeparture.departureDate)}
                      </span>
                    </div>
                    <div className="mb-2 flex justify-between text-sm text-gray-700">
                      <span>Package Type</span>
                      <span className="font-medium">
                        {booking.selectedDeparture.packageType}
                      </span>
                    </div>
                  </>
                )}

                <div className="mb-2 flex justify-between text-sm text-gray-700">
                  <span>Travelers</span>
                  <span className="font-semibold text-blue-600">
                    {travelerCounts.adults} Adult(s) | {travelerCounts.children}{" "}
                    Child | {travelerCounts.infants} Infant
                  </span>
                </div>

                <div className="border-t border-dashed pt-4 mb-4">
                  {/* OLD TOTAL */}
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-black">
                      Total Amount
                    </span>
                    <div className="text-right">
                      <p
                        className={`font-semibold text-xl ${
                          dynamicPricing.difference !== 0
                            ? "line-through text-gray-400"
                            : "text-green-600"
                        }`}
                      >
                        ₹{dynamicPricing.oldTotal.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-500">
                        ₹{dynamicPricing.pricePerPerson.toLocaleString("en-IN")}{" "}
                        per person
                      </p>
                    </div>
                  </div>

                  {/* NEW TOTAL */}
                  {dynamicPricing.difference !== 0 && (
                    <div className="flex justify-between items-start mb-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                      <span className="text-sm font-medium text-black">
                        New Total
                      </span>
                      <p className="text-blue-600 font-semibold text-xl">
                        ₹{dynamicPricing.totalAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  )}

                  {/* BASE AMOUNT */}
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-gray-700">Base Amount</span>
                    <span className="font-semibold">
                      ₹{dynamicPricing.baseAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* GST */}
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-gray-700">GST (5%)</span>
                    <span className="font-semibold">
                      ₹{dynamicPricing.gstAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {dynamicPricing.tscCharge > 0 && (
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <span className="text-gray-700">TSC Charge</span>
                      <span className="font-semibold">
                        ₹{dynamicPricing.tscAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  {/* EXTRA TO PAY */}
                  {dynamicPricing.extraToPay > 0 && (
                    <div className="flex justify-between text-sm bg-red-50 p-2 rounded mb-2 border border-red-200">
                      <span className="text-red-700 font-medium">
                        Extra to Pay
                      </span>
                      <span className="text-red-600 font-semibold">
                        +₹{dynamicPricing.extraToPay.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  {/* REFUND */}
                  {dynamicPricing.refundAmount > 0 && (
                    <div className="flex justify-between text-sm bg-green-50 p-2 rounded mb-2 border border-green-200">
                      <span className="text-green-700 font-medium">
                        Estimated Refund
                      </span>
                      <span className="text-green-600 font-semibold">
                        ₹{dynamicPricing.refundAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  {/* PAID */}
                  {booking?.pricing?.paidAmount > 0 && (
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="text-gray-700">Paid</span>
                      <span className="font-semibold text-green-600">
                        ₹{booking.pricing.paidAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  {/* PENDING */}
                  {(() => {
                    const livePending = Math.max(
                      0,
                      dynamicPricing.totalAmount -
                        (booking?.pricing?.paidAmount || 0),
                    );
                    return livePending > 0 ? (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">Pending</span>
                        <span className="font-semibold text-red-600">
                          ₹{livePending.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ) : null;
                  })()}
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-2">Travelers:</h4>
                  <div className="space-y-1">
                    {formData.travelers.map((traveler, index) => (
                      <div
                        key={index}
                        className="text-xs text-gray-600 flex items-center gap-2"
                      >
                        {isTravelerFormFilled(traveler) && (
                          <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        )}
                        {index + 1}. {traveler.title} {traveler.firstName}{" "}
                        {traveler.lastName}
                        {traveler.isLeadTraveler && (
                          <span className="text-green-600 ml-1">(Lead)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex justify-between items-center flex-shrink-0 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}; // ✅ EditBookingModal closes here

// ==================== CANCEL BOOKING MODAL ====================
const CancelBookingModal = ({ isOpen, onClose, booking }) => {
  const [cancelBooking, { isLoading }] = useCancelBookingMutation();

  const handleSubmit = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking? This action cannot be undone.",
    );
    if (!confirmCancel) return;

    try {
      await cancelBooking({ bookingId: booking.bookingId }).unwrap();
      onClose();
      toast.success("Booking cancelled successfully!");
    } catch (error) {
      toast.error(
        `Cancellation failed: ${error?.data?.message || "Please try again"}`,
      );
    }
  };

  if (!isOpen || !booking) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaExclamationTriangle className="text-red-600" />
              Cancel Booking
            </h2>
            <p className="text-sm text-gray-600">
              Booking ID: {booking.bookingId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 mb-2">
              <strong>Important:</strong> Please review our cancellation policy
              before proceeding.
            </p>
            <ul className="text-xs text-red-700 space-y-1 ml-4 list-disc">
              <li>
                Cancellations must be made at least 7 days before departure
              </li>
              <li>Refunds will be processed within 7-10 business days</li>
              <li>
                Cancellation charges may apply as per our terms and conditions
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">
              Booking Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tour:</span>
                <span className="font-medium text-gray-800">
                  {booking.tourPackage?.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Departure Date:</span>
                <span className="font-medium text-gray-800">
                  {formatDate(booking.selectedDeparture?.departureDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Travelers:</span>
                <span className="font-medium text-gray-800">
                  {booking.travelerCount?.total || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-gray-800">
                  ₹{booking.pricing?.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              {booking.pricing?.paidAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold text-green-600">
                    ₹{booking.pricing.paidAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {booking.pricing?.paidAmount > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-blue-900 mb-2">
                Refund Information
              </h4>
              <p className="text-xs text-blue-800">
                Your refund of ₹
                {booking.pricing.paidAmount.toLocaleString("en-IN")} will be
                processed within 7-10 business days according to our
                cancellation policy. The amount will be credited to your
                original payment method.
              </p>
            </div>
          )}
        </div>

        <div className="border-t p-4 flex justify-between items-center bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100"
          >
            Go Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Cancelling..." : "Confirm Cancellation"}
          </button>
        </div>
      </div>
    </div>
  );
}; // ✅ CancelBookingModal closes here

// ==================== MAIN COMPONENT ====================
const MyBookingsCards = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedBookingIdForEdit, setSelectedBookingIdForEdit] =
    useState(null);
  const [selectedBookingIdForCancel, setSelectedBookingIdForCancel] =
    useState(null);
  const [createPaymentOrder] = useCreatePaymentOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [handlePaymentFailure] = useHandlePaymentFailureMutation();

  const {
    data: myBookings,
    isLoading: loadingmyBookings,
    error: myBookingsError,
  } = useGetUserBookingsQuery();

  const Bookings = useMemo(() => {
    return myBookings?.data?.bookings || [];
  }, [myBookings]);

  const selectedBookingForEdit = useMemo(
    () =>
      Bookings.find((b) => b.bookingId === selectedBookingIdForEdit) || null,
    [Bookings, selectedBookingIdForEdit],
  );

  const selectedBookingForCancel = useMemo(
    () =>
      Bookings.find((b) => b.bookingId === selectedBookingIdForCancel) || null,
    [Bookings, selectedBookingIdForCancel],
  );

  const filteredBookings = useMemo(() => {
    if (!Bookings.length) return [];
    switch (activeTab) {
      case "upcoming":
        return Bookings.filter(
          (booking) =>
            booking.bookingStatus === "Confirmed" ||
            booking.bookingStatus === "Pending",
        );
      case "completed":
        return Bookings.filter(
          (booking) => booking.paymentStatus === "Fully Paid",
        );
      case "cancelled":
        return Bookings.filter(
          (booking) => booking.bookingStatus === "Cancelled",
        );
      default:
        return [];
    }
  }, [Bookings, activeTab]);

  const bookingCounts = useMemo(() => {
    if (!Bookings.length) return { upcoming: 0, completed: 0, cancelled: 0 };
    return {
      upcoming: Bookings.filter(
        (b) => b.bookingStatus === "Confirmed" || b.bookingStatus === "Pending",
      ).length,
      completed: Bookings.filter((b) => b.paymentStatus === "Fully Paid")
        .length,
      cancelled: Bookings.filter((b) => b.bookingStatus === "Cancelled").length,
    };
  }, [Bookings]);

  const formatPrice = (price) => `₹${price?.toLocaleString() || "0"}`;

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatesText = (states) => {
    if (!states || states.length === 0) return "N/A";
    const stateCount = states.length;
    const cityCount = states.reduce(
      (acc, state) => acc + (state.cities?.length || 0),
      0,
    );
    return `${stateCount} State${stateCount > 1 ? "s" : ""} ${cityCount} Cities`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      case "Cancelled":
        return "bg-red-500";
      case "Completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "text-green-600";
      case "Pending":
        return "text-orange-600";
      case "Failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleEditClick = (booking) =>
    setSelectedBookingIdForEdit(booking.bookingId);
  const handleCancelClick = (booking) =>
    setSelectedBookingIdForCancel(booking.bookingId);

  if (loadingmyBookings) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border border-gray-300 rounded-lg bg-white overflow-hidden animate-pulse"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/2 bg-gray-200 h-48" />
                <div className="sm:w-1/2 p-3 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-8 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (myBookingsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 font-semibold mb-3">
            Failed to load bookings
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-900 text-white px-4 py-2 rounded text-sm hover:bg-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handlePayPending = async (booking) => {
    const amount = booking.pricing.pendingAmount;
    const bookingId = booking.bookingId;

    try {
      const orderResponse = await createPaymentOrder({
        bookingId,
        amount,
      }).unwrap();
      if (!orderResponse.success) {
        toast.error("Failed to create payment order");
        return;
      }

      const { orderId, amount: orderAmount, keyId } = orderResponse.data;

      const options = {
        key: keyId,
        amount: orderAmount,
        currency: "INR",
        name: "Heaven Holiday",
        description: `Payment for Booking ${bookingId}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await verifyPayment({
              bookingId,
              paymentData: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                amount: orderAmount,
              },
            }).unwrap();
            if (verifyResponse.success) {
              toast.success("Payment successful!");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: booking.leadTraveler?.name || "",
          email: booking.leadTraveler?.email || "",
          contact: booking.leadTraveler?.phone || "",
        },
        theme: { color: "#dc2626" },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", async function (response) {
        try {
          await handlePaymentFailure({
            bookingId,
            failureData: {
              razorpayOrderId: response.error.metadata.order_id,
              error: { description: response.error.description },
            },
          }).unwrap();
        } catch (error) {
          console.error("Failed to log payment failure:", error);
        }
        toast.error(`Payment Failed: ${response.error.description}`);
      });
      razorpay.open();
    } catch (error) {
      toast.error("Error processing payment");
      console.error("Payment error:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-blue-900 flex justify-center">
          <div className="flex w-full max-w-3xl">
            {["upcoming", "completed", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-yellow-400 text-white"
                    : "border-transparent text-gray-300 hover:text-yellow-300"
                }`}
              >
                {tab === "upcoming" &&
                  `Upcoming Tours (${bookingCounts.upcoming})`}
                {tab === "completed" &&
                  `Completed Tours (${bookingCounts.completed})`}
                {tab === "cancelled" &&
                  `Cancelled Tours (${bookingCounts.cancelled})`}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {filteredBookings.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {filteredBookings.map((booking) => {
                const tour = booking.tourPackage;
                if (!tour) return null;

                return (
                  <div
                    key={booking._id}
                    className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative sm:w-1/2">
                        <Image
                          src={tour.galleryImages?.[0] || ""}
                          alt={tour.title}
                          width={1000}
                          height={400}
                          className="w-full h-62 object-cover rounded-lg p-2"
                        />
                        <div className="absolute top-3 right-3">
                          <span
                            className={`${getStatusColor(booking.bookingStatus)} text-white text-xs px-3 py-1 rounded-full shadow`}
                          >
                            {booking.bookingStatus}
                          </span>
                        </div>
                        {tour.badge && (
                          <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded">
                            {tour.badge.length > 16
                              ? `${tour.badge.slice(0, 16)}...`
                              : tour.badge}
                          </span>
                        )}
                      </div>

                      <div className="sm:w-1/2 p-3 flex flex-col justify-between">
                        <div>
                          {tour.tourType && (
                            <p className="bg-orange-500 text-white inline-block py-0.5 px-2 text-[10px] rounded-2xl">
                              {tour.tourType}
                            </p>
                          )}
                          <h3 className="font-bold text-lg mt-1 text-gray-800">
                            {tour.title.length > 25
                              ? `${tour.title.slice(0, 25)}...`
                              : tour.title}
                          </h3>
                          <div className="flex items-center text-yellow-500 text-sm my-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} />
                            ))}
                            <span className="ml-2 text-gray-600">
                              {tour.metadata?.totalDepartures || 0} Reviews
                            </span>
                          </div>

                          <div className="space-y-1 mb-2 text-xs">
                            <div className="flex items-center gap-1 text-gray-700">
                              <Calendar className="w-3 h-3" />
                              <span className="font-semibold">
                                {formatDate(
                                  booking.selectedDeparture?.departureDate,
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-700">
                              <MapPin className="w-3 h-3" />
                              <span>
                                {booking.selectedDeparture?.departureCity ||
                                  "N/A"}{" "}
                                •{" "}
                                {booking.selectedDeparture?.packageType ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-700">
                              <Users className="w-3 h-3" />
                              <span>
                                {booking.travelerCount?.adults || 0} Adult
                                {booking.travelerCount?.adults > 1 ? "s" : ""}
                                {booking.travelerCount?.children > 0 &&
                                  `, ${booking.travelerCount.children} Child${booking.travelerCount.children > 1 ? "ren" : ""}`}
                                {booking.travelerCount?.infants > 0 &&
                                  `, ${booking.travelerCount.infants} Infant${booking.travelerCount.infants > 1 ? "s" : ""}`}
                              </span>
                            </div>
                          </div>

                          {booking.leadTraveler && (
                            <div className="text-xs bg-blue-50 p-2 rounded mb-2">
                              <p className="font-semibold text-gray-700">
                                Lead Traveler:
                              </p>
                              <p className="text-gray-600">
                                {booking.leadTraveler.title}{" "}
                                {booking.leadTraveler.firstName}{" "}
                                {booking.leadTraveler.lastName}
                              </p>
                            </div>
                          )}

                          {tour.tourIncludes &&
                            tour.tourIncludes.length > 0 && (
                              <div className="relative group inline-block mb-2">
                                <p className="text-blue-600 text-sm cursor-pointer">
                                  ∞ All Inclusive
                                </p>
                                <div className="absolute -left-10 mt-2 hidden group-hover:block w-64 bg-white text-gray-800 text-sm rounded-lg p-4 shadow-lg border border-gray-200 z-50">
                                  <h4 className="font-semibold mb-3">
                                    Tour Includes
                                  </h4>
                                  <div className="grid grid-cols-2 gap-3 text-xs">
                                    {tour.tourIncludes
                                      .filter(
                                        (include) =>
                                          include.status === "active",
                                      )
                                      .map((include) => (
                                        <div
                                          key={include._id}
                                          className="flex items-center gap-2"
                                        >
                                          <img
                                            src={include.image}
                                            alt={include.title}
                                            className="w-5 h-5 object-cover rounded"
                                          />
                                          <span className="capitalize">
                                            {include.title}
                                          </span>
                                        </div>
                                      ))}
                                    {tour.tourManagerIncluded && (
                                      <div className="flex items-center gap-2 col-span-2">
                                        <User className="w-5 h-5" />
                                        <span>Tour Manager</span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-red-600 text-xs mt-3">
                                    *Economy class air travel is included for
                                    all departure cities, except for
                                    joining/leaving points; Taxes Extra.
                                  </p>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="text-sm text-gray-600 flex justify-between mb-4">
                        <div>
                          <p className="font-semibold text-xs">Days:</p>
                          <p className="text-black font-bold">
                            {tour.days || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-xs">Destinations:</p>
                          <p className="text-blue-900 font-bold">
                            {getStatesText(tour.states)}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-xs">Booked On:</p>
                          <p className="text-blue-900 font-bold text-[11px]">
                            {formatDate(booking.bookingDate)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200">
                        <div className="text-xs text-gray-600 mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">Total Amount:</span>
                            <span className="font-bold text-lg text-gray-800">
                              {formatPrice(booking.pricing?.totalAmount)}
                            </span>
                          </div>
                          {booking.pricing?.paidAmount > 0 && (
                            <div className="flex justify-between items-center mb-1">
                              <span>Paid:</span>
                              <span className="font-semibold text-green-600">
                                {formatPrice(booking.pricing.paidAmount)}
                              </span>
                            </div>
                          )}
                          {booking.pricing?.pendingAmount > 0 && (
                            <div className="flex justify-between items-center mb-1">
                              <span>Pending:</span>
                              <span className="font-semibold text-red-600">
                                {formatPrice(booking.pricing.pendingAmount)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center mb-2">
                            <span>Payment Status:</span>
                            <span
                              className={`font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}
                            >
                              {booking.paymentStatus}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between gap-2">
                          {booking.bookingStatus !== "Cancelled" &&
                            booking.bookingStatus !== "Completed" && (
                              <>
                                <button
                                  onClick={() => handleEditClick(booking)}
                                  className="flex-1 border border-blue-600 text-center font-bold text-blue-600 px-2 py-2 rounded-md text-sm hover:bg-blue-50 transition"
                                >
                                  Edit
                                </button>
                                {booking.pricing?.pendingAmount > 0 && (
                                  <button
                                    onClick={() => handlePayPending(booking)}
                                    className="flex-1 bg-green-600 text-center text-white font-bold px-2 py-2 rounded-md text-sm hover:bg-green-700 transition"
                                  >
                                    Pay ₹
                                    {booking.pricing.pendingAmount.toLocaleString(
                                      "en-IN",
                                    )}
                                  </button>
                                )}
                                <button
                                  onClick={() => handleCancelClick(booking)}
                                  className="flex-1 bg-red-700 text-center text-white font-bold px-2 py-2 rounded-md text-sm hover:bg-red-800 transition"
                                >
                                  Cancel Booking
                                </button>
                              </>
                            )}
                          {(booking.bookingStatus === "Completed" ||
                            booking.bookingStatus === "Cancelled") && (
                            <Link
                              href={`/tour-details/${tour._id}`}
                              className="flex-1 bg-blue-900 text-center text-white font-bold px-2 py-2 rounded-md text-sm hover:bg-blue-800 transition"
                            >
                              View Tour
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              {activeTab === "upcoming" && (
                <>
                  <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto border border-gray-200">
                    <div className="flex items-center gap-6">
                      <Image
                        src="/assets/img/my-booking/1.png"
                        alt="Holiday Illustration"
                        width={150}
                        height={150}
                        className="object-contain"
                      />
                      <div>
                        <h2 className="font-semibold text-lg mb-1 text-gray-800">
                          This is a good time to go on a holiday.
                        </h2>
                        <p className="text-gray-600 text-sm mb-3">
                          You have 0 booking with us. Let's break the ice.
                        </p>
                        <Link
                          href="/tour-list"
                          className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold px-4 py-2 rounded"
                        >
                          Explore Tours
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6 mt-4 shadow-sm border border-yellow-100 max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Get Trip-Ready with Personalized Travel Insights
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Custom videos, expert tips, & guides — everything you
                        need for a smooth, memorable trip.
                      </p>
                      <Link
                        href={"/account/pre-departure-videos"}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold px-4 py-2 rounded"
                      >
                        Watch Pre-Departure Videos
                      </Link>
                    </div>
                    <Image
                      src="/assets/img/my-booking/2.svg"
                      alt="Travel Tips"
                      width={150}
                      height={120}
                      className="mt-4 md:mt-0"
                    />
                  </div>
                </>
              )}
              {activeTab !== "upcoming" && (
                <div className="bg-white rounded-lg shadow-sm p-10 text-center max-w-4xl mx-auto border border-gray-200">
                  <p className="text-gray-700">No {activeTab} tours found.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <EditBookingModal
        isOpen={!!selectedBookingForEdit}
        onClose={() => setSelectedBookingIdForEdit(null)}
        booking={selectedBookingForEdit}
      />
      <CancelBookingModal
        isOpen={!!selectedBookingForCancel}
        onClose={() => setSelectedBookingIdForCancel(null)}
        booking={selectedBookingForCancel}
      />
    </>
  );
}; // ✅ MyBookingsCards closes here

export default MyBookingsCards;
