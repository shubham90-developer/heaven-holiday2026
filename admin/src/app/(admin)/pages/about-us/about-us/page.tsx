"use client";

import React, { useState, useEffect } from "react";
import {
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
} from "@/app/redux/api/aboutus/aboutUsApi";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { FileUploader } from "@/components/FileUploader";
import ReactQuill from "react-quill-new";

// styles
import "react-quill-new/dist/quill.snow.css";

const NewPageForm: React.FC = () => {
  const { data: aboutUsData, isLoading } = useGetAboutUsQuery(undefined);
  const [updateAboutUs, { isLoading: isUpdating, isSuccess, isError }] =
    useUpdateAboutUsMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
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
    if (aboutUsData?.data) {
      setFormData({
        title: aboutUsData.data.title || "",
        description: aboutUsData.data.description || "",
      });
      setVideoPreview(aboutUsData.data.video || "");
      setThumbnailPreview(aboutUsData.data.thumbnail || "");
    }
  }, [aboutUsData]);

  // Show success alert
  useEffect(() => {
    if (isSuccess) {
      setVideoFile(null);
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
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);

    if (videoFile) {
      submitData.append("video", videoFile);
    }
    if (thumbnailFile) {
      submitData.append("thumbnail", thumbnailFile);
    }

    try {
      await updateAboutUs(submitData).unwrap();
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
      <PageTitle title="New Page Form" subTitle="Forms" />

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
            <strong>Success!</strong> Content has been submitted successfully.
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
            <strong>Error!</strong> Failed to submit content. Please try again.
          </div>
        </Alert>
      )}

      <Row>
        <Col xs={12}>
          <ComponentContainerCard
            title="Page Content"
            description="Add title, description and video content."
          >
            <form onSubmit={handleSubmit}>
              <Row className="gy-4">
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="page-title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      id="page-title"
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
                    <label htmlFor="page-description" className="form-label">
                      Description
                    </label>
                    <div style={{ height: "400px" }}>
                      <ReactQuill
                        id="page-description"
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
                <Col xs={12}>
                  <div className="mb-3">
                    <label htmlFor="page-video" className="form-label">
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
                <Col xs={12}>
                  <div className="mb-3">
                    <label className="form-label">Thumbnail Upload</label>

                    {thumbnailPreview && (
                      <div className="mb-3">
                        <img
                          src={thumbnailPreview}
                          className="img-fluid rounded"
                          style={{ maxHeight: "200px", objectFit: "contain" }}
                        />
                      </div>
                    )}

                    <FileUploader
                      onFileUpload={handleThumbnailChange}
                      icon="ri:upload-cloud-2-line"
                      text="Drop thumbnail image here or click to upload."
                      extraText="(Supported formats: JPG, PNG, WebP)"
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

export default NewPageForm;
