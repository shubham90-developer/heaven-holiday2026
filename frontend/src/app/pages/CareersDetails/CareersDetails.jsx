"use client";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useCreateJobApplicationMutation } from "../../../../store/jobApplicationsApi/jobApplicationApi";
import { useGetJobPageQuery } from "../../../../store/careers/jobOpeningApi";
import { useParams } from "next/navigation";
const CareersDetails = () => {
  const [createApplication, { isLoading }] = useCreateJobApplicationMutation();
  const { data, error, loading } = useGetJobPageQuery();

  const { id } = useParams();
  const careerData = data?.data?.jobs?.find((job) => job._id === id);

  if (loading) {
    return <p>loading</p>;
  }
  if (error) {
    return <p>error</p>;
  }

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    currentCity: "",
    yearsOfExperience: "",
    noticePeriod: "",
    joiningAvailability: "",
    currentCTC: "",
    expectedCTC: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert({ show: false, message: "", variant: "success" });
    }, 5000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (500KB)
      if (file.size > 500 * 1024) {
        showAlert("File size must be less than 500KB", "error");
        e.target.value = "";
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        showAlert("Only jpg, png, doc, pdf files are allowed", "error");
        e.target.value = "";
        return;
      }

      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      showAlert("Please upload your resume", "error");
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("fullName", formData.fullName);
      submitData.append("phone", formData.phone);
      submitData.append("email", formData.email);
      submitData.append("currentCity", formData.currentCity);
      submitData.append("yearsOfExperience", formData.yearsOfExperience);
      submitData.append("noticePeriod", formData.noticePeriod);
      submitData.append("joiningAvailability", formData.joiningAvailability);
      submitData.append("currentCTC", formData.currentCTC);
      submitData.append("expectedCTC", formData.expectedCTC);
      submitData.append("resume", resumeFile);

      await createApplication(submitData).unwrap();

      showAlert("Application submitted successfully!", "success");

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        currentCity: "",
        yearsOfExperience: "",
        noticePeriod: "",
        joiningAvailability: "",
        currentCTC: "",
        expectedCTC: "",
      });
      setResumeFile(null);
      document.getElementById("resume").value = "";
    } catch (error) {
      showAlert(
        error?.data?.message || "Failed to submit application",
        "error",
      );
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      currentCity: "",
      yearsOfExperience: "",
      noticePeriod: "",
      joiningAvailability: "",
      currentCTC: "",
      expectedCTC: "",
    });
    setResumeFile(null);
    document.getElementById("resume").value = "";
  };

  return (
    <>
      {/* Blue Hero Section */}
      <section className="bg-blue-800 h-[250px] md:h-[300px] relative flex items-center justify-center text-center px-4">
        <div className="text-white">
          <p className="text-xl md:text-2xl font-bold">
            {careerData?.jobTitle || ""}
          </p>
          <p className="text-sm md:text-base">
            {careerData?.department?.name} / M{careerData?.location?.name} /{" "}
            {careerData?.type}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <div className="relative bg-gray-50 flex flex-col items-center px-4 pb-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-20">
          {/* LEFT SIDE: Job Details */}
          <div className="lg:col-span-2 bg-white shadow rounded-2xl p-6">
            <div className="mb-5">
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-xs rounded"
              >
                <ArrowBigLeft className="w-4 h-4" />
                Back
              </Link>
            </div>

            {/* Eligibility */}

            <div
              className="list-disc list-inside space-y-1 text-black mb-6"
              dangerouslySetInnerHTML={{
                __html: careerData?.jobDescription || "",
              }}
            />
          </div>

          {/* RIGHT SIDE: Application Form */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Submit Application
            </h2>

            {/* Alert */}
            {alert.show && (
              <div
                className={`mb-4 p-3 rounded text-sm ${
                  alert.variant === "success"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {alert.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91"
                  className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Email ID *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-black mb-1">
                    Current City *
                  </label>
                  <input
                    type="text"
                    name="currentCity"
                    value={formData.currentCity}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black mb-1">
                    Years of Exp. *
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                    required
                    min="0"
                    max="50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-black mb-1">
                    Notice Period *
                  </label>
                  <input
                    type="text"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black mb-1">
                    How soon can you join? *
                  </label>
                  <input
                    type="text"
                    name="joiningAvailability"
                    value={formData.joiningAvailability}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-black mb-1">
                    Current CTC *
                  </label>
                  <input
                    type="text"
                    name="currentCTC"
                    value={formData.currentCTC}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black mb-1">
                    Expected CTC *
                  </label>
                  <input
                    type="text"
                    name="expectedCTC"
                    value={formData.expectedCTC}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Upload Your Resume *
                </label>
                <input
                  type="file"
                  id="resume"
                  onChange={handleFileChange}
                  className="w-full text-sm border rounded-lg p-2 cursor-pointer"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only jpg, png, doc, pdf files allowed with max size 500 KB.
                </p>
                {resumeFile && (
                  <p className="text-xs text-green-600 mt-1">
                    Selected: {resumeFile.name}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 cursor-pointer text-xs rounded-lg border border-gray-300 text-black hover:bg-gray-100"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 cursor-pointer text-xs rounded-lg bg-red-700 text-white font-semibold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CareersDetails;
