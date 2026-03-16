"use client";

import React, { useState, useEffect } from "react";
import {
  useGetEmpoweringQuery,
  useUpdateEmpoweringMutation,
} from "@/app/redux/api/careers/empowering-womenApi";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Row, Col, Alert, Button } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import ReactQuill from "react-quill-new";

// styles
import "react-quill-new/dist/quill.snow.css";

const EmpoweringWomenForm: React.FC = () => {
  const { data: empoweringData, isLoading } = useGetEmpoweringQuery(undefined);
  const [updateEmpowering, { isLoading: isUpdating, isSuccess, isError }] =
    useUpdateEmpoweringMutation();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    paragraphs: [""],
    footerTitle: "",
    disclaimer: "",
    isActive: true,
  });

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
    if (empoweringData?.data) {
      setFormData({
        title: empoweringData.data.title || "",
        subtitle: empoweringData.data.subtitle || "",
        paragraphs: empoweringData.data.paragraphs || [""],
        footerTitle: empoweringData.data.footerTitle || "",
        disclaimer: empoweringData.data.disclaimer || "",
        isActive: empoweringData.data.isActive ?? true,
      });
    }
  }, [empoweringData]);

  // Show success alert
  useEffect(() => {
    if (isSuccess) {
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleParagraphChange = (index: number, content: string) => {
    const newParagraphs = [...formData.paragraphs];
    newParagraphs[index] = content;
    setFormData((prev) => ({ ...prev, paragraphs: newParagraphs }));
  };

  const addParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      paragraphs: [...prev.paragraphs, ""],
    }));
  };

  const removeParagraph = (index: number) => {
    if (formData.paragraphs.length > 1) {
      const newParagraphs = formData.paragraphs.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, paragraphs: newParagraphs }));
    }
  };

  const handleDisclaimerChange = (content: string) => {
    setFormData((prev) => ({ ...prev, disclaimer: content }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateEmpowering(formData).unwrap();
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
      <PageTitle title="Empowering Women Form" subTitle="Forms" />

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
            title="Empowering Women Content"
            description="Add title, subtitle, paragraphs, footer and disclaimer content."
          >
            <form onSubmit={handleSubmit}>
              <Row className="gy-4">
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
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
                    <label htmlFor="subtitle" className="form-label">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      id="subtitle"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter subtitle"
                      required
                    />
                  </div>
                </Col>
              </Row>

              <Row className="gy-4">
                <Col lg={12}>
                  <div className="mb-3">
                    <label className="form-label">Paragraphs</label>
                    {formData.paragraphs.map((paragraph, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">
                            Paragraph {index + 1}
                          </span>
                          {formData.paragraphs.length > 1 && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => removeParagraph(index)}
                            >
                              <IconifyIcon
                                icon="solar:trash-bin-trash-bold-duotone"
                                className="me-1"
                              />
                              Remove
                            </Button>
                          )}
                        </div>
                        <div style={{ height: "250px" }}>
                          <ReactQuill
                            modules={modules}
                            value={paragraph}
                            onChange={(content) =>
                              handleParagraphChange(index, content)
                            }
                            theme="snow"
                            placeholder="Enter paragraph content..."
                            style={{ height: "200px" }}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline-primary"
                      onClick={addParagraph}
                      className="mt-2"
                    >
                      <IconifyIcon
                        icon="solar:add-circle-bold-duotone"
                        className="me-1"
                      />
                      Add Paragraph
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row className="gy-4">
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="footerTitle" className="form-label">
                      Footer Title
                    </label>
                    <input
                      type="text"
                      id="footerTitle"
                      name="footerTitle"
                      value={formData.footerTitle}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter footer title"
                      required
                    />
                  </div>
                </Col>
              </Row>

              <Row className="gy-4">
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="disclaimer" className="form-label">
                      Disclaimer
                    </label>
                    <div style={{ height: "250px" }}>
                      <ReactQuill
                        id="disclaimer"
                        modules={modules}
                        value={formData.disclaimer}
                        onChange={handleDisclaimerChange}
                        theme="snow"
                        placeholder="Enter disclaimer content..."
                        style={{ height: "200px" }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="gy-4">
                <Col lg={12}>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="form-check-input"
                    />
                    <label htmlFor="isActive" className="form-check-label">
                      Active
                    </label>
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

export default EmpoweringWomenForm;
