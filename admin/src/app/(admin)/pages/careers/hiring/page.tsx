"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import { FileUploader } from "@/components/FileUploader";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert, Card } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetHowWeHireQuery,
  useUpdateHowWeHireInfoMutation,
  useAddHowWeHireStepMutation,
  useUpdateHowWeHireStepMutation,
  useDeleteHowWeHireStepMutation,
} from "@/app/redux/api/careers/hiringApi";

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

const HiringPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetHowWeHireQuery(undefined);
  const [updateHowWeHireInfo, { isLoading: isUpdatingMain }] =
    useUpdateHowWeHireInfoMutation();
  const [addHowWeHireStep, { isLoading: isAddingStep }] =
    useAddHowWeHireStepMutation();
  const [updateHowWeHireStep, { isLoading: isUpdatingStep }] =
    useUpdateHowWeHireStepMutation();
  const [deleteHowWeHireStep, { isLoading: isDeletingStep }] =
    useDeleteHowWeHireStepMutation();

  const howWeHire = data?.data;
  const steps = howWeHire?.steps || [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Main fields state
  const [heading, setHeading] = useState("");
  const [introText, setIntroText] = useState("");
  const [subText, setSubText] = useState("");

  // Step state
  const [stepTitle, setStepTitle] = useState("");
  const [stepDescription, setStepDescription] = useState("");
  const [stepImage, setStepImage] = useState<File | null>(null);
  const [stepImagePreview, setStepImagePreview] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [stepStatus, setStepStatus] = useState("active");
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

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
    setIntroText("");
    setSubText("");
    setStepTitle("");
    setStepDescription("");
    setStepImage(null);
    setStepImagePreview("");
    setExistingImageUrl("");
    setStepStatus("active");
    setEditingStepId(null);
  };

  // --- Main Fields Modal Handlers ---
  const handleOpenMainModal = () => {
    if (howWeHire) {
      setHeading(howWeHire.heading || "");
      setIntroText(howWeHire.introText || "");
      setSubText(howWeHire.subText || "");
    }
    setModalType("main");
  };

  const handleMainFieldsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heading || !introText || !subText) {
      showAlert("Please fill all fields!", "warning");
      return;
    }

    try {
      await updateHowWeHireInfo({
        heading,
        introText,
        subText,
      }).unwrap();
      showAlert("Main fields updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    }
  };

  // --- Step Modal Handlers ---
  const handleFilesChange = (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];
      setStepImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setStepImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setStepImage(null);
    setStepImagePreview("");
    // Also clear existing image URL in edit mode
    if (isEditMode) {
      setExistingImageUrl("");
    }
  };

  const handleOpenStepModal = (editMode: boolean, step?: any) => {
    setIsEditMode(editMode);
    if (editMode && step) {
      setStepTitle(step.title);
      setStepDescription(step.description);
      setExistingImageUrl(step.img || "");
      setStepImagePreview("");
      setStepStatus(step.status || "active");
      setEditingStepId(step._id);
      setStepImage(null);
    } else {
      setStepTitle("");
      setStepDescription("");
      setStepImage(null);
      setStepImagePreview("");
      setExistingImageUrl("");
      setStepStatus("active");
      setEditingStepId(null);
    }
    setModalType("step");
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
      formData.append("title", stepTitle);
      formData.append("description", stepDescription);
      formData.append("status", stepStatus);

      if (isEditMode && editingStepId) {
        formData.append("stepId", editingStepId);
        if (stepImage) {
          formData.append("img", stepImage);
        }
        await updateHowWeHireStep(formData).unwrap();
        showAlert("Step updated successfully!", "success");
      } else {
        if (stepImage) {
          formData.append("img", stepImage);
        }
        await addHowWeHireStep(formData).unwrap();
        showAlert("Step added successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("Error:", err);
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    }
  };

  const handleDeleteStep = async (stepId: string) => {
    if (!confirm("Are you sure you want to delete this step?")) return;
    try {
      await deleteHowWeHireStep({ stepId }).unwrap();
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
            <Form.Label>Heading *</Form.Label>
            <Form.Control
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter heading"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Intro Text *</Form.Label>
            <div style={{ height: "250px" }}>
              <ReactQuill
                theme="snow"
                value={introText}
                onChange={setIntroText}
                modules={quillModules}
                placeholder="Enter intro text..."
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sub Text *</Form.Label>
            <div style={{ height: "250px" }}>
              <ReactQuill
                theme="snow"
                value={subText}
                onChange={setSubText}
                modules={quillModules}
                placeholder="Enter sub text..."
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
      // Determine if we should show existing image or new preview
      const showExistingImage =
        isEditMode && existingImageUrl && !stepImagePreview;
      const showNewPreview = stepImagePreview && stepImage;
      const hasImage = showExistingImage || showNewPreview;

      return (
        <Form onSubmit={handleStepSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              value={stepTitle}
              onChange={(e) => setStepTitle(e.target.value)}
              placeholder="Enter step title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
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
              Image {!isEditMode && "*"}
              {isEditMode && " (Leave empty to keep current image)"}
            </Form.Label>

            {/* Show ONLY ONE image preview */}
            {hasImage && (
              <Card className="mb-3 mt-1 shadow-none border">
                <div className="p-2">
                  <Row className="align-items-center">
                    <Col xs={"auto"}>
                      <img
                        src={
                          showNewPreview ? stepImagePreview : existingImageUrl
                        }
                        alt={showNewPreview ? "Preview" : "Current"}
                        className="avatar-sm rounded bg-light"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </Col>
                    <Col className="ps-0">
                      <p className="text-muted fw-bold mb-0">
                        {showNewPreview ? stepImage.name : "Current Image"}
                      </p>
                      <p className="mb-0 small text-muted">
                        {showNewPreview
                          ? `${(stepImage.size / 1024).toFixed(2)} KB`
                          : "Upload new to replace"}
                      </p>
                    </Col>
                    <Col xs="auto">
                      <Link
                        href=""
                        className="btn btn-link btn-lg text-muted"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveImage();
                        }}
                      >
                        <IconifyIcon icon="tabler:x" />
                      </Link>
                    </Col>
                  </Row>
                </div>
              </Card>
            )}

            {/* Hide FileUploader when image is uploaded */}
            {!hasImage && (
              <FileUploader
                onFileUpload={handleFilesChange}
                icon="ri:upload-cloud-2-line"
                text="Drop files here or click to upload."
                extraText={
                  isEditMode
                    ? "(Upload a new image to replace the existing one)"
                    : "(This is a required field)"
                }
              />
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status *</Form.Label>
            <Form.Select
              value={stepStatus}
              onChange={(e) => setStepStatus(e.target.value)}
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
              disabled={isAddingStep || isUpdatingStep}
            >
              {isAddingStep || isUpdatingStep ? (
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
            <strong>Error!</strong> Failed to load hiring process. Please try
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
            title="How We Hire Management"
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
            title="How We Hire"
            description="Manage your hiring process content and steps."
          >
            {howWeHire ? (
              <>
                <div className="mb-4 p-3 bg-light rounded">
                  <h4>{howWeHire.heading}</h4>

                  <div
                    className="text-muted mb-2"
                    dangerouslySetInnerHTML={{ __html: howWeHire.introText }}
                  />

                  <div
                    className="text-muted mb-3"
                    dangerouslySetInnerHTML={{ __html: howWeHire.subText }}
                  />

                  <div className="d-flex justify-content-end mt-3">
                    <Button onClick={handleOpenMainModal}>
                      <IconifyIcon icon="tabler:edit" className="me-1" />
                      Update Main Fields
                    </Button>
                  </div>
                </div>

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
                        <th>Title</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {steps.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <p className="text-muted mb-0">No steps found!</p>
                          </td>
                        </tr>
                      ) : (
                        steps.map((step: any, index: number) => (
                          <tr key={step._id || index}>
                            <td>{index + 1}</td>
                            <td>{step.title}</td>
                            <td>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: step.description,
                                }}
                                style={{
                                  maxWidth: "300px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              />
                            </td>
                            <td>
                              {step.img && (
                                <img
                                  src={step.img}
                                  alt={step.title}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                  }}
                                />
                              )}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  step.status === "active"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {step.status}
                              </span>
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
                                  handleDeleteStep(step._id);
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

export default HiringPage;
