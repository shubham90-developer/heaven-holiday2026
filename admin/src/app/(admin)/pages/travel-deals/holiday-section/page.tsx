"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetHolidaySectionQuery,
  useUpdateMainFieldsMutation,
  useAddFeatureMutation,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
} from "@/app/redux/api/travel-deals/travelDealsHeaderApi";

import Link from "next/link";

type ModalType = "main" | "feature" | null;
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

const HolidaySectionPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetHolidaySectionQuery(undefined);
  const [updateMainFields] = useUpdateMainFieldsMutation();
  const [addFeature] = useAddFeatureMutation();
  const [updateFeature] = useUpdateFeatureMutation();
  const [deleteFeature] = useDeleteFeatureMutation();

  const holidaySection = data?.data;
  const features = holidaySection?.features || [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Main fields state
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [status, setStatus] = useState("inactive");

  // Feature state
  const [featureTitle, setFeatureTitle] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");
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
    setIsSubmitting(false);
    setHeading("");
    setSubheading("");
    setStatus("inactive");
    setFeatureTitle("");
    setFeatureDescription("");
    setEditingFeatureId(null);
  };

  // --- Main Fields Modal Handlers ---
  const handleOpenMainModal = () => {
    if (holidaySection) {
      setHeading(holidaySection.heading || "");
      setSubheading(holidaySection.subheading || "");
      setStatus(holidaySection.status || "inactive");
    }
    setModalType("main");
  };

  const handleMainFieldsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heading || !subheading) {
      showAlert("Please fill all fields!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMainFields({
        heading,
        subheading,
        status,
      }).unwrap();
      showAlert("Main fields updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Feature Modal Handlers ---
  const handleOpenFeatureModal = (editMode: boolean, feature?: any) => {
    setIsEditMode(editMode);
    if (editMode && feature) {
      setFeatureTitle(feature.title);
      setFeatureDescription(feature.description);
      setEditingFeatureId(feature._id);
    } else {
      setFeatureTitle("");
      setFeatureDescription("");
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

    setIsSubmitting(true);
    try {
      const payload = {
        title: featureTitle,
        description: featureDescription,
      };

      if (isEditMode && editingFeatureId) {
        await updateFeature({ id: editingFeatureId, ...payload }).unwrap();
        showAlert("Feature updated successfully!", "success");
      } else {
        await addFeature(payload).unwrap();
        showAlert("Feature added successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    } finally {
      setIsSubmitting(false);
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
    if (modalType === "main") {
      return "Update Main Fields";
    }
    if (modalType === "feature") {
      return isEditMode ? "Edit Feature" : "Add Feature";
    }
    return "";
  };

  const renderModalContent = () => {
    if (modalType === "main") {
      return (
        <Form onSubmit={handleMainFieldsSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Heading *</Form.Label>
            <div style={{ height: "250px" }}>
              <ReactQuill
                theme="snow"
                value={heading}
                onChange={setHeading}
                modules={quillModules}
                placeholder="Enter heading..."
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subheading *</Form.Label>
            <div style={{ height: "250px" }}>
              <ReactQuill
                theme="snow"
                value={subheading}
                onChange={setSubheading}
                modules={quillModules}
                placeholder="Enter subheading..."
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status *</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
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
              placeholder="Enter title"
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

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" />
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : isEditMode ? (
                "Update"
              ) : (
                "Add"
              )}
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
            <strong>Error!</strong> Failed to load holiday section. Please try
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
            title="Holiday Section Management"
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
            title="Holiday Section"
            description="Manage your holiday section content and features."
          >
            {holidaySection ? (
              <>
                <div className="mb-4 p-3 bg-light rounded">
                  <h4
                    dangerouslySetInnerHTML={{ __html: holidaySection.heading }}
                  />

                  <div
                    className="text-muted mb-3"
                    dangerouslySetInnerHTML={{
                      __html: holidaySection.subheading,
                    }}
                  />

                  <div className="d-flex justify-content-end mt-3">
                    <Button onClick={handleOpenMainModal}>
                      <IconifyIcon icon="tabler:edit" className="me-1" />
                      Update Main Fields
                    </Button>
                  </div>
                </div>

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
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-4">
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

export default HolidaySectionPage;
