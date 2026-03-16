// app/admin/travel-deal-banner/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  useGetTravelDealBannerQuery,
  useUpdateTravelDealBannerMutation,
} from "@/app/redux/api/travel-deals/main-bannerAPi";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { FileUploader } from "@/components/FileUploader";

const TravelDealBannerForm: React.FC = () => {
  const { data: bannerData, isLoading } = useGetTravelDealBannerQuery();
  const [updateBanner, { isLoading: isUpdating, isSuccess, isError }] =
    useUpdateTravelDealBannerMutation();

  const [status, setStatus] = useState("inactive");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // Load existing data
  useEffect(() => {
    if (bannerData?.data) {
      setStatus(bannerData.data.status || "inactive");
      setImagePreview(bannerData.data.image || "");
    }
  }, [bannerData]);

  // Show success alert
  useEffect(() => {
    if (isSuccess) {
      setImageFile(null);
      setShowSuccessAlert(true);
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Show error alert
  useEffect(() => {
    if (isError) {
      setShowErrorAlert(true);
      const timer = setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isError]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleImageChange = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("status", status);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await updateBanner(formData).unwrap();
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

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
      <PageTitle title="Travel Deal Banner" subTitle="Banner Management" />

      {showSuccessAlert && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setShowSuccessAlert(false)}
          className="d-flex align-items-center"
        >
          <IconifyIcon
            icon="solar:check-read-line-duotone"
            className="fs-20 me-2"
          />
          <div className="lh-1">
            <strong>Success!</strong> Banner has been updated successfully.
          </div>
        </Alert>
      )}

      {showErrorAlert && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setShowErrorAlert(false)}
          className="d-flex align-items-center"
        >
          <IconifyIcon
            icon="solar:danger-triangle-bold-duotone"
            className="fs-20 me-2"
          />
          <div className="lh-1">
            <strong>Error!</strong> Failed to update banner. Please try again.
          </div>
        </Alert>
      )}

      <Row>
        <Col xs={12}>
          <ComponentContainerCard
            title="Banner Settings"
            description="Update banner image and status."
          >
            <form onSubmit={handleSubmit}>
              <Row className="gy-4">
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="banner-status" className="form-label">
                      Status
                    </label>
                    <select
                      id="banner-status"
                      value={status}
                      onChange={handleStatusChange}
                      className="form-select"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </Col>
              </Row>

              <Row className="gy-4">
                <Col xs={12}>
                  <div className="mb-3">
                    <label htmlFor="banner-image" className="form-label">
                      Banner Image
                    </label>

                    {imagePreview && (
                      <div className="mb-3">
                        <Alert
                          variant="info"
                          className="d-flex align-items-center"
                        >
                          <IconifyIcon
                            icon="solar:info-circle-bold-duotone"
                            className="fs-20 me-2"
                          />
                          <div className="lh-1">
                            {imageFile
                              ? "New image preview:"
                              : "Current image:"}
                          </div>
                        </Alert>
                        <img
                          src={imagePreview}
                          alt="Banner Preview"
                          className="img-fluid rounded"
                          style={{
                            maxHeight: "400px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}

                    <FileUploader
                      onFileUpload={handleImageChange}
                      icon="ri:upload-cloud-2-line"
                      text="Drop image files here or click to upload."
                      extraText="(Maximum file size: 10MB. Supported formats: JPG, PNG, WebP, etc.)"
                    />
                  </div>
                </Col>
              </Row>

              <div className="text-end mt-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  );
};

export default TravelDealBannerForm;
