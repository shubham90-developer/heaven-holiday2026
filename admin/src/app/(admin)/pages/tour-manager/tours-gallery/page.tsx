"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert, Card } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetGalleryQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useUploadImageMutation,
  useUpdateImageWithUploadMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
} from "@/app/redux/api/tourManager/toursGalleryApi";
import { FileUploader } from "@/components/FileUploader";

import Link from "next/link";

type ModalType = "main" | "image" | null;
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

const ToursGalleryPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetGalleryQuery();
  const [createGallery] = useCreateGalleryMutation();
  const [updateGallery] = useUpdateGalleryMutation();
  const [uploadImage] = useUploadImageMutation();
  const [updateImageWithUpload] = useUpdateImageWithUploadMutation();
  const [updateImage] = useUpdateImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const gallery = data?.data;
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
  const [imageAlt, setImageAlt] = useState("");

  const [imageStatus, setImageStatus] = useState("Active");
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
    setImageAlt("");

    setImageStatus("Active");
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
      if (gallery) {
        await updateGallery({
          title,
          subtitle,
        }).unwrap();
        showAlert("Gallery updated successfully!", "success");
      } else {
        await createGallery({
          title,
          subtitle,
          images: [],
        }).unwrap();
        showAlert("Gallery created successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Operation failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Image Modal Handlers ---
  const handleOpenImageModal = (editMode: boolean, image?: any) => {
    setIsEditMode(editMode);
    if (editMode && image) {
      setImagePreview(image.src);
      setImageAlt(image.alt);

      setImageStatus(image.isFeatured ? "Active" : "Inactive");
      setEditingImageId(image._id);
    } else {
      setImageFile(null);
      setImagePreview("");
      setImageAlt("");

      setImageStatus("Active");
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

    setIsSubmitting(true);
    try {
      if (isEditMode && editingImageId) {
        // UPDATE IMAGE
        if (imageFile) {
          // Has new file - use upload endpoint with FormData
          const formData = new FormData();
          formData.append("image", imageFile);
          formData.append("alt", imageAlt);

          formData.append(
            "isFeatured",
            imageStatus === "Active" ? "true" : "false",
          );

          await updateImageWithUpload({
            imageId: editingImageId,
            formData,
          }).unwrap();
        } else {
          // No new file - just update metadata with JSON
          await updateImage({
            imageId: editingImageId,
            body: {
              alt: imageAlt,

              isFeatured: imageStatus === "Active",
            },
          }).unwrap();
        }
        showAlert("Image updated successfully!", "success");
      } else {
        // ADD NEW IMAGE
        if (!imageFile) {
          showAlert("Please upload an image!", "warning");
          return;
        }

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("alt", imageAlt);

        formData.append(
          "isFeatured",
          imageStatus === "Active" ? "true" : "false",
        );

        await uploadImage(formData).unwrap();
        showAlert("Image added successfully!", "success");
      }

      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Upload"} failed!`,
        "danger",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteImage(imageId).unwrap();
      showAlert("Image deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "main") {
      return gallery ? "Update Gallery" : "Create Gallery";
    }
    if (modalType === "image") {
      return isEditMode ? "Edit Image" : "Add Image";
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
            <div style={{ height: "250px" }}>
              <ReactQuill
                theme="snow"
                value={subtitle}
                onChange={setSubtitle}
                modules={quillModules}
                placeholder="Enter subtitle..."
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
                  {gallery ? "Updating..." : "Creating..."}
                </>
              ) : gallery ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </Form>
      );
    }

    if (modalType === "image") {
      return (
        <Form onSubmit={handleImageSubmit}>
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

          <Form.Group className="mb-3">
            <Form.Label>Alt Text *</Form.Label>
            <Form.Control
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Enter alt text"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status *</Form.Label>
            <Form.Select
              value={imageStatus}
              onChange={(e) => setImageStatus(e.target.value)}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
          <PageTitle
            title="Tours Gallery Management"
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
            title="Tours Gallery"
            description="Manage your tours gallery content and images."
          >
            {gallery ? (
              <>
                <div className="mb-4 p-3 bg-light rounded">
                  <h4>{gallery.title}</h4>
                  <div
                    className="text-muted mb-3"
                    dangerouslySetInnerHTML={{ __html: gallery.subtitle }}
                  />

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
                        <th>Preview</th>
                        <th>Alt Text</th>

                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {images.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <p className="text-muted mb-0">No images found!</p>
                          </td>
                        </tr>
                      ) : (
                        images.map((image: any, index: number) => (
                          <tr key={image._id || index}>
                            <td>{index + 1}</td>
                            <td>
                              <img
                                src={image.src}
                                alt={image.alt}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            </td>
                            <td>
                              <div
                                style={{
                                  maxWidth: "250px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {image.alt}
                              </div>
                            </td>

                            <td>
                              <span
                                className={`badge ${
                                  image.isFeatured ? "bg-success" : "bg-danger"
                                }`}
                              >
                                {image.isFeatured ? "Active" : "Inactive"}
                              </span>
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
                <p className="text-muted mb-3">No gallery found!</p>
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

export default ToursGalleryPage;
