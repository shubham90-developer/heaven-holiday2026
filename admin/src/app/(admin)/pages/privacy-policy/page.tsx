"use client";

import React, { useState, useEffect } from "react";
import {
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} from "@/app/redux/api/privacy-policy/privacyPolicyApi";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import ReactQuill from "react-quill-new";

// styles
import "react-quill-new/dist/quill.snow.css";

const PrivacyPolicyForm = () => {
  const { data: privacyPolicyData, isLoading } =
    useGetPrivacyPolicyQuery(undefined);
  const [updatePrivacyPolicy, { isLoading: isUpdating, isSuccess, isError }] =
    useUpdatePrivacyPolicyMutation();

  const [content, setContent] = useState("");
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
    if (privacyPolicyData?.data) {
      setContent(privacyPolicyData.data.content || "");
    }
  }, [privacyPolicyData]);

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

  const handleContentChange = (value: any) => {
    setContent(value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await updatePrivacyPolicy(content).unwrap();
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
      <PageTitle title="Privacy Policy" subTitle="Settings" />

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
            <strong>Success!</strong> Privacy policy has been updated
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
            <strong>Error!</strong> Failed to update privacy policy. Please try
            again.
          </div>
        </Alert>
      )}

      <Row>
        <Col xs={12}>
          <ComponentContainerCard
            title="Privacy Policy Content"
            description="Update your privacy policy content."
          >
            <form onSubmit={handleSubmit}>
              <Row className="gy-4">
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="privacy-content" className="form-label">
                      Content
                    </label>
                    <div style={{ height: "400px" }}>
                      <ReactQuill
                        id="privacy-content"
                        modules={modules}
                        value={content}
                        onChange={handleContentChange}
                        theme="snow"
                        placeholder="Enter privacy policy content..."
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

export default PrivacyPolicyForm;
