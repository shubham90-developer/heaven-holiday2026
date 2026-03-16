"use client";

import React, { useState, useEffect } from "react";
import {
  useGetTourManagerDirectoryQuery,
  useUpdateDirectoryHeadingMutation,
  useAddManagerMutation,
  useUpdateManagerMutation,
  useDeleteManagerMutation,
} from "@/app/redux/api/tourManager/tourManagementTeamApi";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Row, Col, Alert, Form, Button, Modal, Card } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { FileUploader } from "@/components/FileUploader";
import Link from "next/link";

type ModalType = "create" | "edit" | "heading" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const TourManagerTeamPage: React.FC = () => {
  const { data: directoryData, isLoading } =
    useGetTourManagerDirectoryQuery(undefined);
  const [updateHeading, { isLoading: isUpdatingHeading }] =
    useUpdateDirectoryHeadingMutation();
  const [addManager, { isLoading: isCreating }] = useAddManagerMutation();
  const [updateManager, { isLoading: isUpdating }] = useUpdateManagerMutation();
  const [deleteManager] = useDeleteManagerMutation();

  const managers = directoryData?.data?.managers || [];
  const currentHeading = directoryData?.data?.heading || "";

  // Modal state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingManagerId, setEditingManagerId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
  });

  const [headingValue, setHeadingValue] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [alert, setAlert] = useState<AlertType>({
    show: false,
    message: "",
    variant: "success",
  });

  // Update heading value when data changes
  useEffect(() => {
    if (currentHeading) {
      setHeadingValue(currentHeading);
    }
  }, [currentHeading]);

  const showAlert = (message: string, variant: AlertType["variant"]) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert({ show: false, message: "", variant: "success" });
    }, 5000);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setEditingManagerId(null);
    setFormData({
      name: "",
      status: "Active",
    });
    setImageFile(null);
    setImagePreview("");
  };

  const handleOpenCreateModal = () => {
    handleCloseModal();
    setModalType("create");
  };

  const handleOpenEditModal = (manager: any) => {
    setFormData({
      name: manager.name,
      status: manager.status,
    });
    setImagePreview(manager.image);
    setEditingManagerId(manager._id);
    setModalType("edit");
  };

  const handleOpenHeadingModal = () => {
    setHeadingValue(currentHeading);
    setModalType("heading");
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showAlert("Image size should not exceed 5MB!", "warning");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showAlert("Please upload a valid image file!", "warning");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      showAlert("Please enter manager name!", "warning");
      return;
    }

    if (modalType === "create" && !imageFile) {
      showAlert("Please upload an image!", "warning");
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("status", formData.status);

      if (imageFile) {
        submitData.append("image", imageFile);
      }

      if (modalType === "create") {
        await addManager(submitData).unwrap();
        showAlert("Tour manager added successfully!", "success");
      } else if (modalType === "edit" && editingManagerId) {
        await updateManager({
          managerId: editingManagerId,
          data: submitData,
        }).unwrap();
        showAlert("Tour manager updated successfully!", "success");
      }

      handleCloseModal();
    } catch (err: any) {
      console.error("Failed to save tour manager:", err);
      showAlert(
        err?.data?.message || "Failed to save tour manager. Please try again.",
        "danger",
      );
    }
  };

  const handleHeadingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!headingValue.trim()) {
      showAlert("Please enter a heading!", "warning");
      return;
    }

    try {
      await updateHeading({ heading: headingValue.trim() }).unwrap();
      showAlert("Heading updated successfully!", "success");
      setModalType(null);
    } catch (err: any) {
      console.error("Failed to update heading:", err);
      showAlert(
        err?.data?.message || "Failed to update heading. Please try again.",
        "danger",
      );
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await deleteManager(id).unwrap();
      showAlert("Tour manager deleted successfully!", "success");
    } catch (err: any) {
      showAlert(
        err?.data?.message || "Failed to delete tour manager.",
        "danger",
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

  return (
    <>
      <Row>
        <Col xs={12}>
          <PageTitle title="Tour Manager Team" subTitle="Content Management" />

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
            title="Tour Manager Directory"
            description="Manage your tour manager directory heading and team members."
          >
            {/* Heading Section - Similar to Principles */}
            <div className="mb-4 p-3 bg-light rounded">
              <h4>{currentHeading || "No heading set"}</h4>
              <p className="text-muted mb-0 small">
                This heading will be displayed at the top of the tour manager
                directory page.
              </p>

              <div className="d-flex justify-content-end mt-3">
                <Button onClick={handleOpenHeadingModal}>
                  <IconifyIcon icon="tabler:edit" className="me-1" />
                  Update Heading
                </Button>
              </div>
            </div>

            {/* Managers Section */}
            {managers.length > 0 ? (
              <>
                <div className="mb-3">
                  <Button onClick={handleOpenCreateModal}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Tour Manager
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {managers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            <p className="text-muted mb-0">
                              No tour managers found!
                            </p>
                          </td>
                        </tr>
                      ) : (
                        managers.map((manager: any, index: number) => (
                          <tr key={manager._id || index}>
                            <td>{index + 1}</td>
                            <td>
                              <img
                                src={manager.image}
                                alt={manager.name}
                                className="avatar-sm rounded"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                }}
                              />
                            </td>
                            <td>{manager.name}</td>
                            <td>
                              <span
                                className={`badge ${
                                  manager.status === "Active"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {manager.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenEditModal(manager);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(manager._id, manager.name);
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
                  icon="solar:users-group-rounded-bold-duotone"
                  className="fs-1 text-muted mb-3"
                />
                <p className="text-muted mb-3">No tour managers found!</p>
                <Button onClick={handleOpenCreateModal}>
                  <IconifyIcon icon="tabler:plus" className="me-1" />
                  Add Tour Manager
                </Button>
              </div>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* Update Heading Modal */}
      <Modal
        show={modalType === "heading"}
        onHide={() => setModalType(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Directory Heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleHeadingSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Heading <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={headingValue}
                onChange={(e) => setHeadingValue(e.target.value)}
                placeholder="Enter heading"
                required
              />
              <Form.Text className="text-muted">
                This heading will be displayed at the top of the tour manager
                directory page.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setModalType(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isUpdatingHeading}
              >
                {isUpdatingHeading ? (
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

      {/* Create/Edit Manager Modal */}
      <Modal
        show={modalType === "create" || modalType === "edit"}
        onHide={handleCloseModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "create" ? "Add Tour Manager" : "Edit Tour Manager"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Status <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Image{" "}
                {modalType === "create" && (
                  <span className="text-danger">*</span>
                )}
              </Form.Label>

              {!imagePreview ? (
                <FileUploader
                  onFileUpload={handleImageChange}
                  icon="ri:upload-cloud-2-line"
                  text="Drop image here or click to upload."
                  extraText="(Maximum file size: 5MB. Supported formats: JPG, PNG, WebP)"
                />
              ) : (
                <Card className="mt-1 mb-0 shadow-none border">
                  <div className="p-2">
                    <Row className="align-items-center">
                      <Col xs="auto">
                        <img
                          src={imagePreview}
                          className="avatar-sm rounded bg-light"
                          alt="preview"
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "cover",
                          }}
                        />
                      </Col>
                      <Col className="ps-0">
                        <p className="text-muted fw-bold mb-0">
                          {imageFile?.name || "Current Image"}
                        </p>
                        <p className="mb-0 text-muted small">
                          {imageFile
                            ? `${(imageFile.size / 1024).toFixed(2)} KB`
                            : "Uploaded"}
                        </p>
                      </Col>
                      <Col xs="auto">
                        <Link
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            setImageFile(null);
                            setImagePreview("");
                          }}
                          className="btn btn-link btn-lg text-muted"
                        >
                          <IconifyIcon icon="tabler:x" />
                        </Link>
                      </Col>
                    </Row>
                  </div>
                </Card>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {modalType === "create" ? "Creating..." : "Updating..."}
                  </>
                ) : (
                  <>{modalType === "create" ? "Create" : "Update"}</>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TourManagerTeamPage;
