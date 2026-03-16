"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetCelebrateQuery,
  useUpdateMainFieldsMutation,
  useAddSlideMutation,
  useUpdateSlideMutation,
  useDeleteSlideMutation,
} from "@/app/redux/api/travel-deals/offer-bannersApi";

import { FileUploader } from "@/components/FileUploader";

import Link from "next/link";
import Image from "next/image";

type ModalType = "main" | "slide" | null;
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

const CelebratePage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetCelebrateQuery(undefined);
  const [updateMainFields, { isLoading: isUpdatingMain }] =
    useUpdateMainFieldsMutation();
  const [addSlide, { isLoading: isAddingSlide }] = useAddSlideMutation();
  const [updateSlide, { isLoading: isUpdatingSlide }] =
    useUpdateSlideMutation();
  const [deleteSlide, { isLoading: isDeletingSlide }] =
    useDeleteSlideMutation();

  const celebrate = data?.data;
  const slides = celebrate?.slides || [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Main fields state
  const [heading, setHeading] = useState("");
  const [status, setStatus] = useState("active");

  // Slide state
  const [slideImage, setSlideImage] = useState<File | null>(null);
  const [slideImagePreview, setSlideImagePreview] = useState<string>("");
  const [slideLink, setSlideLink] = useState("");
  const [slideOrder, setSlideOrder] = useState("");
  const [slideStatus, setSlideStatus] = useState("active");
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);

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
    setHeading("");
    setStatus("active");
    setSlideImage(null);
    setSlideImagePreview("");
    setSlideLink("");
    setSlideOrder("");
    setSlideStatus("active");
    setEditingSlideId(null);
  };

  // --- Main Fields Modal Handlers ---
  const handleOpenMainModal = () => {
    if (celebrate) {
      setHeading(celebrate.heading || "");
      setStatus(celebrate.status || "active");
    }
    setModalType("main");
  };

  const handleMainFieldsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heading) {
      showAlert("Please fill all fields!", "warning");
      return;
    }

    try {
      await updateMainFields({
        heading,
        status,
      }).unwrap();
      showAlert("Main fields updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    }
  };

  // --- Slide Modal Handlers ---
  const handleOpenSlideModal = (editMode: boolean, slide?: any) => {
    setIsEditMode(editMode);
    if (editMode && slide) {
      setSlideImagePreview(slide.image);
      setSlideLink(slide.link);
      setSlideOrder(slide.order.toString());
      setSlideStatus(slide.status);
      setEditingSlideId(slide._id);
    } else {
      setSlideImage(null);
      setSlideImagePreview("");
      setSlideLink("/tour-details");
      setSlideOrder("");
      setSlideStatus("active");
      setEditingSlideId(null);
    }
    setModalType("slide");
  };

  const handleImageChange = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showAlert("Image size must be less than 5MB", "danger");
      return;
    }

    setSlideImage(file);
    setSlideImagePreview(URL.createObjectURL(file));
  };

  const handleSlideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slideLink || !slideOrder) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    if (!isEditMode && !slideImage) {
      showAlert("Please upload an image!", "warning");
      return;
    }

    try {
      const formData = new FormData();
      if (slideImage) {
        formData.append("image", slideImage);
      }
      formData.append("link", slideLink);
      formData.append("order", slideOrder);
      formData.append("status", slideStatus);

      if (isEditMode && editingSlideId) {
        await updateSlide({ id: editingSlideId, formData }).unwrap();
        showAlert("Slide updated successfully!", "success");
      } else {
        await addSlide(formData).unwrap();
        showAlert("Slide added successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    try {
      await deleteSlide(slideId).unwrap();
      showAlert("Slide deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "main") {
      return "Update Main Fields";
    }
    if (modalType === "slide") {
      return isEditMode ? "Edit Slide" : "Add Slide";
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
            <Button variant="primary" type="submit" disabled={isUpdatingMain}>
              {isUpdatingMain ? (
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
      );
    }

    if (modalType === "slide") {
      return (
        <Form onSubmit={handleSlideSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Image *</Form.Label>

            {slideImagePreview && (
              <div className="mb-3">
                <Alert variant="info" className="d-flex align-items-center">
                  <IconifyIcon
                    icon="solar:info-circle-bold-duotone"
                    className="fs-20 me-2"
                  />
                  <div className="lh-1">
                    {slideImage ? "New image preview:" : "Current image:"}
                  </div>
                </Alert>
                <div
                  className="position-relative"
                  style={{ maxWidth: "400px" }}
                >
                  <Image
                    src={slideImagePreview}
                    alt="Slide preview"
                    width={400}
                    height={250}
                    className="img-fluid rounded"
                    style={{ objectFit: "cover" }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute"
                    style={{ top: "8px", right: "8px" }}
                    type="button"
                    onClick={() => {
                      setSlideImage(null);
                      setSlideImagePreview("");
                    }}
                  >
                    <IconifyIcon icon="tabler:x" />
                  </Button>
                </div>
              </div>
            )}

            {!slideImagePreview && (
              <FileUploader
                onFileUpload={handleImageChange}
                icon="ri:upload-cloud-2-line"
                text="Drop image here or click to upload."
                extraText="(Maximum file size: 5MB. Supported formats: JPG, PNG, WEBP, AVIF)"
              />
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Link *</Form.Label>
            <Form.Control
              type="text"
              value={slideLink}
              onChange={(e) => setSlideLink(e.target.value)}
              placeholder="Enter link (e.g., /tour-details)"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Order *</Form.Label>
            <Form.Control
              type="number"
              value={slideOrder}
              onChange={(e) => setSlideOrder(e.target.value)}
              placeholder="Enter order number"
              min="1"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status *</Form.Label>
            <Form.Select
              value={slideStatus}
              onChange={(e) => setSlideStatus(e.target.value)}
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
            <Button
              variant="primary"
              type="submit"
              disabled={isAddingSlide || isUpdatingSlide}
            >
              {isAddingSlide || isUpdatingSlide ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
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
            <strong>Error!</strong> Failed to load celebrate section. Please try
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
            title="Celebrate Section Management"
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
            title="Celebrate Section"
            description="Manage your celebrate slider content and slides."
          >
            {celebrate ? (
              <>
                <div className="mb-4 p-3 bg-light rounded">
                  <h4 dangerouslySetInnerHTML={{ __html: celebrate.heading }} />

                  <div className="d-flex justify-content-end mt-3">
                    <Button onClick={handleOpenMainModal}>
                      <IconifyIcon icon="tabler:edit" className="me-1" />
                      Update Main Fields
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <Button onClick={() => handleOpenSlideModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Slide
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Link</th>
                        <th>Order</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slides.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <p className="text-muted mb-0">No slides found!</p>
                          </td>
                        </tr>
                      ) : (
                        slides.map((slide: any, index: number) => (
                          <tr key={slide._id || index}>
                            <td>{index + 1}</td>
                            <td>
                              <div
                                className="position-relative"
                                style={{ width: "80px", height: "50px" }}
                              >
                                <Image
                                  src={slide.image}
                                  alt={`Slide ${index + 1}`}
                                  fill
                                  className="rounded"
                                  style={{ objectFit: "cover" }}
                                />
                              </div>
                            </td>
                            <td>
                              <span
                                className="text-truncate d-inline-block"
                                style={{ maxWidth: "200px" }}
                              >
                                {slide.link}
                              </span>
                            </td>
                            <td>{slide.order}</td>
                            <td>
                              <span
                                className={`badge ${
                                  slide.status === "active"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {slide.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenSlideModal(true, slide);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteSlide(slide._id);
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

export default CelebratePage;
