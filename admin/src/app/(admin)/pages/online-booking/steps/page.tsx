"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert, Card } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetOnlineBookingQuery,
  useUpdateOnlineBookingMutation,
  useCreateStepMutation,
  useUpdateStepMutation,
  useDeleteStepMutation,
} from "@/app/redux/api/online-booking/onlineBookinApi";

import { FileUploader } from "@/components/FileUploader";

import Link from "next/link";

type ModalType = "main" | "step" | null;
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

const OnlineBookingPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetOnlineBookingQuery(undefined);
  const [updateOnlineBooking, { isLoading: isUpdatingMain }] =
    useUpdateOnlineBookingMutation();
  const [createStep, { isLoading: isCreating }] = useCreateStepMutation();
  const [updateStep, { isLoading: isUpdating }] = useUpdateStepMutation();
  const [deleteStep] = useDeleteStepMutation();

  const booking = data?.data;
  const steps = booking?.steps || [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Main fields state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Step state
  const [stepNo, setStepNo] = useState<number>(1);
  const [stepTitle, setStepTitle] = useState("");
  const [stepDescription, setStepDescription] = useState("");
  const [stepImage, setStepImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editingStepNo, setEditingStepNo] = useState<number | null>(null);

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
    setTitle("");
    setDescription("");
    setStepNo(1);
    setStepTitle("");
    setStepDescription("");
    setStepImage(null);
    setImagePreview("");
    setEditingStepNo(null);
  };

  // --- Main Fields Modal Handlers ---
  const handleOpenMainModal = () => {
    if (booking) {
      setTitle(booking.title || "");
      setDescription(booking.description || "");
    }
    setModalType("main");
  };

  const handleMainFieldsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      showAlert("Please fill all fields!", "warning");
      return;
    }

    try {
      await updateOnlineBooking({
        title,
        description,
      }).unwrap();
      showAlert("Main fields updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    }
  };

  // --- Step Modal Handlers ---
  const handleOpenStepModal = (editMode: boolean, step?: any) => {
    setIsEditMode(editMode);
    if (editMode && step) {
      setStepNo(step.stepNo);
      setStepTitle(step.stepTitle);
      setStepDescription(step.stepDescription);
      setImagePreview(step.image || "");
      setEditingStepNo(step.stepNo);
    } else {
      // Find next available step number
      const maxStepNo =
        steps.length > 0 ? Math.max(...steps.map((s: any) => s.stepNo)) : 0;
      setStepNo(maxStepNo + 1);
      setStepTitle("");
      setStepDescription("");
      setStepImage(null);
      setImagePreview("");
      setEditingStepNo(null);
    }
    setModalType("step");
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

    setStepImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stepTitle || !stepDescription) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    if (!isEditMode && !stepImage) {
      showAlert("Please upload an image!", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("stepNo", String(stepNo));
      formData.append("stepTitle", stepTitle);
      formData.append("stepDescription", stepDescription);
      if (stepImage) {
        formData.append("image", stepImage);
      }

      if (isEditMode && editingStepNo !== null) {
        await updateStep({ stepNo: editingStepNo, formData }).unwrap();
        showAlert("Step updated successfully!", "success");
      } else {
        await createStep(formData).unwrap();
        showAlert("Step added successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    }
  };

  const handleDeleteStep = async (stepNo: number) => {
    if (!confirm("Are you sure you want to delete this step?")) return;
    try {
      await deleteStep(stepNo).unwrap();
      showAlert("Step deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "main") {
      return "Update Main Fields";
    }
    if (modalType === "step") {
      return isEditMode ? "Edit Step" : "Add Step";
    }
    return "";
  };

  const renderModalContent = () => {
    if (modalType === "main") {
      return (
        <Form onSubmit={handleMainFieldsSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Title <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Description <span className="text-danger">*</span>
            </Form.Label>
            <div style={{ height: "250px" }}>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                modules={quillModules}
                placeholder="Enter description..."
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </div>
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

    if (modalType === "step") {
      return (
        <Form onSubmit={handleStepSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Step Number <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  value={stepNo}
                  onChange={(e) => setStepNo(Number(e.target.value))}
                  placeholder="Enter step number"
                  min={1}
                  disabled={isEditMode}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Step Title <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={stepTitle}
                  onChange={(e) => setStepTitle(e.target.value)}
                  placeholder="Enter step title"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              Step Description <span className="text-danger">*</span>
            </Form.Label>
            <div style={{ height: "250px" }}>
              <ReactQuill
                theme="snow"
                value={stepDescription}
                onChange={setStepDescription}
                modules={quillModules}
                placeholder="Enter step description..."
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Image {!isEditMode && <span className="text-danger">*</span>}
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
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    </Col>
                    <Col className="ps-0">
                      <p className="text-muted fw-bold mb-0">
                        {stepImage?.name || "Current Image"}
                      </p>
                      <p className="mb-0 text-muted small">
                        {stepImage
                          ? `${(stepImage.size / 1024).toFixed(2)} KB`
                          : "Uploaded"}
                      </p>
                    </Col>
                    <Col xs="auto">
                      <Link
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          setStepImage(null);
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
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditMode ? "Update" : "Create"}</>
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
            <strong>Error!</strong> Failed to load online booking content.
            Please try again later.
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
            title="Online Booking Management"
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
            title="Online Booking"
            description="Manage your online booking content and steps."
          >
            {booking ? (
              <>
                <div className="mb-4 p-3 bg-light rounded">
                  <h4>{booking.title}</h4>

                  <div
                    className="text-muted mb-3"
                    dangerouslySetInnerHTML={{ __html: booking.description }}
                  />

                  <div className="d-flex justify-content-end mt-3">
                    <Button onClick={handleOpenMainModal}>
                      <IconifyIcon icon="tabler:edit" className="me-1" />
                      Update Main Fields
                    </Button>
                  </div>
                </div>

                {steps.length > 0 ? (
                  <>
                    <div className="mb-3">
                      <Button onClick={() => handleOpenStepModal(false)}>
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
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {steps.map((step: any, index: number) => (
                            <tr key={step.stepNo || index}>
                              <td>{step.stepNo}</td>
                              <td>
                                {step.image ? (
                                  <img
                                    src={step.image}
                                    alt={step.stepTitle}
                                    className="avatar-sm rounded"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <span className="text-muted">No image</span>
                                )}
                              </td>
                              <td>{step.stepTitle}</td>
                              <td>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: step.stepDescription,
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
                                    handleOpenStepModal(true, step);
                                  }}
                                  className="link-reset fs-20 p-1"
                                >
                                  <IconifyIcon icon="tabler:pencil" />
                                </Link>
                                <Link
                                  href=""
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteStep(step.stepNo);
                                  }}
                                  className="link-reset fs-20 p-1"
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
                      icon="solar:box-bold-duotone"
                      className="fs-1 text-muted mb-3"
                    />
                    <p className="text-muted mb-3">No steps found!</p>
                    <Button onClick={() => handleOpenStepModal(false)}>
                      <IconifyIcon icon="tabler:plus" className="me-1" />
                      Add Step
                    </Button>
                  </div>
                )}
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

export default OnlineBookingPage;
