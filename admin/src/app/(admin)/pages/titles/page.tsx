"use client";

import React, { useState, useEffect } from "react";
import {
  useGetPageTitlesQuery,
  useUpdatePageTitlesMutation,
} from "@/app/redux/api/titles/titlesApi";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const PageTitlesForm: React.FC = () => {
  const { data: pageTitlesData, isLoading } = useGetPageTitlesQuery(undefined);
  const [updatePageTitles, { isLoading: isUpdating, isSuccess, isError }] =
    useUpdatePageTitlesMutation();

  const [formData, setFormData] = useState({
    offersTitle: "",
    offersSubtitle: "",
    servicesTitle: "",
    worldTitle: "",
    indiaTitle: "",
    blogsTitle: "",
    podcastTitle: "",
  });

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // Load existing data into form fields
  useEffect(() => {
    if (pageTitlesData?.data) {
      setFormData({
        offersTitle: pageTitlesData.data.offersTitle || "",
        offersSubtitle: pageTitlesData.data.offersSubtitle || "",
        servicesTitle: pageTitlesData.data.servicesTitle || "",
        worldTitle: pageTitlesData.data.worldTitle || "",
        indiaTitle: pageTitlesData.data.indiaTitle || "",
        blogsTitle: pageTitlesData.data.blogsTitle || "",
        podcastTitle: pageTitlesData.data.podcastTitle || "",
      });
    }
  }, [pageTitlesData]);

  // Show success alert
  useEffect(() => {
    if (isSuccess) {
      setShowSuccessAlert(true);
      const timer = setTimeout(() => setShowSuccessAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Show error alert
  useEffect(() => {
    if (isError) {
      setShowErrorAlert(true);
      const timer = setTimeout(() => setShowErrorAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updatePageTitles(formData).unwrap();
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
      <PageTitle title="Page Titles" subTitle="Settings" />

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
            <strong>Success!</strong> Page titles updated successfully.
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
            <strong>Error!</strong> Failed to update page titles. Please try
            again.
          </div>
        </Alert>
      )}

      <Row>
        <Col xs={12}>
          <ComponentContainerCard
            title="Page Titles"
            description="Manage section titles and subtitles displayed across the website."
          >
            <form onSubmit={handleSubmit}>
              <Row className="gy-4">
                <Col lg={6}>
                  <div className="mb-3">
                    <label className="form-label">Offers Title</label>
                    <input
                      type="text"
                      name="offersTitle"
                      value={formData.offersTitle}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter offers title"
                      required
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label className="form-label">Offers Subtitle</label>
                    <input
                      type="text"
                      name="offersSubtitle"
                      value={formData.offersSubtitle}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter offers subtitle"
                      required
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label className="form-label">Services Title</label>
                    <input
                      type="text"
                      name="servicesTitle"
                      value={formData.servicesTitle}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter services title"
                      required
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label className="form-label">World Title</label>
                    <input
                      type="text"
                      name="worldTitle"
                      value={formData.worldTitle}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter world title"
                      required
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label className="form-label">India Title</label>
                    <input
                      type="text"
                      name="indiaTitle"
                      value={formData.indiaTitle}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter india title"
                      required
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label className="form-label">Blogs Title</label>
                    <input
                      type="text"
                      name="blogsTitle"
                      value={formData.blogsTitle}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter blogs title"
                      required
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label className="form-label">Podcast Title</label>
                    <input
                      type="text"
                      name="podcastTitle"
                      value={formData.podcastTitle}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter podcast title"
                      required
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

export default PageTitlesForm;
