"use client";

import React, { useState, useEffect } from "react";

import {
  useGetCareersQuery,
  useUpdateCareersMutation,
} from "@/app/redux/api/careers/careersHeaderApi";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { FileUploader } from "@/components/FileUploader";
import ReactQuill from "react-quill-new";

// styles
import "react-quill-new/dist/quill.snow.css";

const CareersPageForm: React.FC = () => {
  const { data: careersData, isLoading } = useGetCareersQuery(undefined);
  const [updateCareers, { isLoading: isUpdating, isSuccess, isError }] =
    useUpdateCareersMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // Quill editor modules
  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "super" }, { script: "sub" }],
      [{ header: [false, 1, 2, 3, 4, 5, 6] }, "blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["direction", { align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  // Load existing data into form fields
  useEffect(() => {
    if (careersData?.data) {
      setFormData({
        title: careersData.data.title || "",
        description: careersData.data.description || "",
        buttonText: careersData.data.buttonText || "",
        buttonLink: careersData.data.buttonLink || "",
      });
      setVideoPreview(careersData.data.videoUrl || "");
      setThumbnailPreview(careersData.data.videoThumbnail || "");
    }
  }, [careersData]);

  // Show success alert
  useEffect(() => {
    if (isSuccess) {
      setVideoFile(null);
      setThumbnailFile(null);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (content: string) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  const handleVideoChange = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleThumbnailChange = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file size (5MB for images)
    if (file.size > 5 * 1024 * 1024) {
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("buttonText", formData.buttonText);
    submitData.append("buttonLink", formData.buttonLink);

    if (videoFile) {
      submitData.append("video", videoFile);
    }

    if (thumbnailFile) {
      submitData.append("thumbnail", thumbnailFile);
    }

    try {
      await updateCareers(submitData).unwrap();
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
      <PageTitle title="Careers Page Form" subTitle="Forms" />

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
            <strong>Success!</strong> Careers content has been updated
            successfully.
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
            <strong>Error!</strong> Failed to update careers content. Please try
            again.
          </div>
        </Alert>
      )}

      <Row>
        <Col xs={12}>
          <ComponentContainerCard
            title="Careers Page Content"
            description="Update title, description, button text, thumbnail and video content."
          >
            <form onSubmit={handleSubmit}>
              <Row className="gy-4">
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="careers-title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      id="careers-title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter title"
                      required
                    />
                  </div>
                </Col>
              </Row>

              <Row className="gy-4">
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="careers-description" className="form-label">
                      Description
                    </label>
                    <div style={{ height: "400px" }}>
                      <ReactQuill
                        id="careers-description"
                        modules={modules}
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        theme="snow"
                        placeholder="Enter description..."
                        style={{ height: "350px" }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="gy-4">
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="careers-button-text" className="form-label">
                      Button Text
                    </label>
                    <input
                      type="text"
                      id="careers-button-text"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter button text"
                      required
                    />
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="careers-button-link" className="form-label">
                      Button Link
                    </label>
                    <input
                      type="text"
                      id="careers-button-link"
                      name="buttonLink"
                      value={formData.buttonLink}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter button link (e.g., /careers)"
                      required
                    />
                  </div>
                </Col>
              </Row>

              <Row className="gy-4">
                <Col xs={12}>
                  <div className="mb-3">
                    <label htmlFor="careers-thumbnail" className="form-label">
                      Video Thumbnail Upload
                    </label>

                    {thumbnailPreview && (
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
                            {thumbnailFile
                              ? "New thumbnail preview:"
                              : "Current thumbnail:"}
                          </div>
                        </Alert>
                        <img
                          src={thumbnailPreview}
                          alt="Video Thumbnail"
                          className="img-fluid rounded"
                          style={{
                            maxHeight: "300px",
                            width: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    )}

                    <FileUploader
                      onFileUpload={handleThumbnailChange}
                      icon="ri:image-add-line"
                      text="Drop thumbnail image here or click to upload."
                      extraText="(Maximum file size: 5MB. Supported formats: JPG, PNG, WebP)"
                    />
                  </div>
                </Col>
              </Row>

              <Row className="gy-4">
                <Col xs={12}>
                  <div className="mb-3">
                    <label htmlFor="careers-video" className="form-label">
                      Video Upload
                    </label>

                    {videoPreview && (
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
                            {videoFile
                              ? "New video preview:"
                              : "Current video:"}
                          </div>
                        </Alert>
                        <video
                          src={videoPreview}
                          controls
                          className="img-fluid rounded"
                          style={{
                            maxHeight: "400px",
                            width: "100%",
                            objectFit: "contain",
                            backgroundColor: "#000",
                          }}
                        />
                      </div>
                    )}

                    <FileUploader
                      onFileUpload={handleVideoChange}
                      icon="ri:upload-cloud-2-line"
                      text="Drop video files here or click to upload."
                      extraText="(Maximum file size: 50MB. Supported formats: MP4, WebM, etc.)"
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

export default CareersPageForm;
