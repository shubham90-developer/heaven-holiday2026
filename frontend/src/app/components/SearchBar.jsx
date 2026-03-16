"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Mic, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetCategoriesQuery,
  useGetTourPackageQuery,
} from "store/toursManagement/toursPackagesApi";

const SearchBar = ({ mobile = false }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("month");
  const [selectedYear, setSelectedYear] = useState(null);
  const [filters, setFilters] = useState([]);
  const [searchText, setSearchText] = useState("");

  const { data, isLoading, error } = useGetTourPackageQuery();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const packages = data?.data || [];
  const categories = categoriesData?.data || [];

  // ── Derived: available years from actual departure dates ──────────────────
  const availableYears = useMemo(() => {
    const years = [
      ...new Set(
        packages.flatMap((pkg) =>
          pkg.departures.map((dep) => new Date(dep.date).getFullYear()),
        ),
      ),
    ].sort();
    return years;
  }, [packages]);

  // Set default selected year to first available
  useEffect(() => {
    if (availableYears.length > 0 && selectedYear === null) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears]);

  // ── Derived: BEST SEASON TOURS — unique category names from actual packages ─
  const bestSeasons = useMemo(() => {
    return [
      ...new Set(packages.map((pkg) => pkg.category?.name).filter(Boolean)),
    ];
  }, [packages]);

  // ── Derived: HOT SELLING DESTINATIONS — packages grouped by category ──────
  const hotDestinations = useMemo(() => {
    const map = {};
    packages.forEach((pkg) => {
      const catName = pkg.category?.name;
      if (!catName) return;
      if (!map[catName]) {
        const catFromAPI = categories.find((c) => c.name === catName);
        map[catName] = {
          name: catName,
          img: catFromAPI?.image || pkg.category?.image || "",
          tours: 0,
          departures: 0,
          packages: [],
        };
      }
      map[catName].tours += 1;
      map[catName].departures += pkg.departures?.length || 0;
      map[catName].packages.push(pkg);
    });
    return Object.values(map);
  }, [packages, categories]);

  // Active category filters (from bestSeasons or hotDestinations clicks)
  const activeCategories = useMemo(() => {
    return filters.filter(
      (f) =>
        hotDestinations.some((d) => d.name === f) || bestSeasons.includes(f),
    );
  }, [filters, hotDestinations, bestSeasons]);

  // Packages to show in HOT SELLING DESTINATIONS panel
  const hotDestinationsView = useMemo(() => {
    if (activeCategories.length > 0) {
      return packages.filter((pkg) =>
        activeCategories.includes(pkg.category?.name),
      );
    }
    return null;
  }, [packages, activeCategories]);

  // ── Derived: months with tour counts for selected year ───────────────────
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const months = useMemo(() => {
    const counts = Array(12).fill(0);
    packages.forEach((pkg) => {
      pkg.departures.forEach((dep) => {
        const date = new Date(dep.date);
        if (!selectedYear || date.getFullYear() === selectedYear) {
          counts[date.getMonth()] += 1;
        }
      });
    });
    return monthLabels.map((label, i) => ({ label, tours: counts[i] }));
  }, [packages, selectedYear]);

  // ── Derived: price ranges from actual package prices ─────────────────────
  const priceRanges = [
    { label: "Below ₹35,000", min: 0, max: 35000 },
    { label: "₹35,000 - ₹50,000", min: 35000, max: 50000 },
    { label: "₹50,000 - 1L", min: 50000, max: 100000 },
    { label: "₹1L - ₹2L", min: 100000, max: 200000 },
    { label: "₹2L - ₹3L", min: 200000, max: 300000 },
    { label: "₹3L & above", min: 300000, max: Infinity },
  ];

  // ── Derived: occasions from tourType ─────────────────────────────────────
  const occasions = useMemo(() => {
    return [...new Set(packages.map((pkg) => pkg.tourType).filter(Boolean))];
  }, [packages]);

  // ── Filtered packages (search + filters) ─────────────────────────────────
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // Search text
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const matchesTitle = pkg.title?.toLowerCase().includes(q);
        const matchesCategory = pkg.category?.name?.toLowerCase().includes(q);
        const matchesState = pkg.states?.some((s) =>
          s.name?.toLowerCase().includes(q),
        );
        const matchesCity = pkg.states?.some((s) =>
          s.cities?.some((c) => c.toLowerCase().includes(q)),
        );
        if (
          !matchesTitle &&
          !matchesCategory &&
          !matchesState &&
          !matchesCity
        ) {
          return false;
        }
      }

      // Category / season filters
      if (
        activeCategories.length > 0 &&
        !activeCategories.includes(pkg.category?.name)
      ) {
        return false;
      }

      // Month + Year filters e.g. "Mar 2026"
      const activeMonths = filters.filter((f) =>
        monthLabels.some((m) => f.startsWith(m)),
      );
      if (activeMonths.length > 0) {
        const hasMatchingDeparture = pkg.departures.some((dep) => {
          const d = new Date(dep.date);
          const label = `${monthLabels[d.getMonth()]} ${d.getFullYear()}`;
          return activeMonths.includes(label);
        });
        if (!hasMatchingDeparture) return false;
      }

      // FIX 1: Price range filters — check if package matches ANY selected range
      const activePrices = filters.filter((f) =>
        priceRanges.some((r) => r.label === f),
      );
      if (activePrices.length > 0) {
        const matchesAnyRange = activePrices.some((label) => {
          const range = priceRanges.find((r) => r.label === label);
          return (
            range &&
            pkg.baseFullPackagePrice >= range.min &&
            pkg.baseFullPackagePrice <= range.max
          );
        });
        if (!matchesAnyRange) return false;
      }

      // FIX 2: Occasion / tourType filters — check if package matches ANY selected occasion
      const activeOccasions = filters.filter((f) => occasions.includes(f));
      if (
        activeOccasions.length > 0 &&
        !activeOccasions.includes(pkg.tourType)
      ) {
        return false;
      }

      return true;
    });
  }, [
    packages,
    searchText,
    filters,
    selectedYear,
    activeCategories,
    occasions,
  ]);
  // FIX 3: Added `occasions` to dependency array so filteredPackages recomputes when occasions change

  const toggleFilter = (value) => {
    setFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value],
    );
  };

  const handlePackageClick = (pkgId) => {
    router.push(`/tour-details/${pkgId}`);
    setIsOpen(false);
    setSearchText("");
    setFilters([]);
  };

  const placeholders = [
    'Search "Gulmarg"',
    'Search "Europe Tours"',
    'Search "Dubai"',
    'Search "Phuket"',
    'Search "New Zealand"',
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState(placeholders[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDisplayText(placeholders[placeholderIndex]);
  }, [placeholderIndex]);

  return (
    <>
      {/* SearchBar trigger */}
      <div
        className={`
        ${mobile ? "flex w-full" : "hidden md:flex flex-1 justify-center px-6"}
      `}
      >
        <div
          className="flex items-center w-full max-w-md bg-white/10 border border-gray-300 text-white rounded-full px-4 py-1.5 shadow-sm cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <Search className="text-gray-400 w-3 h-3" />
          <input
            type="search"
            placeholder={displayText}
            className="flex-1 px-2 text-xs text-white placeholder-gray-300 focus:outline-none cursor-pointer transition-all duration-500"
            readOnly
          />
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-6xl bg-white text-black rounded-xl shadow-lg flex flex-col max-h-[95vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b gap-3">
              <div className="flex items-center w-full bg-gray-100 rounded-full px-4 py-2">
                <Search className="text-gray-400 w-5 h-5" />
                <input
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search tours, destinations..."
                  className="flex-1 px-2 text-sm text-gray-800 focus:outline-none bg-transparent"
                  autoFocus
                />
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSearchText("");
                  setFilters([]);
                }}
                className="bg-gray-200 p-2 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500 hover:text-black" />
              </button>
            </div>

            {/* Active filter pills */}
            {filters.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 border-b">
                {filters.map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
                  >
                    {f}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => toggleFilter(f)}
                    />
                  </span>
                ))}
              </div>
            )}

            {/* Search results */}
            {searchText.trim() && (
              <div className="px-6 pt-4 pb-2 border-b">
                <p className="text-xs text-gray-500 mb-2">
                  {filteredPackages.length} result
                  {filteredPackages.length !== 1 ? "s" : ""} for "{searchText}"
                </p>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {filteredPackages.length === 0 ? (
                    <p className="text-sm text-gray-400">No packages found.</p>
                  ) : (
                    filteredPackages.map((pkg) => (
                      <div
                        key={pkg._id}
                        className="flex items-center gap-3 p-2 border rounded-lg hover:shadow cursor-pointer"
                        onClick={() => handlePackageClick(pkg._id)}
                      >
                        <Image
                          src={pkg.galleryImages?.[0] || ""}
                          alt={pkg.title}
                          width={60}
                          height={40}
                          className="rounded-md object-cover w-14 h-10"
                        />
                        <div>
                          <p className="text-sm font-semibold">{pkg.title}</p>
                          <p className="text-xs text-gray-500">
                            {pkg.category?.name} • {pkg.days}D/{pkg.nights}N • ₹
                            {pkg.baseFullPackagePrice?.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* FIX 4: Show filtered results panel when filters active but no search text */}
            {!searchText.trim() &&
              filters.length > 0 &&
              filteredPackages.length >= 0 && (
                <div className="px-6 pt-4 pb-2 border-b">
                  <p className="text-xs text-gray-500 mb-2">
                    {filteredPackages.length} result
                    {filteredPackages.length !== 1 ? "s" : ""} matching selected
                    filters
                  </p>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {filteredPackages.length === 0 ? (
                      <p className="text-sm text-gray-400">
                        No packages match selected filters.
                      </p>
                    ) : (
                      filteredPackages.map((pkg) => (
                        <div
                          key={pkg._id}
                          className="flex items-center gap-3 p-2 border rounded-lg hover:shadow cursor-pointer"
                          onClick={() => handlePackageClick(pkg._id)}
                        >
                          <Image
                            src={pkg.galleryImages?.[0] || ""}
                            alt={pkg.title}
                            width={60}
                            height={40}
                            className="rounded-md object-cover w-14 h-10"
                          />
                          <div>
                            <p className="text-sm font-semibold">{pkg.title}</p>
                            <p className="text-xs text-gray-500">
                              {pkg.category?.name} • {pkg.days}D/{pkg.nights}N •
                              ₹
                              {pkg.baseFullPackagePrice?.toLocaleString(
                                "en-IN",
                              )}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT */}
              <div className="space-y-6 bg-yellow-50 p-4 rounded-lg">
                {/* Best Seasons */}
                <div>
                  <h3 className="font-bold text-sm border-b pb-2 mb-4">
                    BEST SEASON TOURS
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {isLoading ? (
                      <p className="text-xs text-gray-400">Loading...</p>
                    ) : bestSeasons.length === 0 ? (
                      <p className="text-xs text-gray-400">
                        No seasons available.
                      </p>
                    ) : (
                      bestSeasons.map((item) => (
                        <button
                          key={item}
                          onClick={() => toggleFilter(item)}
                          className={`px-4 py-1 rounded-full border text-xs ${
                            filters.includes(item)
                              ? "bg-blue-900 text-white"
                              : "hover:bg-blue-100"
                          }`}
                        >
                          {item}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Hot Destinations */}
                <div>
                  <h3 className="font-bold text-sm border-b pb-2 mb-4">
                    HOT SELLING DESTINATIONS
                    {activeCategories.length > 0 && (
                      <span className="ml-2 text-blue-600 font-normal text-xs">
                        — {activeCategories.join(", ")}
                      </span>
                    )}
                  </h3>
                  {isLoading ? (
                    <p className="text-xs text-gray-400">Loading...</p>
                  ) : hotDestinationsView ? (
                    <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
                      {hotDestinationsView.length === 0 ? (
                        <p className="text-sm text-gray-400">
                          No packages in this category.
                        </p>
                      ) : (
                        hotDestinationsView.map((pkg) => (
                          <div
                            key={pkg._id}
                            className="flex items-center gap-3 p-2 border rounded-lg hover:shadow cursor-pointer bg-white"
                            onClick={() => handlePackageClick(pkg._id)}
                          >
                            <Image
                              src={pkg.galleryImages?.[0] || ""}
                              alt={pkg.title}
                              width={70}
                              height={50}
                              className="rounded-md object-cover w-16 h-12 flex-shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-sm">
                                {pkg.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {pkg.days}D/{pkg.nights}N • ₹
                                {pkg.baseFullPackagePrice?.toLocaleString(
                                  "en-IN",
                                )}
                              </p>
                              <p className="text-xs text-gray-400">
                                {pkg.departures?.length || 0} departure
                                {pkg.departures?.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {hotDestinations.map((d) => (
                        <div
                          key={d.name}
                          className="flex items-center gap-3 p-2 border rounded-lg hover:shadow cursor-pointer"
                          onClick={() => toggleFilter(d.name)}
                        >
                          <Image
                            src={d.img}
                            alt={d.name}
                            width={70}
                            height={50}
                            className="rounded-md object-cover"
                          />
                          <div>
                            <p className="font-semibold">{d.name}</p>
                            <p className="text-xs text-gray-500">
                              {d.tours} tours • {d.departures} departures
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                {/* Month / Occasion */}
                <div>
                  <h3 className="font-bold text-sm border-b pb-2 mb-4">
                    When do you wish to travel?
                  </h3>
                  <div className="flex gap-2 mb-3">
                    {["month", "occasion"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1 rounded-full text-xs ${
                          activeTab === tab
                            ? "bg-blue-900 text-white"
                            : "border hover:bg-gray-100"
                        }`}
                      >
                        {tab[0].toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic years */}
                  <div className="flex gap-4 mb-3">
                    {availableYears.map((year) => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          selectedYear === year
                            ? "bg-blue-900 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>

                  {activeTab === "month" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {months.map((m) => (
                        <button
                          key={m.label}
                          disabled={m.tours === 0}
                          onClick={() =>
                            toggleFilter(`${m.label} ${selectedYear}`)
                          }
                          className={`px-3 py-2 rounded-lg border text-xs text-center ${
                            m.tours === 0
                              ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                              : filters.includes(`${m.label} ${selectedYear}`)
                                ? "bg-blue-900 text-white"
                                : "hover:bg-blue-100"
                          }`}
                        >
                          {m.label}
                          <br />
                          {m.tours} tour{m.tours !== 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {occasions.length === 0 ? (
                        <p className="text-xs text-gray-400">
                          No occasions available.
                        </p>
                      ) : (
                        occasions.map((o) => (
                          <button
                            key={o}
                            onClick={() => toggleFilter(o)}
                            className={`px-4 py-1 rounded-full border text-xs ${
                              filters.includes(o)
                                ? "bg-blue-900 text-white"
                                : "hover:bg-blue-100"
                            }`}
                          >
                            {o}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Price Ranges */}
                <div>
                  <h3 className="font-bold text-sm border-b pb-2 mb-4">
                    Popular Range
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => toggleFilter(range.label)}
                        className={`px-4 py-1 rounded-full border text-xs ${
                          filters.includes(range.label)
                            ? "bg-blue-900 text-white"
                            : "hover:bg-blue-100"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
