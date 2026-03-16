"use client";

import React, { useState } from "react";
import {
  useGetAllApplicationsQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
} from "@/app/redux/api/application-process/applicationProcessApi";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Row, Col, Alert, Form, Button, Modal, Card } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { FileUploader } from "@/components/FileUploader";
import Link from "next/link";
import ReactQuill from "react-quill-new";

// styles
import "react-quill-new/dist/quill.snow.css";

type ModalType = "create" | "edit" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const ApplicationProcessPage: React.FC = () => {
  const { data: applicationsData, isLoading } =
    useGetAllApplicationsQuery(undefined);
  const [createApplication, { isLoading: isCreating }] =
    useCreateApplicationMutation();
  const [updateApplication, { isLoading: isUpdating }] =
    useUpdateApplicationMutation();
  const [deleteApplication] = useDeleteApplicationMutation();

  const applications = applicationsData?.data || [];

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

  // Modal state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingApplicationId, setEditingApplicationId] = useState<
    string | null
  >(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

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
    setEditingApplicationId(null);
    setFormData({
      title: "",
      description: "",
    });
    setImageFile(null);
    setImagePreview("");
  };

  const handleOpenCreateModal = () => {
    handleCloseModal();
    setModalType("create");
  };

  const handleOpenEditModal = (application: any) => {
    setFormData({
      title: application.title,
      description: application.description,
    });
    setImagePreview(application.image);
    setEditingApplicationId(application._id);
    setModalType("edit");
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
    if (!formData.title.trim()) {
      showAlert("Please enter title!", "warning");
      return;
    }

    if (!formData.description.trim()) {
      showAlert("Please enter description!", "warning");
      return;
    }

    if (modalType === "create" && !imageFile) {
      showAlert("Please upload an image!", "warning");
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("description", formData.description.trim());

      if (imageFile) {
        submitData.append("image", imageFile);
      }

      if (modalType === "create") {
        await createApplication(submitData).unwrap();
        showAlert("Application created successfully!", "success");
      } else if (modalType === "edit" && editingApplicationId) {
        await updateApplication({
          id: editingApplicationId,
          formData: submitData,
        }).unwrap();
        showAlert("Application updated successfully!", "success");
      }

      handleCloseModal();
    } catch (err: any) {
      console.error("Failed to save application:", err);
      showAlert(
        err?.data?.message || "Failed to save application. Please try again.",
        "danger",
      );
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteApplication(id).unwrap();
      showAlert("Application deleted successfully!", "success");
    } catch (err: any) {
      showAlert(
        err?.data?.message || "Failed to delete application.",
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
          <PageTitle
            title="Application Process Management"
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
            title="Application Process"
            description="Manage your application process steps."
          >
            {applications.length > 0 ? (
              <>
                <div className="mb-3">
                  <Button onClick={handleOpenCreateModal}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Step
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((application: any, index: number) => (
                        <tr key={application._id || index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              src={application.image}
                              alt={application.title}
                              className="avatar-sm rounded"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>{application.title}</td>
                          <td
                            dangerouslySetInnerHTML={{
                              __html:
                                application.description.length > 100
                                  ? application.description.substring(0, 100) +
                                    "..."
                                  : application.description,
                            }}
                          />

                          <td>
                            {new Date(
                              application.createdAt,
                            ).toLocaleDateString()}
                          </td>
                          <td className="text-center">
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenEditModal(application);
                              }}
                              className="link-reset fs-20 p-1"
                              title="Edit Application"
                            >
                              <IconifyIcon icon="tabler:pencil" />
                            </Link>
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(
                                  application._id,
                                  application.title,
                                );
                              }}
                              className="link-reset fs-20 p-1"
                              title="Delete Application"
                            >
                              <IconifyIcon icon="tabler:trash" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <IconifyIcon
                  icon="solar:clipboard-bold-duotone"
                  className="fs-1 text-muted mb-3"
                />
                <p className="text-muted mb-3">No applications found!</p>
                <Button onClick={handleOpenCreateModal}>
                  <IconifyIcon icon="tabler:plus" className="me-1" />
                  Add Step
                </Button>
              </div>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* Create/Edit Modal */}
      <Modal
        show={modalType === "create" || modalType === "edit"}
        onHide={handleCloseModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "create" ? "Add Application" : "Edit Application"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter application title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Description <span className="text-danger">*</span>
              </Form.Label>
              <div style={{ height: "400px" }}>
                <ReactQuill
                  modules={modules}
                  value={formData.description}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, description: content }))
                  }
                  theme="snow"
                  placeholder="Enter description..."
                  style={{ height: "350px" }}
                />
              </div>
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
                  extraText="(Maximum file size: 5MB)"
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

export default ApplicationProcessPage;
