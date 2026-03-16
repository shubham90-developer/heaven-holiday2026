"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetFooterInfoQuery,
  useUpdateFooterInfoMutation,
} from "@/app/redux/api/aboutus/footerInfoApi";

type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const quillModules = {
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

export default function FooterInfoPage() {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetFooterInfoQuery(undefined);
  const [updateFooterInfo, { isLoading: isUpdating }] =
    useUpdateFooterInfoMutation();

  const footerInfo = data?.data || null;

  // --- State ---
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [alert, setAlert] = useState<AlertType>({
    show: false,
    message: "",
    variant: "success",
  });

  const showAlert = (message: string, variant: AlertType["variant"]) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert({ show: false, message: "", variant: "success" });
    }, 5000);
  };

  const handleOpenModal = () => {
    if (footerInfo) {
      setTitle(footerInfo.title || "");
      setDescription(footerInfo.description || "");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTitle("");
    setDescription("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    try {
      await updateFooterInfo({
        title: title.trim(),
        description,
      }).unwrap();

      showAlert("Footer info updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message || "Failed to update footer info!",
        "danger"
      );
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

  if (isError) {
    return (
      <div className="container mt-5">
        <Alert variant="danger" className="d-flex align-items-center">
          <IconifyIcon
            icon="solar:danger-triangle-bold-duotone"
            className="fs-20 me-2"
          />
          <div>
            <strong>Error!</strong> Failed to load footer info. Please try again
            later.
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <PageTitle
            title="Footer Info Management"
            subTitle="Content Management"
          />

          {alert.show && (
            <Alert
              variant={alert.variant}
              dismissible
              onClose={() => setAlert({ ...alert, show: false })}
              className="d-flex align-items-center mb-3"
            >
              <IconifyIcon
                icon={
                  alert.variant === "success"
                    ? "solar:check-read-line-duotone"
                    : alert.variant === "danger"
                    ? "solar:danger-triangle-bold-duotone"
                    : alert.variant === "warning"
                    ? "solar:shield-warning-line-duotone"
                    : "solar:info-circle-bold-duotone"
                }
                className="fs-20 me-2"
              />
              <div className="lh-1">{alert.message}</div>
            </Alert>
          )}

          <ComponentContainerCard
            title="Footer Information"
            description="Manage footer title and description displayed on your website."
          >
            {footerInfo ? (
              <>
                <div className="mb-4 p-4 bg-light rounded">
                  <div className="mb-3">
                    <h5 className="text-muted mb-2">Title</h5>
                    <h4 className="mb-0">{footerInfo.title}</h4>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-muted mb-2">Description</h5>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: footerInfo.description,
                      }}
                      className="ql-editor p-0"
                    />
                  </div>

                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted">
                      <strong>Last Updated:</strong>{" "}
                      {new Date(footerInfo.updatedAt).toLocaleString()}
                    </small>
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <Button onClick={handleOpenModal} variant="primary">
                    <IconifyIcon icon="tabler:edit" className="me-1" />
                    Update Footer Info
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <IconifyIcon
                  icon="solar:document-text-bold-duotone"
                  className="fs-1 text-muted mb-3"
                />
                <p className="text-muted mb-0">No footer info found!</p>
              </div>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Footer Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter footer title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Description <span className="text-danger">*</span>
              </Form.Label>
              <div style={{ height: "400px", marginBottom: "50px" }}>
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  modules={quillModules}
                  placeholder="Enter footer description..."
                  style={{ height: "350px" }}
                />
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isUpdating}>
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
                  "Update"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
