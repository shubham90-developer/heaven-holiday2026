"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert, Card } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import {
  useGetGalleryQuery,
  useUpdateGalleryInfoMutation,
  useAddImageToGalleryMutation,
  useDeleteImageFromGalleryMutation,
  useUpdateImageStatusMutation,
} from "@/app/redux/api/gallery/galleryApi";

import Link from "next/link";
import { FileUploader } from "@/components/FileUploader";

type ModalType = "main" | "image" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const GalleryPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetGalleryQuery();
  const [updateGalleryInfo] = useUpdateGalleryInfoMutation();
  const [addImageToGallery] = useAddImageToGalleryMutation();
  const [deleteImageFromGallery] = useDeleteImageFromGalleryMutation();
  const [updateImageStatus] = useUpdateImageStatusMutation();

  const gallery = data?.data || null;
  const images = gallery?.images || [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Main fields state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageStatus, setImageStatus] = useState("active");
  const [editingImageId, setEditingImageId] = useState<string | null>(null);

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
    setTitle("");
    setSubtitle("");
    setImageFile(null);
    setImagePreview("");
    setImageStatus("active");
    setEditingImageId(null);
  };

  // --- Main Fields Modal Handlers ---
  const handleOpenMainModal = () => {
    if (gallery) {
      setTitle(gallery.title || "");
      setSubtitle(gallery.subtitle || "");
    }
    setModalType("main");
  };

  const handleMainFieldsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subtitle) {
      showAlert("Please fill all fields!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateGalleryInfo({ title, subtitle }).unwrap();
      showAlert("Gallery info updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Image Modal Handlers ---
  const handleOpenImageModal = (editMode: boolean, image?: any) => {
    setIsEditMode(editMode);
    if (editMode && image) {
      setImagePreview(image.url);
      setImageStatus(image.status || "active");
      setEditingImageId(image._id);
    } else {
      setImageFile(null);
      setImagePreview("");
      setImageStatus("active");
      setEditingImageId(null);
    }
    setModalType("image");
  };

  const handleImageUpload = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showAlert("Image size should be less than 5MB!", "warning");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
      // Update status only
      if (!editingImageId) {
        showAlert("Image ID is missing!", "danger");
        return;
      }

      setIsSubmitting(true);
      try {
        await updateImageStatus({
          imageId: editingImageId,
          status: imageStatus,
        }).unwrap();
        showAlert("Image status updated successfully!", "success");
        handleCloseModal();
      } catch (err: any) {
        showAlert(err?.data?.message || "Update failed!", "danger");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Add new image
      if (!imageFile) {
        showAlert("Please upload an image!", "warning");
        return;
      }

      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("status", imageStatus);

        await addImageToGallery(formData).unwrap();
        showAlert("Image added successfully!", "success");
        handleCloseModal();
      } catch (err: any) {
        showAlert(err?.data?.message || "Upload failed!", "danger");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteImageFromGallery({ imageId }).unwrap();
      showAlert("Image deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "main") {
      return "Update Gallery Info";
    }
    if (modalType === "image") {
      return isEditMode ? "Edit Image Status" : "Add Image";
    }
    return "";
  };

  const renderModalContent = () => {
    if (modalType === "main") {
      return (
        <Form onSubmit={handleMainFieldsSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subtitle *</Form.Label>
            <Form.Control
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Enter subtitle"
              required
            />
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

    if (modalType === "image") {
      return (
        <Form onSubmit={handleImageSubmit}>
          {!isEditMode && (
            <Form.Group className="mb-3">
              <Form.Label>
                Image <span className="text-danger">*</span>
              </Form.Label>
              {!imagePreview ? (
                <FileUploader
                  onFileUpload={handleImageUpload}
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
                          className="rounded"
                          alt="preview"
                          style={{
                            width: "80px",
                            height: "80px",
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
          )}

          {isEditMode && (
            <Form.Group className="mb-3">
              <Form.Label>Current Image</Form.Label>
              <div>
                <img
                  src={imagePreview}
                  alt="Current"
                  className="rounded"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Status *</Form.Label>
            <Form.Select
              value={imageStatus}
              onChange={(e) => setImageStatus(e.target.value)}
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
            <strong>Error!</strong> Failed to load gallery. Please try again
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
          <PageTitle title="Gallery Management" subTitle="Content Management" />

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
            title="Gallery"
            description="Manage your gallery title, subtitle and images."
          >
            {gallery ? (
              <>
                <div className="mb-4 p-3 bg-light rounded">
                  <h4>{gallery.title}</h4>
                  <p className="text-muted mb-0">{gallery.subtitle}</p>

                  <div className="d-flex justify-content-end mt-3">
                    <Button onClick={handleOpenMainModal}>
                      <IconifyIcon icon="tabler:edit" className="me-1" />
                      Update Gallery Info
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <Button onClick={() => handleOpenImageModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Image
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {images.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            <p className="text-muted mb-0">No images found!</p>
                          </td>
                        </tr>
                      ) : (
                        images.map((image: any, index: number) => (
                          <tr key={image._id || index}>
                            <td>{index + 1}</td>
                            <td>
                              <img
                                src={image.url}
                                alt={`Gallery ${index + 1}`}
                                className="rounded"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                }}
                              />
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  image.status === "active"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {image.status}
                              </span>
                            </td>
                            <td>
                              {image.createdAt
                                ? new Date(image.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenImageModal(true, image);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteImage(image._id);
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
                  icon="solar:gallery-bold-duotone"
                  className="fs-1 text-muted mb-3"
                />
                <p className="text-muted mb-3">No gallery data found!</p>
                <Button onClick={handleOpenMainModal}>
                  <IconifyIcon icon="tabler:plus" className="me-1" />
                  Create Gallery
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

export default GalleryPage;
