"use client";
import { useState } from "react";
import {
  FaChevronDown,
  FaFolderOpen,
  FaFilePdf,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import {
  useGetProfileQuery,
  useUploadDocumentMutation,
} from "store/authApi/authApi";

export default function KycDocuments() {
  const [openSection, setOpenSection] = useState(null);
  const [uploads, setUploads] = useState({}); // local preview state
  const [selectedOtherDoc, setSelectedOtherDoc] = useState(""); // Selected document from dropdown
  const [customDocName, setCustomDocName] = useState(""); // For "Other ID Proof"

  // RTK Queries
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery();
  const [uploadDocument, { isLoading: uploading }] =
    useUploadDocumentMutation();

  const userProfile = profileData?.data?.user;

  // Document mapping (frontend → backend)
  const documentMapping = {
    "Aadhar Card": "aadharCard",
    Passport: "passport",
    "PAN Card": "panCard",
    "Voter Card": "voterId",
    "Birth Certificate": "birthCertificate",
    "Driver License": "drivingLicense",
  };

  const documents = [
    "Aadhar Card",
    "Passport",
    "PAN Card",
    "Voter Card",
    "Birth Certificate",
    "Driver License",
  ];

  const toggleSection = (idx) => {
    setOpenSection(openSection === idx ? null : idx);
  };

  const handleFileChange = async (e, docName, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Only PNG, JPG, JPEG, and PDF files are allowed");
      return;
    }

    // Show local preview immediately
    setUploads((prev) => ({
      ...prev,
      [docName]: {
        ...prev[docName],
        [type]: file,
      },
    }));

    // Upload to backend
    try {
      const documentType = documentMapping[docName];
      const side = type; // 'front' or 'back'

      await uploadDocument({
        documentType,
        side,
        file,
      }).unwrap();

      alert(`${docName} ${type} uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Failed to upload ${docName} ${type}`);

      // Remove from preview on error
      removeFile(docName, type);
    }
  };

  // Handle other document uploads (Visa, Other ID)
  const handleOtherDocUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Only PNG, JPG, JPEG, and PDF files are allowed");
      return;
    }

    // For "Other ID Proof", require custom document name
    if (selectedOtherDoc === "other" && !customDocName.trim()) {
      alert("Please enter document name first");
      return;
    }

    // Show local preview immediately
    setUploads((prev) => ({
      ...prev,
      [selectedOtherDoc]: {
        ...prev[selectedOtherDoc],
        [type]: file,
      },
    }));

    // Upload to backend
    try {
      const documentType =
        selectedOtherDoc === "visa" ? "visa" : "otherDocument";
      const side = type; // 'front' or 'back'

      const uploadData = {
        documentType,
        side,
        file,
      };

      // Add documentName for otherDocument type
      if (documentType === "otherDocument") {
        uploadData.documentName = customDocName.trim();
      }

      await uploadDocument(uploadData).unwrap();

      alert(
        `${selectedOtherDoc === "visa" ? "Visa" : customDocName} ${type} uploaded successfully!`,
      );
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Failed to upload ${type} image`);

      // Remove from preview on error
      setUploads((prev) => ({
        ...prev,
        [selectedOtherDoc]: {
          ...prev[selectedOtherDoc],
          [type]: null,
        },
      }));
    }
  };

  const removeFile = (docName, type) => {
    setUploads((prev) => ({
      ...prev,
      [docName]: {
        ...prev[docName],
        [type]: null,
      },
    }));
  };

  // Check if document is uploaded on backend
  const isDocumentUploaded = (docName) => {
    const backendKey = documentMapping[docName];
    const doc = userProfile?.[backendKey];
    return doc?.frontImage && doc?.backImage;
  };

  // Get uploaded image URL from backend
  const getUploadedImage = (docName, side) => {
    const backendKey = documentMapping[docName];
    const doc = userProfile?.[backendKey];
    return side === "front" ? doc?.frontImage : doc?.backImage;
  };

  // Get uploaded image for other documents (visa, otherDocument)
  const getOtherDocImage = (docType, side) => {
    if (docType === "visa") {
      return side === "front"
        ? userProfile?.visa?.frontImage
        : userProfile?.visa?.backImage;
    }
    if (docType === "other") {
      return side === "front"
        ? userProfile?.otherDocument?.frontImage
        : userProfile?.otherDocument?.backImage;
    }
    return null;
  };

  if (profileLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="h-12 bg-gray-200 rounded mb-2"></div>
        <div className="h-12 bg-gray-200 rounded mb-2"></div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-medium mb-3">KYC Documents</h3>

      {documents.map((item, idx) => {
        const uploaded = isDocumentUploaded(item);

        return (
          <div key={idx} className="border rounded-md mb-2 border-gray-300">
            {/* Collapse Header */}
            <button
              className="w-full flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleSection(idx)}
            >
              <div className="flex items-center gap-2">
                <span>{item}</span>
                {uploaded && (
                  <FaCheckCircle className="text-green-500 text-sm" />
                )}
              </div>
              <FaChevronDown
                className={`transform transition ${
                  openSection === idx ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Collapse Content */}
            {openSection === idx && (
              <div className="p-4 bg-gray-50 rounded-b-md">
                {/* Alert Box */}
                <div className="bg-yellow-100 text-yellow-700 text-sm p-3 rounded mb-4">
                  If {item.toLowerCase()} is unavailable, please choose and
                  upload any one document from below.
                </div>

                {/* Instruction */}
                <p className="text-gray-600 mb-4 text-sm">
                  Upload front and back of {item}. Please make sure that you
                  upload a clear copy.
                </p>

                {/* Upload Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Front Upload */}
                  <label className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-400 transition relative">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, item, "front")}
                      disabled={uploading}
                    />

                    {/* Show local preview or backend image */}
                    {uploads[item]?.front ? (
                      <div className="flex flex-col items-center">
                        {uploads[item].front.type === "application/pdf" ? (
                          <div className="flex items-center gap-2">
                            <FaFilePdf className="text-red-600 text-2xl" />
                            <span className="text-sm">
                              {uploads[item].front.name}
                            </span>
                          </div>
                        ) : (
                          <img
                            src={URL.createObjectURL(uploads[item].front)}
                            alt="front preview"
                            className="h-24 object-contain mb-2"
                          />
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeFile(item, "front");
                          }}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : getUploadedImage(item, "front") ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={getUploadedImage(item, "front")}
                          alt="front uploaded"
                          className="h-24 object-contain mb-2"
                        />
                        <p className="text-xs text-green-600 mt-2">
                          ✓ Uploaded
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-100 p-3 rounded-full mb-2">
                          <FaFolderOpen className="text-blue-600 text-xl" />
                        </div>
                        <p className="font-medium text-sm">
                          Upload front image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Upload from device. You can also take a picture.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          File types: .png, .jpg, .pdf | Max size: 5MB
                        </p>
                      </div>
                    )}
                  </label>

                  {/* Back Upload */}
                  <label className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-400 transition relative">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, item, "back")}
                      disabled={uploading}
                    />

                    {uploads[item]?.back ? (
                      <div className="flex flex-col items-center">
                        {uploads[item].back.type === "application/pdf" ? (
                          <div className="flex items-center gap-2">
                            <FaFilePdf className="text-red-600 text-2xl" />
                            <span className="text-sm">
                              {uploads[item].back.name}
                            </span>
                          </div>
                        ) : (
                          <img
                            src={URL.createObjectURL(uploads[item].back)}
                            alt="back preview"
                            className="h-24 object-contain mb-2"
                          />
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeFile(item, "back");
                          }}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : getUploadedImage(item, "back") ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={getUploadedImage(item, "back")}
                          alt="back uploaded"
                          className="h-24 object-contain mb-2"
                        />
                        <p className="text-xs text-green-600 mt-2">
                          ✓ Uploaded
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-100 p-3 rounded-full mb-2">
                          <FaFolderOpen className="text-blue-600 text-xl" />
                        </div>
                        <p className="font-medium text-sm">Upload back image</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Upload from device. You can also take a picture.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          File types: .png, .jpg, .pdf | Max size: 5MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {/* Upload Status */}
                {uploading && (
                  <div className="text-center text-sm text-blue-600">
                    Uploading...
                  </div>
                )}

                {/* Footer Link */}

                <a
                  href="#"
                  className="text-blue-600 text-sm font-medium hover:underline block mt-3"
                >
                  Document upload information →
                </a>
              </div>
            )}
          </div>
        );
      })}

      {/* Other Docs Dropdown */}
      <div className="mt-3">
        <select
          className="w-full border rounded-md p-2 border-gray-300 text-sm"
          value={selectedOtherDoc}
          onChange={(e) => {
            setSelectedOtherDoc(e.target.value);
            if (e.target.value === "") {
              setCustomDocName("");
            }
          }}
        >
          <option value="">Select Other documents</option>
          <option value="visa">Visa</option>
          <option value="other">Other ID Proof</option>
        </select>
      </div>

      {/* Upload Section for Selected Other Document */}
      {selectedOtherDoc && (
        <div className="mt-3 border rounded-md p-4 border-gray-300 bg-gray-50">
          <h4 className="font-medium mb-3">
            {selectedOtherDoc === "visa"
              ? "Visa Upload"
              : "Other ID Proof Upload"}
          </h4>

          {/* Document Name Input for "Other ID Proof" */}
          {selectedOtherDoc === "other" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Name *
              </label>
              <input
                type="text"
                placeholder="Enter document name (e.g., Covid Certificate, Health Card)"
                value={customDocName}
                onChange={(e) => setCustomDocName(e.target.value)}
                className="w-full border rounded-md p-2 border-gray-400 text-sm"
              />
              {userProfile?.otherDocument?.documentName && (
                <p className="text-xs text-green-600 mt-1">
                  Current: {userProfile.otherDocument.documentName}
                </p>
              )}
            </div>
          )}

          {/* Instruction */}
          <p className="text-gray-600 mb-4 text-sm">
            Upload front and back images. Please make sure that you upload a
            clear copy.
          </p>

          {/* Upload Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Front Upload */}
            <label className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-400 transition relative">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                className="hidden"
                onChange={(e) => handleOtherDocUpload(e, "front")}
                disabled={uploading}
              />

              {uploads[selectedOtherDoc]?.front ? (
                <div className="flex flex-col items-center">
                  {uploads[selectedOtherDoc].front.type ===
                  "application/pdf" ? (
                    <div className="flex items-center gap-2">
                      <FaFilePdf className="text-red-600 text-2xl" />
                      <span className="text-sm">
                        {uploads[selectedOtherDoc].front.name}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={URL.createObjectURL(uploads[selectedOtherDoc].front)}
                      alt="front preview"
                      className="h-24 object-contain mb-2"
                    />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setUploads((prev) => ({
                        ...prev,
                        [selectedOtherDoc]: {
                          ...prev[selectedOtherDoc],
                          front: null,
                        },
                      }));
                    }}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : getOtherDocImage(selectedOtherDoc, "front") ? (
                <div className="flex flex-col items-center">
                  <img
                    src={getOtherDocImage(selectedOtherDoc, "front")}
                    alt="front uploaded"
                    className="h-24 object-contain mb-2"
                  />
                  <p className="text-xs text-green-600 mt-2">✓ Uploaded</p>
                  <p className="text-xs text-blue-600 mt-1">Click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-2">
                    <FaFolderOpen className="text-blue-600 text-xl" />
                  </div>
                  <p className="font-medium text-sm">Upload front image</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload from device. You can also take a picture.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    File types: .png, .jpg, .pdf | Max size: 5MB
                  </p>
                </div>
              )}
            </label>

            {/* Back Upload */}
            <label className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-400 transition relative">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                className="hidden"
                onChange={(e) => handleOtherDocUpload(e, "back")}
                disabled={uploading}
              />

              {uploads[selectedOtherDoc]?.back ? (
                <div className="flex flex-col items-center">
                  {uploads[selectedOtherDoc].back.type === "application/pdf" ? (
                    <div className="flex items-center gap-2">
                      <FaFilePdf className="text-red-600 text-2xl" />
                      <span className="text-sm">
                        {uploads[selectedOtherDoc].back.name}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={URL.createObjectURL(uploads[selectedOtherDoc].back)}
                      alt="back preview"
                      className="h-24 object-contain mb-2"
                    />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setUploads((prev) => ({
                        ...prev,
                        [selectedOtherDoc]: {
                          ...prev[selectedOtherDoc],
                          back: null,
                        },
                      }));
                    }}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : getOtherDocImage(selectedOtherDoc, "back") ? (
                <div className="flex flex-col items-center">
                  <img
                    src={getOtherDocImage(selectedOtherDoc, "back")}
                    alt="back uploaded"
                    className="h-24 object-contain mb-2"
                  />
                  <p className="text-xs text-green-600 mt-2">✓ Uploaded</p>
                  <p className="text-xs text-blue-600 mt-1">Click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-2">
                    <FaFolderOpen className="text-blue-600 text-xl" />
                  </div>
                  <p className="font-medium text-sm">Upload back image</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload from device. You can also take a picture.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    File types: .png, .jpg, .pdf | Max size: 5MB
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Upload Status */}
          {uploading && (
            <div className="text-center text-sm text-blue-600">
              Uploading...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
