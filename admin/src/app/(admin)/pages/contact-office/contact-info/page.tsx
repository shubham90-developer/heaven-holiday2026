"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetContactFeaturesQuery,
  useCreateContactFeaturesMutation,
  useCreateFeatureMutation,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
  useUpdateHighlightMutation,
} from "@/app/redux/api/contactCity/contactInfoBoxApi";

import Link from "next/link";

type ModalType = "create" | "feature" | "highlight" | null;
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

const ContactFeaturesPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetContactFeaturesQuery(undefined);
  const [createContactFeatures, { isLoading: isCreatingDocument }] =
    useCreateContactFeaturesMutation();
  const [createFeature, { isLoading: isCreatingFeature }] =
    useCreateFeatureMutation();
  const [updateFeature, { isLoading: isUpdatingFeature }] =
    useUpdateFeatureMutation();
  const [deleteFeature] = useDeleteFeatureMutation();
  const [updateHighlight, { isLoading: isUpdatingHighlight }] =
    useUpdateHighlightMutation();

  const contactFeatures = data?.data;
  const features = contactFeatures?.features || [];
  const highlight = contactFeatures?.highlight;

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Create document state
  const [message, setMessage] = useState("");
  const [happyTravellers, setHappyTravellers] = useState("");
  const [successfulTours, setSuccessfulTours] = useState("");

  // Feature state
  const [featureTitle, setFeatureTitle] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");
  const [featureStatus, setFeatureStatus] = useState(true);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);

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

  const handleCloseModal = () => {
    setModalType(null);
    setIsEditMode(false);
    setMessage("");
    setHappyTravellers("");
    setSuccessfulTours("");
    setFeatureTitle("");
    setFeatureDescription("");
    setFeatureStatus(true);
    setEditingFeatureId(null);
  };

  // --- Create Document Modal Handlers ---
  const handleOpenCreateModal = () => {
    setMessage("");
    setHappyTravellers("");
    setSuccessfulTours("");
    setModalType("create");
  };

  const handleCreateDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !happyTravellers || !successfulTours) {
      showAlert("Please fill all fields!", "warning");
      return;
    }

    try {
      await createContactFeatures({
        message,
        happyTravellers,
        successfulTours,
      }).unwrap();
      showAlert("Contact features created successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Creation failed!", "danger");
    }
  };

  // --- Highlight Modal Handlers ---
  const handleOpenHighlightModal = () => {
    if (highlight) {
      setMessage(highlight.message || "");
      setHappyTravellers(highlight.happyTravellers || "");
      setSuccessfulTours(highlight.successfulTours || "");
    }
    setModalType("highlight");
  };

  const handleHighlightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !happyTravellers || !successfulTours) {
      showAlert("Please fill all fields!", "warning");
      return;
    }

    try {
      await updateHighlight({
        message,
        happyTravellers,
        successfulTours,
      }).unwrap();
      showAlert("Highlight updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    }
  };

  // --- Feature Modal Handlers ---
  const handleOpenFeatureModal = (editMode: boolean, feature?: any) => {
    setIsEditMode(editMode);
    if (editMode && feature) {
      setFeatureTitle(feature.title);
      setFeatureDescription(feature.description);
      setFeatureStatus(feature.isActive);
      setEditingFeatureId(feature._id);
    } else {
      setFeatureTitle("");
      setFeatureDescription("");
      setFeatureStatus(true);
      setEditingFeatureId(null);
    }
    setModalType("feature");
  };

  const handleFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!featureTitle || !featureDescription) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    try {
      const payload = {
        title: featureTitle,
        description: featureDescription,
        isActive: featureStatus,
      };

      if (isEditMode && editingFeatureId) {
        await updateFeature({
          featureId: editingFeatureId,
          ...payload,
        }).unwrap();
        showAlert("Feature updated successfully!", "success");
      } else {
        await createFeature(payload).unwrap();
        showAlert("Feature added successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm("Are you sure you want to delete this feature?")) return;
    try {
      await deleteFeature(featureId).unwrap();
      showAlert("Feature deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "create") {
      return "Create Contact Features Document";
    }
    if (modalType === "highlight") {
      return "Update Highlight";
    }
    if (modalType === "feature") {
      return isEditMode ? "Edit Feature" : "Add Feature";
    }
    return "";
  };

  const renderModalContent = () => {
    if (modalType === "create") {
      return (
        <Form onSubmit={handleCreateDocumentSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Message *</Form.Label>
            <Form.Control
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter highlight message"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Happy Travellers *</Form.Label>
            <Form.Control
              type="text"
              value={happyTravellers}
              onChange={(e) => setHappyTravellers(e.target.value)}
              placeholder="e.g., 8,76,946"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Successful Tours *</Form.Label>
            <Form.Control
              type="text"
              value={successfulTours}
              onChange={(e) => setSuccessfulTours(e.target.value)}
              placeholder="e.g., 68,031"
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isCreatingDocument}
            >
              {isCreatingDocument && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              Create
            </Button>
          </div>
        </Form>
      );
    }

    if (modalType === "highlight") {
      return (
        <Form onSubmit={handleHighlightSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Message *</Form.Label>
            <Form.Control
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter highlight message"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Happy Travellers *</Form.Label>
            <Form.Control
              type="text"
              value={happyTravellers}
              onChange={(e) => setHappyTravellers(e.target.value)}
              placeholder="e.g., 8,76,946"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Successful Tours *</Form.Label>
            <Form.Control
              type="text"
              value={successfulTours}
              onChange={(e) => setSuccessfulTours(e.target.value)}
              placeholder="e.g., 68,031"
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isUpdatingHighlight}
            >
              {isUpdatingHighlight && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              Update
            </Button>
          </div>
        </Form>
      );
    }

    if (modalType === "feature") {
      return (
        <Form onSubmit={handleFeatureSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              value={featureTitle}
              onChange={(e) => setFeatureTitle(e.target.value)}
              placeholder="Enter feature title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <div style={{ height: "250px" }}>
              <ReactQuill
                theme="snow"
                value={featureDescription}
                onChange={setFeatureDescription}
                modules={quillModules}
                placeholder="Enter feature description..."
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Active"
              checked={featureStatus}
              onChange={(e) => setFeatureStatus(e.target.checked)}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isCreatingFeature || isUpdatingFeature}
            >
              {(isCreatingFeature || isUpdatingFeature) && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              {isEditMode ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      );
    }

    return null;
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
            <strong>Error!</strong> Failed to load contact features. Please try
            again later.
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
            title="Contact Features Management"
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
            title="Contact Features"
            description="Manage your contact features and highlight statistics."
          >
            {contactFeatures ? (
              <>
                {/* Highlight Section */}
                <div className="mb-4 p-3 bg-light rounded">
                  <h4>Highlight Statistics</h4>
                  <p className="text-muted mb-2">
                    <strong>Message:</strong> {highlight?.message}
                  </p>
                  <p className="text-muted mb-2">
                    <strong>Happy Travellers:</strong>{" "}
                    {highlight?.happyTravellers}
                  </p>
                  <p className="text-muted mb-2">
                    <strong>Successful Tours:</strong>{" "}
                    {highlight?.successfulTours}
                  </p>

                  <div className="d-flex justify-content-end mt-3">
                    <Button onClick={handleOpenHighlightModal}>
                      <IconifyIcon icon="tabler:edit" className="me-1" />
                      Update Highlight
                    </Button>
                  </div>
                </div>

                {/* Features Section */}
                <div className="mb-3">
                  <Button onClick={() => handleOpenFeatureModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Feature
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            <p className="text-muted mb-0">
                              No features found!
                            </p>
                          </td>
                        </tr>
                      ) : (
                        features.map((feature: any, index: number) => (
                          <tr key={feature._id || index}>
                            <td>{index + 1}</td>
                            <td>{feature.title}</td>
                            <td>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: feature.description,
                                }}
                                style={{
                                  maxWidth: "300px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              />
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  feature.isActive ? "bg-success" : "bg-danger"
                                }`}
                              >
                                {feature.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenFeatureModal(true, feature);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteFeature(feature._id);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:trash" />
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <IconifyIcon
                  icon="solar:document-text-bold-duotone"
                  className="fs-1 text-muted mb-3"
                />
                <p className="text-muted mb-3">No data found!</p>
                <Button onClick={handleOpenCreateModal}>
                  <IconifyIcon icon="tabler:plus" className="me-1" />
                  Create Contact Features
                </Button>
              </div>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>

      <Modal
        show={modalType !== null}
        onHide={handleCloseModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{getModalTitle()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderModalContent()}</Modal.Body>
      </Modal>
    </>
  );
};

export default ContactFeaturesPage;
