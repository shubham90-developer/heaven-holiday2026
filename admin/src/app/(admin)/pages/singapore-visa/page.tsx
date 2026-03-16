"use client";

import React, { useState, useEffect } from "react";
import {
  useGetVisaInfoQuery,
  useUpdateVisaInfoMutation,
} from "@/app/redux/api/singapore-visa/singaporevisaApi";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import ReactQuill from "react-quill-new";

// styles
import "react-quill-new/dist/quill.snow.css";

const VisaInfoForm: React.FC = () => {
  const { data: visaInfoData, isLoading } = useGetVisaInfoQuery(undefined);
  const [updateVisaInfo, { isLoading: isUpdating, isSuccess, isError }] =
    useUpdateVisaInfoMutation();

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
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
    if (visaInfoData?.data) {
      setFormData({
        heading: visaInfoData.data.heading || "",
        description: visaInfoData.data.description || "",
      });
    }
  }, [visaInfoData]);

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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (content: string) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateVisaInfo({
        heading: formData.heading,
        description: formData.description,
        status: "active",
      }).unwrap();
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
      <PageTitle title="Visa Information" subTitle="Content Management" />

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
            <strong>Success!</strong> Visa information has been updated
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
            <strong>Error!</strong> Failed to update visa information. Please
            try again.
          </div>
        </Alert>
      )}

      <Row>
        <Col xs={12}>
          <ComponentContainerCard
            title="Visa Information Content"
            description="Manage visa information heading and description."
          >
            <form onSubmit={handleSubmit}>
              <Row className="gy-4">
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="visa-heading" className="form-label">
                      Heading
                    </label>
                    <div style={{ height: "250px" }}>
                      <ReactQuill
                        id="visa-heading"
                        modules={modules}
                        value={formData.heading}
                        onChange={(content) =>
                          setFormData((prev) => ({ ...prev, heading: content }))
                        }
                        theme="snow"
                        placeholder="Enter heading..."
                        style={{ height: "200px", marginBottom: "50px" }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="gy-4">
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="visa-description" className="form-label">
                      Description
                    </label>
                    <div style={{ height: "400px" }}>
                      <ReactQuill
                        id="visa-description"
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

export default VisaInfoForm;
