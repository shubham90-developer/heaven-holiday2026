"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Alert,
  Tabs,
  Tab,
  Card,
} from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FileUploader } from "@/components/FileUploader";
import Link from "next/link";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetTourPackageCardsQuery,
  useCreateTourPackageCardMutation,
  useUpdateTourPackageCardMutation,
  useDeleteTourPackageCardMutation,
} from "@/app/redux/api/tourManager/tourPackageApi";
import { useGetAllIncludesQuery } from "@/app/redux/api/tourManager/includes";

import {
  ModalType,
  AlertType,
  State,
  CityDetail,
  Departure,
  TourIncludes,
  ItineraryItem,
  Flight,
  Accommodation,
  ReportingDropping,
} from "./types";
import { CATEGORY_TYPES, STATUS_OPTIONS, modules } from "./constant";
import CategorySection from "./CategorySection";
import TourCardSection from "./TourCardSection";
import BasicInfoTab from "./TourCardModalTabs/BasicInfoTab";
import LocationTab from "./TourCardModalTabs/LocationTab";
import PricingTab from "./TourCardModalTabs/PricingTab";
import DeparturesTab from "./TourCardModalTabs/DeparturesTab";
import ItineraryTab from "./TourCardModalTabs/ItineraryTab";
import IncludesTab from "./TourCardModalTabs/IncludesTab";
import GalleryTab from "./TourCardModalTabs/GalleryTab";
import FlightsTab from "./TourCardModalTabs/flightTab";
import AccommodationsTab from "./TourCardModalTabs/accomodationsTab";
import ReportingDroppingTab from "./TourCardModalTabs/reporting&droppingTab";
import TourInformationTab from "./TourCardModalTabs/tourInfTab";
import PoliciesTab from "./TourCardModalTabs/policiesTab";
const TourPackagePage = () => {
  const {
    data: includes,
    isLoading: includesLoading,
    error,
  } = useGetAllIncludesQuery(undefined);

  // --- Data fetching & mutations ---
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery({ page: 1, limit: 100 });
  const { data: tourCardsData, isLoading: isTourCardsLoading } =
    useGetTourPackageCardsQuery({ page: 1, limit: 100 });

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [createTourCard] = useCreateTourPackageCardMutation();
  const [updateTourCard] = useUpdateTourPackageCardMutation();
  const [deleteTourCard] = useDeleteTourPackageCardMutation();

  const categories = categoriesData?.data || [];
  const tourCards = tourCardsData?.data || [];
  const includesData = includes?.data || [];

  const [activeTab, setActiveTab] = useState("categories");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  // Category state
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryGuests, setCategoryGuests] = useState("");

  const [categoryBadge, setCategoryBadge] = useState("");
  const [categoryType, setCategoryType] = useState("world");
  const [categoryStatus, setCategoryStatus] = useState("Active");
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState("");

  // Tour Card state
  const [tourCardId, setTourCardId] = useState<string | null>(null);
  const [tourTitle, setTourTitle] = useState("");
  const [tourSubtitle, setTourSubtitle] = useState("");
  const [tourCategory, setTourCategory] = useState("");
  const [tourBadge, setTourBadge] = useState("");
  const [tourMetaDescription, setTourMetaDescription] = useState("");
  const [tourFeatured, setTourFeatured] = useState(false);
  const [tourStatus, setTourStatus] = useState("Active");
  const [tourType, setTourType] = useState("Group Tour");
  const [tourDays, setTourDays] = useState(1);
  const [tourNights, setTourNights] = useState(0);
  const [tourStates, setTourStates] = useState<State[]>([
    { name: "", cities: [""] },
  ]);
  const [tourRoute, setTourRoute] = useState("");
  const [tourCityDetails, setTourCityDetails] = useState<CityDetail[]>([
    { name: "", nights: 0 },
  ]);

  const selectedCategory = categories.find(
    (cat: any) => cat._id === tourCategory,
  );
  const selectedCategoryType = selectedCategory?.categoryType || "";
  // NEW: Changed to base prices
  const [tourBaseFullPackagePrice, setTourBaseFullPackagePrice] = useState(0);
  const [tourBaseJoiningPrice, setTourBaseJoiningPrice] = useState(0);
  const [tscCharge, setTscCharge] = useState(0);
  const [tourPriceNote, setTourPriceNote] = useState("");

  const [priceBreakdown, setPriceBreakdown] = useState({
    adultSingleSharing: 0,
    adultDoubleSharing: 0,
    adultTripleSharing: 0,
    childWithBed: 0,
    childWithoutBed: 0,
    infantBasePrice: 0,
    infantWithRoom: 0,
  });

  const [tourManagerIncluded, setTourManagerIncluded] = useState(false);
  const [tourManagerNote, setTourManagerNote] = useState("");
  const [tourWhyTravel, setTourWhyTravel] = useState<string[]>([""]);
  const [tourIncludes, setTourIncludes] = useState<TourIncludes>([]);
  const [tourGalleryFiles, setTourGalleryFiles] = useState<File[]>([]);
  const [tourGalleryPreviews, setTourGalleryPreviews] = useState<string[]>([]);
  const [currentTourCardTab, setCurrentTourCardTab] = useState("basic");

  // NEW: Departure state
  const [selectedTourForDepartures, setSelectedTourForDepartures] = useState<
    string | null
  >(null);
  const [departures, setDepartures] = useState<Departure[]>([
    {
      city: "",
      date: "",
      fullPackagePrice: 0,
      joiningPrice: 0,
      availableSeats: 0,
      totalSeats: 0,
    },
  ]);
  // NEW: Itinerary state
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    { day: 1, date: "", title: "", activity: "" },
  ]);
  const [viewDeparturesTab, setViewDeparturesTab] = useState("add");

  // NEW: Flights state
  const [flights, setFlights] = useState<Flight[]>([
    {
      fromCity: "",
      toCity: "",
      departureDate: "",
      departureTime: "",
      arrivalTime: "",
      airline: "",
      arrivalDate: "",
      duration: "",
    },
  ]);

  // NEW: Accommodations state
  const [accommodations, setAccommodations] = useState<Accommodation[]>([
    {
      city: "",
      country: "",
      hotelName: "",
      checkInDate: "",
      checkOutDate: "",
    },
  ]);

  // NEW: Reporting & Dropping state
  const [reportingDropping, setReportingDropping] = useState<
    ReportingDropping[]
  >([
    {
      guestType: "",
      reportingPoint: "",
      droppingPoint: "",
    },
  ]);
  const [tourInclusions, setTourInclusions] = useState("");
  const [tourExclusions, setTourExclusions] = useState("");
  const [tourPrepartion, setTourPrepartion] = useState("");
  const [needToKnow, setNeedToKnow] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [alert, setAlert] = useState<AlertType>({
    show: false,
    message: "",
    variant: "success",
  });

  const showAlert = (message: string, variant: AlertType["variant"]) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert({ show: false, message: "", variant: "success" });
    }, 5000);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setIsEditMode(false);
    // Reset category state
    setCategoryId(null);
    setCategoryName("");
    setCategoryTitle("");
    setCategoryDescription("");
    setCategoryGuests("");

    setCategoryBadge("");
    setCategoryType("world");
    setCategoryStatus("Active");
    setCategoryImageFile(null);
    setCategoryImagePreview("");

    // Reset tour card state
    setTourCardId(null);
    setTourTitle("");
    setTourSubtitle("");
    setTourCategory("");
    setTourBadge("");
    setTourMetaDescription("");
    setTourFeatured(false);
    setTourStatus("Active");
    setTourType("Group Tour");
    setTourDays(1);
    setTourNights(0);
    setTourStates([{ name: "", cities: [""] }]);
    setTourRoute("");
    setTourCityDetails([{ name: "", nights: 0 }]);
    setTourBaseFullPackagePrice(0);
    setTourBaseJoiningPrice(0);
    setTscCharge(0);
    setTourPriceNote("");
    setPriceBreakdown({
      adultSingleSharing: 0,
      adultDoubleSharing: 0,
      adultTripleSharing: 0,
      childWithBed: 0,
      childWithoutBed: 0,
      infantBasePrice: 0,
      infantWithRoom: 0,
    });
    setTourManagerIncluded(false);
    setTourManagerNote("");
    setTourWhyTravel([""]);
    setTourIncludes([]);
    setTourGalleryFiles([]);
    setTourGalleryPreviews([]);
    setRemovedImages([]);
    setCurrentTourCardTab("basic");
    setTourInclusions("");
    setTourExclusions("");
    setTourPrepartion("");
    // NEW: Reset departure state
    setSelectedTourForDepartures(null);
    setDepartures([
      {
        city: "",
        date: "",
        fullPackagePrice: 0,
        joiningPrice: 0,
        availableSeats: 0,
        totalSeats: 0,
      },
    ]);
    // NEW: Reset itinerary state
    setItinerary([{ day: 1, date: "", title: "", activity: "" }]);
    setViewDeparturesTab("add");

    // NEW: Reset flights state
    setFlights([
      {
        fromCity: "",
        toCity: "",
        departureDate: "",
        departureTime: "",
        arrivalTime: "",
        airline: "",
        arrivalDate: "",
        duration: "",
      },
    ]);

    // NEW: Reset accommodations state
    setAccommodations([
      {
        city: "",
        country: "",
        hotelName: "",
        checkInDate: "",
        checkOutDate: "",
      },
    ]);

    // NEW: Reset reporting & dropping state
    setReportingDropping([
      {
        guestType: "",
        reportingPoint: "",
        droppingPoint: "",
      },
    ]);
    setNeedToKnow("");
    setCancellationPolicy("");
    // Load tour information fields
  };

  // --- Category Modal Handlers ---
  const handleOpenCategoryModal = (editMode: boolean, category?: any) => {
    setIsEditMode(editMode);
    if (editMode && category) {
      setCategoryId(category._id);
      setCategoryName(category.name);
      setCategoryTitle(category.title);
      setCategoryDescription(category.description || "");
      setCategoryGuests(category.guests);
      setCategoryBadge(category.badge || "");
      setCategoryType(category.categoryType);
      setCategoryStatus(category.status);
      setCategoryImagePreview(category.image);
    }
    setModalType("category");
  };

  const handleCategoryImageChange = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showAlert("Image size should not exceed 5MB!", "warning");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showAlert("Please upload a valid image file!", "warning");
      return;
    }

    setCategoryImageFile(file);
    setCategoryImagePreview(URL.createObjectURL(file));
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName || !categoryTitle || !categoryGuests || !categoryType) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    if (!isEditMode && !categoryImageFile) {
      showAlert("Please upload a category image!", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", categoryName);
      formData.append("title", categoryTitle);
      formData.append("description", categoryDescription);
      formData.append("guests", categoryGuests);
      formData.append("badge", categoryBadge);
      formData.append("categoryType", categoryType);
      formData.append("status", categoryStatus);

      if (categoryImageFile) {
        formData.append("image", categoryImageFile);
      }

      if (isEditMode && categoryId) {
        await updateCategory({ categoryId, data: formData }).unwrap();
        showAlert("Category updated successfully!", "success");
      } else {
        await createCategory(formData).unwrap();
        showAlert("Category created successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("Error:", err);
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id).unwrap();
      showAlert("Category deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  // --- Tour Card Modal Handlers ---
  const handleOpenTourCardModal = (editMode: boolean, card?: any) => {
    if (!editMode && categories.length === 0) {
      showAlert("Please create at least one category first!", "warning");
      return;
    }

    setIsEditMode(editMode);
    if (editMode && card) {
      setTourCardId(card._id);
      setTourTitle(card.title);
      setTourSubtitle(card.subtitle);
      const catId =
        typeof card.category === "object" && card.category?._id
          ? card.category._id
          : card.category;
      setTourCategory(catId || "");
      setTourBadge(card.badge || "");
      setTourMetaDescription(card.metaDescription || "");
      setTourFeatured(card.featured || false);
      setTourStatus(card.status);
      setTourType(card.tourType);
      setTourDays(card.days);
      setTourNights(card.nights);
      setTourStates(card.states || [{ name: "", cities: [""] }]);
      setTourRoute(card.route);
      setTourCityDetails(card.cityDetails || [{ name: "", nights: 0 }]);

      // NEW: Use base prices
      setTourBaseFullPackagePrice(
        card.baseFullPackagePrice || card.fullPackagePrice || 0,
      );
      setTourBaseJoiningPrice(card.baseJoiningPrice || card.joiningPrice || 0);
      setTourPriceNote(card.priceNote || "");
      setPriceBreakdown({
        adultSingleSharing: card.priceBreakdown?.adultSingleSharing || 0,
        adultDoubleSharing: card.priceBreakdown?.adultDoubleSharing || 0,
        adultTripleSharing: card.priceBreakdown?.adultTripleSharing || 0,
        childWithBed: card.priceBreakdown?.childWithBed || 0,
        childWithoutBed: card.priceBreakdown?.childWithoutBed || 0,
        infantBasePrice: card.priceBreakdown?.infantBasePrice || 0,
        infantWithRoom: card.priceBreakdown?.infantWithRoom || 0,
      });
      setTscCharge(card.tscCharge || 0);

      setTourManagerIncluded(card.tourManagerIncluded || false);
      setTourManagerNote(card.tourManagerNote || "");
      setTourWhyTravel(card.whyTravel || [""]);

      const includeIds = Array.isArray(card.tourIncludes)
        ? card.tourIncludes.map((inc: any) =>
            typeof inc === "object" && inc._id ? inc._id : inc,
          )
        : [];
      setTourIncludes(includeIds);

      setTourGalleryPreviews(card.galleryImages || []);

      // NEW: Load departures if available
      if (card.departures && card.departures.length > 0) {
        setDepartures(
          card.departures.map((dep: any) => ({
            city: dep.city,
            date: new Date(dep.date).toISOString().split("T")[0],
            fullPackagePrice: dep.fullPackagePrice,
            joiningPrice: dep.joiningPrice,
            availableSeats: dep.availableSeats,
            totalSeats: dep.totalSeats,
            status: dep.status,
          })),
        );
      }

      // NEW: Load itinerary if available - MOVED INSIDE EDIT MODE
      if (card.itinerary && card.itinerary.length > 0) {
        setItinerary(
          card.itinerary.map((item: any) => ({
            day: item.day,
            date: item.date
              ? new Date(item.date).toISOString().split("T")[0]
              : "",
            title: item.title || "",
            activity: item.activity || "",
          })),
        );
      }
      // NEW: Load flights if available
      if (card.flights && card.flights.length > 0) {
        setFlights(
          card.flights.map((flight: any) => ({
            fromCity: flight.fromCity || "",
            toCity: flight.toCity || "",
            departureDate: flight.departureDate
              ? new Date(flight.departureDate).toISOString().split("T")[0]
              : "",
            departureTime: flight.departureTime || "",
            arrivalTime: flight.arrivalTime || "",
            airline: flight.airline || "",
            arrivalDate: flight.arrivalDate
              ? new Date(flight.arrivalDate).toISOString().split("T")[0]
              : "",
            duration: flight.duration || "",
          })),
        );
      }

      // NEW: Load accommodations if available
      if (card.accommodations && card.accommodations.length > 0) {
        setAccommodations(
          card.accommodations.map((acc: any) => ({
            city: acc.city || "",
            country: acc.country || "",
            hotelName: acc.hotelName || "",
            checkInDate: acc.checkInDate
              ? new Date(acc.checkInDate).toISOString().split("T")[0]
              : "",
            checkOutDate: acc.checkOutDate
              ? new Date(acc.checkOutDate).toISOString().split("T")[0]
              : "",
          })),
        );
      }

      // NEW: Load reporting & dropping if available
      if (card.reportingDropping && card.reportingDropping.length > 0) {
        setReportingDropping(
          card.reportingDropping.map((rd: any) => ({
            guestType: rd.guestType || "",
            reportingPoint: rd.reportingPoint || "",
            droppingPoint: rd.droppingPoint || "",
          })),
        );
      }
      setTourInclusions(card.tourInclusions || "");
      setTourExclusions(card.tourExclusions || "");
      setTourPrepartion(card.tourPrepartion || "");
      setNeedToKnow(card.needToKnow || "");
      setCancellationPolicy(card.cancellationPolicy || "");
    } else {
      setCurrentTourCardTab("basic");
      // Set default category for create mode
      if (categories.length > 0) {
        setTourCategory(categories[0]._id);
      }
    }

    setModalType("tourCard");
  };

  const handleTourGalleryChange = (files: File[]) => {
    const validFiles: File[] = [];
    const previews: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        showAlert(`${file.name} is not a valid image file.`, "warning");
        continue;
      }

      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    setTourGalleryFiles((prev) => [...prev, ...validFiles]);
    setTourGalleryPreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveGalleryImage = (index: number) => {
    const preview = tourGalleryPreviews[index];

    // If server image (not blob), track it as removed
    if (preview && !preview.startsWith("blob:")) {
      setRemovedImages((prev) => [...prev, preview]);
    }

    // If blob, remove from files too
    if (preview && preview.startsWith("blob:")) {
      const fileIndex = tourGalleryFiles.findIndex(
        (_, i) => URL.createObjectURL(tourGalleryFiles[i]) === preview,
      );
      if (fileIndex !== -1) {
        setTourGalleryFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      }
    }

    setTourGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // State helpers
  const handleAddState = () => {
    setTourStates([...tourStates, { name: "", cities: [""] }]);
  };

  const handleRemoveState = (index: number) => {
    setTourStates(tourStates.filter((_, i) => i !== index));
  };

  const handleStateChange = (index: number, field: string, value: string) => {
    const newStates = [...tourStates];
    newStates[index] = { ...newStates[index], [field]: value };
    setTourStates(newStates);
  };

  const handleAddCity = (stateIndex: number) => {
    const newStates = [...tourStates];
    newStates[stateIndex].cities.push("");
    setTourStates(newStates);
  };

  const handleRemoveCity = (stateIndex: number, cityIndex: number) => {
    const newStates = [...tourStates];
    newStates[stateIndex].cities = newStates[stateIndex].cities.filter(
      (_, i) => i !== cityIndex,
    );
    setTourStates(newStates);
  };

  const handleCityChange = (
    stateIndex: number,
    cityIndex: number,
    value: string,
  ) => {
    const newStates = [...tourStates];
    newStates[stateIndex] = {
      ...newStates[stateIndex],
      cities: [...newStates[stateIndex].cities],
    };
    newStates[stateIndex].cities[cityIndex] = value;
    setTourStates(newStates);
  };

  // City Details helpers
  const handleAddCityDetail = () => {
    setTourCityDetails([...tourCityDetails, { name: "", nights: 0 }]);
  };

  const handleRemoveCityDetail = (index: number) => {
    setTourCityDetails(tourCityDetails.filter((_, i) => i !== index));
  };

  const handleCityDetailChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newDetails = [...tourCityDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setTourCityDetails(newDetails);
  };

  // Why Travel helpers
  const handleAddWhyTravel = () => {
    setTourWhyTravel([...tourWhyTravel, ""]);
  };

  const handleRemoveWhyTravel = (index: number) => {
    setTourWhyTravel(tourWhyTravel.filter((_, i) => i !== index));
  };

  const handleWhyTravelChange = (index: number, value: string) => {
    const newWhyTravel = [...tourWhyTravel];
    newWhyTravel[index] = value;
    setTourWhyTravel(newWhyTravel);
  };

  // Tour Includes helper
  const handleToggleInclude = (includeId: string) => {
    setTourIncludes((prev) => {
      if (prev.includes(includeId)) {
        return prev.filter((id) => id !== includeId);
      } else {
        return [...prev, includeId];
      }
    });
  };

  // NEW: Departure helpers
  const handleAddDeparture = () => {
    setDepartures([
      ...departures,
      {
        city: "",
        date: "",
        fullPackagePrice: tourBaseFullPackagePrice,
        joiningPrice: tourBaseJoiningPrice,
        availableSeats: 0,
        totalSeats: 0,
      },
    ]);
  };

  const handleRemoveDeparture = (index: number) => {
    setDepartures(departures.filter((_, i) => i !== index));
  };

  const handleDepartureChange = (
    index: number,
    field: keyof Departure,
    value: any,
  ) => {
    const newDepartures = [...departures];
    newDepartures[index] = { ...newDepartures[index], [field]: value };
    setDepartures(newDepartures);
  };

  // Itinerary helpers
  const handleAddItinerary = () => {
    const nextDay =
      itinerary.length > 0 ? Math.max(...itinerary.map((i) => i.day)) + 1 : 1;
    setItinerary([
      ...itinerary,
      { day: nextDay, date: "", title: "", activity: "" },
    ]);
  };

  const handleRemoveItinerary = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  const handleItineraryChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newItinerary = [...itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setItinerary(newItinerary);
  };

  // Flight helpers
  const handleAddFlight = () => {
    setFlights([
      ...flights,
      {
        fromCity: "",
        toCity: "",
        departureDate: "",
        departureTime: "",
        arrivalTime: "",
        airline: "",
        arrivalDate: "",
        duration: "",
      },
    ]);
  };

  const handleRemoveFlight = (index: number) => {
    setFlights(flights.filter((_, i) => i !== index));
  };

  const handleFlightChange = (
    index: number,
    field: keyof Flight,
    value: string,
  ) => {
    const newFlights = [...flights];
    newFlights[index] = { ...newFlights[index], [field]: value };
    setFlights(newFlights);
  };

  // Accommodation helpers
  const handleAddAccommodation = () => {
    setAccommodations([
      ...accommodations,
      {
        city: "",
        country: "",
        hotelName: "",
        checkInDate: "",
        checkOutDate: "",
      },
    ]);
  };

  const handleRemoveAccommodation = (index: number) => {
    setAccommodations(accommodations.filter((_, i) => i !== index));
  };

  const handleAccommodationChange = (
    index: number,
    field: keyof Accommodation,
    value: string,
  ) => {
    const newAccommodations = [...accommodations];
    newAccommodations[index] = { ...newAccommodations[index], [field]: value };
    setAccommodations(newAccommodations);
  };

  // Reporting & Dropping helpers
  const handleAddReportingDropping = () => {
    setReportingDropping([
      ...reportingDropping,
      {
        guestType: "",
        reportingPoint: "",
        droppingPoint: "",
      },
    ]);
  };

  const handleRemoveReportingDropping = (index: number) => {
    setReportingDropping(reportingDropping.filter((_, i) => i !== index));
  };

  const handleReportingDroppingChange = (
    index: number,
    field: keyof ReportingDropping,
    value: string,
  ) => {
    const newReportingDropping = [...reportingDropping];
    newReportingDropping[index] = {
      ...newReportingDropping[index],
      [field]: value,
    };
    setReportingDropping(newReportingDropping);
  };

  const handleTourCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !tourTitle ||
      !tourSubtitle ||
      !tourCategory ||
      !tourType ||
      tourDays < 1 ||
      tourNights < 0 ||
      !tourRoute ||
      tourBaseFullPackagePrice <= 0 ||
      tourBaseJoiningPrice <= 0
    ) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    // Validate states
    for (const state of tourStates) {
      if (!state.name || state.cities.length === 0 || !state.cities[0]) {
        showAlert(
          "Each state must have a name and at least one city!",
          "warning",
        );
        return;
      }
    }

    // Validate city details
    for (const city of tourCityDetails) {
      if (!city.name || city.nights < 0) {
        showAlert(
          "Each city detail must have a valid name and nights!",
          "warning",
        );
        return;
      }
    }

    // NEW: Validate departures
    if (departures.length === 0) {
      showAlert("Please add at least one departure!", "warning");
      return;
    }

    for (const dep of departures) {
      if (
        !dep.city ||
        !dep.date ||
        dep.fullPackagePrice <= 0 ||
        dep.joiningPrice <= 0 ||
        dep.totalSeats <= 0
      ) {
        showAlert("Please fill all departure fields correctly!", "warning");
        return;
      }
    }
    // NEW: Validate itinerary
    if (itinerary.length === 0) {
      showAlert("Please add at least one itinerary item!", "warning");
      return;
    }

    for (const item of itinerary) {
      if (item.day < 1 || !item.activity.trim()) {
        showAlert(
          "Each itinerary must have a valid day and activity!",
          "warning",
        );
        return;
      }
    }
    if (
      !tourInclusions.trim() ||
      !tourExclusions.trim() ||
      !tourPrepartion.trim()
    ) {
      showAlert("Please fill all tour information fields!", "warning");
      return;
    }
    if (!needToKnow.trim() || !cancellationPolicy.trim()) {
      showAlert("Please fill all policy fields!", "warning");
      return;
    }
    if (!isEditMode && tourGalleryFiles.length === 0) {
      showAlert("Please upload at least one gallery image!", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", tourTitle);
      formData.append("subtitle", tourSubtitle);
      formData.append("category", tourCategory);
      formData.append("badge", tourBadge);
      formData.append("metaDescription", tourMetaDescription);
      formData.append("featured", tourFeatured.toString());
      formData.append("status", tourStatus);
      formData.append("tourType", tourType);
      formData.append("days", tourDays.toString());
      formData.append("nights", tourNights.toString());
      formData.append("states", JSON.stringify(tourStates));
      formData.append("route", tourRoute);
      formData.append("cityDetails", JSON.stringify(tourCityDetails));

      // NEW: Use base prices
      formData.append(
        "baseFullPackagePrice",
        tourBaseFullPackagePrice.toString(),
      );
      formData.append("baseJoiningPrice", tourBaseJoiningPrice.toString());
      formData.append("priceNote", tourPriceNote);
      formData.append("tscCharge", tscCharge.toString());
      formData.append("priceBreakdown", JSON.stringify(priceBreakdown));

      // NEW: Add departures
      formData.append("departures", JSON.stringify(departures));
      formData.append("itinerary", JSON.stringify(itinerary));
      formData.append("flights", JSON.stringify(flights));
      formData.append("accommodations", JSON.stringify(accommodations));
      formData.append("reportingDropping", JSON.stringify(reportingDropping));
      formData.append("tourManagerIncluded", tourManagerIncluded.toString());
      formData.append("tourManagerNote", tourManagerNote);
      formData.append("tourInclusions", tourInclusions);
      formData.append("tourExclusions", tourExclusions);
      formData.append("tourPrepartion", tourPrepartion);
      formData.append("needToKnow", needToKnow);
      formData.append("cancellationPolicy", cancellationPolicy);
      formData.append(
        "whyTravel",
        JSON.stringify(tourWhyTravel.filter((w) => w)),
      );
      formData.append("tourIncludes", JSON.stringify(tourIncludes));

      if (isEditMode) {
        formData.append("existingImages", JSON.stringify(tourGalleryPreviews));
        formData.append("removedImages", JSON.stringify(removedImages));
      }

      // Send new files
      tourGalleryFiles.forEach((file) => {
        formData.append("galleryImages", file);
      });

      if (isEditMode && tourCardId) {
        await updateTourCard({ cardId: tourCardId, data: formData }).unwrap();
        showAlert("Tour package card updated successfully!", "success");
      } else {
        await createTourCard(formData).unwrap();
        showAlert("Tour package card created successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("Error:", err);
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    }
  };

  const handleDeleteTourCard = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tour package card?"))
      return;
    try {
      await deleteTourCard(id).unwrap();
      showAlert("Tour package card deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  // NEW: Departure management modal handlers
  const handleOpenDeparturesModal = (tourId: string) => {
    setSelectedTourForDepartures(tourId);
    setModalType("departures");
  };

  const getModalTitle = () => {
    if (modalType === "category")
      return isEditMode ? "Edit Category" : "Add Category";
    if (modalType === "tourCard")
      return isEditMode ? "Edit Tour Package Card" : "Add Tour Package Card";
    if (modalType === "departures") return "Manage Departures";
    return "";
  };

  if (includesLoading) {
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

  if (error) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Alert variant="danger">
          <IconifyIcon
            icon="solar:danger-triangle-bold-duotone"
            className="fs-20 me-2"
          />
          Failed to load includes data. Please try again.
        </Alert>
      </div>
    );
  }

  const isLoading = isCategoriesLoading || isTourCardsLoading;

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

  return (
    <>
      <Row>
        <Col xs={12}>
          <PageTitle
            title="Tour Package Management"
            subTitle="Content Management"
          />

          {alert.show && (
            <Alert
              style={{ position: "relative", zIndex: 9999 }}
              variant={alert.variant}
              dismissible
              onClose={() => setAlert({ ...alert, show: false })}
              className="d-flex align-items-center mb-3"
            >
              <IconifyIcon
                icon={
                  alert.variant === "success"
                    ? "solar:check-read-line-duotone"
                    : alert.variant === "danger"
                      ? "solar:danger-triangle-bold-duotone"
                      : alert.variant === "warning"
                        ? "solar:shield-warning-line-duotone"
                        : "solar:info-circle-bold-duotone"
                }
                className="fs-20 me-2"
              />
              <div className="lh-1">{alert.message}</div>
            </Alert>
          )}

          <ComponentContainerCard
            title="Tour Packages"
            description="Manage tour package categories and cards."
          >
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || "categories")}
              className="mb-3"
            >
              <Tab eventKey="categories" title="Categories">
                <CategorySection
                  categories={categories}
                  onOpenCategoryModal={handleOpenCategoryModal}
                  onDeleteCategory={handleDeleteCategory}
                />
              </Tab>

              <Tab eventKey="tourCards" title="Tour Package Cards">
                <TourCardSection
                  tourCards={tourCards}
                  onOpenTourCardModal={handleOpenTourCardModal}
                  onDeleteTourCard={handleDeleteTourCard}
                />
              </Tab>
            </Tabs>
          </ComponentContainerCard>
        </Col>
      </Row>

      <Modal
        show={modalType !== null}
        onHide={handleCloseModal}
        centered
        size="xl"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>{getModalTitle()}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {/* Category Modal */}
          {modalType === "category" && (
            <Form onSubmit={handleCategorySubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={categoryTitle}
                      onChange={(e) => setCategoryTitle(e.target.value)}
                      placeholder="Enter category title"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <div style={{ height: "250px" }}>
                  <ReactQuill
                    theme="snow"
                    value={categoryDescription}
                    onChange={setCategoryDescription}
                    modules={modules}
                    placeholder="Enter category description..."
                    style={{ height: "200px", marginBottom: "50px" }}
                  />
                </div>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Guests <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={categoryGuests}
                      onChange={(e) => setCategoryGuests(e.target.value)}
                      placeholder="e.g., 1,00,286"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Badge</Form.Label>
                    <Form.Control
                      type="text"
                      value={categoryBadge}
                      onChange={(e) => setCategoryBadge(e.target.value)}
                      placeholder="Badge text"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Category Type <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={categoryType}
                      onChange={(e) => setCategoryType(e.target.value)}
                      required
                    >
                      {CATEGORY_TYPES.map((type: any) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={categoryStatus}
                      onChange={(e) => setCategoryStatus(e.target.value)}
                    >
                      {STATUS_OPTIONS.map((status: any) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>
                  Image {!isEditMode && <span className="text-danger">*</span>}
                </Form.Label>
                {!categoryImagePreview ? (
                  <FileUploader
                    onFileUpload={handleCategoryImageChange}
                    icon="ri:upload-cloud-2-line"
                    text="Drop image here or click to upload."
                    extraText="(Maximum file size: 5MB)"
                  />
                ) : (
                  <Card className="mt-1 mb-0 shadow-none border">
                    <div className="p-2">
                      <Row className="align-items-center">
                        <Col xs="auto">
                          <img
                            src={categoryImagePreview}
                            className="avatar-sm rounded bg-light"
                            alt="preview"
                            style={{
                              width: "48px",
                              height: "48px",
                              objectFit: "cover",
                            }}
                          />
                        </Col>
                        <Col className="ps-0">
                          <p className="text-muted fw-bold mb-0">
                            {categoryImageFile?.name || "Current Image"}
                          </p>
                        </Col>
                        <Col xs="auto">
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              setCategoryImageFile(null);
                              setCategoryImagePreview("");
                            }}
                            className="btn btn-link btn-lg text-muted"
                          >
                            <IconifyIcon icon="tabler:x" />
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                )}
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {isEditMode ? "Update" : "Create"}
                </Button>
              </div>
            </Form>
          )}

          {/* Tour Card Modal */}
          {modalType === "tourCard" && (
            <Form onSubmit={handleTourCardSubmit}>
              <Tabs
                activeKey={currentTourCardTab}
                onSelect={(k) => setCurrentTourCardTab(k || "basic")}
                className="mb-3"
              >
                <Tab eventKey="basic" title="Basic Info">
                  <BasicInfoTab
                    tourTitle={tourTitle}
                    setTourTitle={setTourTitle}
                    tourSubtitle={tourSubtitle}
                    setTourSubtitle={setTourSubtitle}
                    tourCategory={tourCategory}
                    setTourCategory={setTourCategory}
                    tourType={tourType}
                    setTourType={setTourType}
                    tourBadge={tourBadge}
                    setTourBadge={setTourBadge}
                    tourStatus={tourStatus}
                    setTourStatus={setTourStatus}
                    tourMetaDescription={tourMetaDescription}
                    setTourMetaDescription={setTourMetaDescription}
                    tourDays={tourDays}
                    setTourDays={setTourDays}
                    tourNights={tourNights}
                    setTourNights={setTourNights}
                    categories={categories}
                  />
                </Tab>

                <Tab eventKey="location" title="Location">
                  <LocationTab
                    tourRoute={tourRoute}
                    setTourRoute={setTourRoute}
                    tourStates={tourStates}
                    setTourStates={setTourStates}
                    tourCityDetails={tourCityDetails}
                    setTourCityDetails={setTourCityDetails}
                    handleAddState={handleAddState}
                    handleRemoveState={handleRemoveState}
                    handleStateChange={handleStateChange}
                    handleAddCity={handleAddCity}
                    handleRemoveCity={handleRemoveCity}
                    handleCityChange={handleCityChange}
                    handleAddCityDetail={handleAddCityDetail}
                    handleRemoveCityDetail={handleRemoveCityDetail}
                    handleCityDetailChange={handleCityDetailChange}
                    selectedCategoryType={selectedCategoryType}
                  />
                </Tab>

                <Tab eventKey="pricing" title="Pricing">
                  <PricingTab
                    tourBaseFullPackagePrice={tourBaseFullPackagePrice}
                    setTourBaseFullPackagePrice={setTourBaseFullPackagePrice}
                    tourBaseJoiningPrice={tourBaseJoiningPrice}
                    setTourBaseJoiningPrice={setTourBaseJoiningPrice}
                    tourPriceNote={tourPriceNote}
                    setTourPriceNote={setTourPriceNote}
                    priceBreakdown={priceBreakdown}
                    setPriceBreakdown={setPriceBreakdown}
                    tscCharge={tscCharge}
                    setTscCharge={setTscCharge}
                  />
                </Tab>

                <Tab eventKey="departures" title="Departures">
                  <DeparturesTab
                    departures={departures}
                    handleAddDeparture={handleAddDeparture}
                    handleRemoveDeparture={handleRemoveDeparture}
                    handleDepartureChange={handleDepartureChange}
                  />
                </Tab>

                <Tab eventKey="itinerary" title="Itinerary">
                  <ItineraryTab
                    itinerary={itinerary}
                    handleAddItinerary={handleAddItinerary}
                    handleRemoveItinerary={handleRemoveItinerary}
                    handleItineraryChange={handleItineraryChange}
                  />
                </Tab>

                <Tab eventKey="includes" title="Tour Includes">
                  <IncludesTab
                    includesData={includesData}
                    tourIncludes={tourIncludes}
                    handleToggleInclude={handleToggleInclude}
                    tourManagerIncluded={tourManagerIncluded}
                    setTourManagerIncluded={setTourManagerIncluded}
                    tourManagerNote={tourManagerNote}
                    setTourManagerNote={setTourManagerNote}
                    tourWhyTravel={tourWhyTravel}
                    handleAddWhyTravel={handleAddWhyTravel}
                    handleRemoveWhyTravel={handleRemoveWhyTravel}
                    handleWhyTravelChange={handleWhyTravelChange}
                  />
                </Tab>

                <Tab eventKey="gallery" title="Gallery">
                  <GalleryTab
                    tourGalleryPreviews={tourGalleryPreviews}
                    tourGalleryFiles={tourGalleryFiles}
                    isEditMode={isEditMode}
                    handleTourGalleryChange={handleTourGalleryChange}
                    handleRemoveGalleryImage={handleRemoveGalleryImage}
                  />
                </Tab>

                <Tab eventKey="flights" title="Flights">
                  <FlightsTab
                    flights={flights}
                    handleAddFlight={handleAddFlight}
                    handleRemoveFlight={handleRemoveFlight}
                    handleFlightChange={handleFlightChange}
                  />
                </Tab>

                <Tab eventKey="accommodations" title="Accommodations">
                  <AccommodationsTab
                    accommodations={accommodations}
                    handleAddAccommodation={handleAddAccommodation}
                    handleRemoveAccommodation={handleRemoveAccommodation}
                    handleAccommodationChange={handleAccommodationChange}
                  />
                </Tab>

                <Tab eventKey="reportingDropping" title="Reporting & Dropping">
                  <ReportingDroppingTab
                    reportingDropping={reportingDropping}
                    handleAddReportingDropping={handleAddReportingDropping}
                    handleRemoveReportingDropping={
                      handleRemoveReportingDropping
                    }
                    handleReportingDroppingChange={
                      handleReportingDroppingChange
                    }
                  />
                </Tab>

                <Tab eventKey="tourInformation" title="Tour Information">
                  <TourInformationTab
                    tourInclusions={tourInclusions}
                    setTourInclusions={setTourInclusions}
                    tourExclusions={tourExclusions}
                    setTourExclusions={setTourExclusions}
                    tourPrepartion={tourPrepartion}
                    setTourPrepartion={setTourPrepartion}
                  />
                </Tab>

                <Tab eventKey="policies" title="Policies">
                  <PoliciesTab
                    needToKnow={needToKnow}
                    setNeedToKnow={setNeedToKnow}
                    cancellationPolicy={cancellationPolicy}
                    setCancellationPolicy={setCancellationPolicy}
                  />
                </Tab>
              </Tabs>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {isEditMode ? "Update" : "Create"}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TourPackagePage;
