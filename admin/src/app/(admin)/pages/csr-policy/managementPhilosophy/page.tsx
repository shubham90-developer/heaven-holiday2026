"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert, Card } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetManagementQuery,
  useUpdateMainFieldsMutation,
  useAddCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
} from "@/app/redux/api/csrPolicy/philosophyManageApi";

import Link from "next/link";
import { FileUploader } from "@/components/FileUploader";

type ModalType = "main" | "card" | null;
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

const ManagementPhilosophyPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetManagementQuery(undefined);
  const [updateMainFields] = useUpdateMainFieldsMutation();
  const [addCard] = useAddCardMutation();
  const [updateCard] = useUpdateCardMutation();
  const [deleteCard] = useDeleteCardMutation();

  const management = data?.data;
  const cards = management?.cards || [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Main fields state
  const [heading, setHeading] = useState("");
  const [paragraph, setParagraph] = useState("");

  // Card state
  const [cardName, setCardName] = useState("");
  const [cardImage, setCardImage] = useState<File | null>(null);
  const [cardImagePreview, setCardImagePreview] = useState<string>("");
  const [cardStatus, setCardStatus] = useState("Active");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

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
    setParagraph("");
    setCardName("");
    setCardImage(null);
    setCardImagePreview("");
    setCardStatus("Active");
    setEditingCardId(null);
  };

  // --- Main Fields Modal Handlers ---
  const handleOpenMainModal = () => {
    if (management) {
      setHeading(management.heading || "");
      setParagraph(management.paragraph || "");
    }
    setModalType("main");
  };

  const handleMainFieldsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heading || !paragraph) {
      showAlert("Please fill all fields!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMainFields({
        heading,
        paragraph,
      }).unwrap();
      showAlert("Main fields updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Card Modal Handlers ---
  const handleOpenCardModal = (editMode: boolean, card?: any) => {
    setIsEditMode(editMode);
    if (editMode && card) {
      setCardName(card.name);
      setCardImagePreview(card.image);
      setCardStatus(card.status || "Active");
      setEditingCardId(card._id);
    } else {
      setCardName("");
      setCardImage(null);
      setCardImagePreview("");
      setCardStatus("Active");
      setEditingCardId(null);
    }
    setModalType("card");
  };

  const handleImageUpload = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showAlert("Image size should be less than 5MB!", "warning");
      return;
    }

    setCardImage(file);
    setCardImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setCardImage(null);
    setCardImagePreview("");
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardName) {
      showAlert("Please enter card name!", "warning");
      return;
    }

    if (!isEditMode && !cardImage) {
      showAlert("Please upload an image!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", cardName);
      formData.append("status", cardStatus);

      if (cardImage) {
        formData.append("image", cardImage);
      }

      if (isEditMode && editingCardId) {
        formData.append("id", editingCardId);
        await updateCard(formData).unwrap();
        showAlert("Card updated successfully!", "success");
      } else {
        await addCard(formData).unwrap();
        showAlert("Card added successfully!", "success");
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

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("Are you sure you want to delete this card?")) return;
    try {
      await deleteCard(cardId).unwrap();
      showAlert("Card deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "main") {
      return "Update Main Fields";
    }
    if (modalType === "card") {
      return isEditMode ? "Edit Card" : "Add Card";
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
            <Form.Label>Paragraph *</Form.Label>
            <div style={{ height: "250px" }}>
              <ReactQuill
                theme="snow"
                value={paragraph}
                onChange={setParagraph}
                modules={quillModules}
                placeholder="Enter paragraph..."
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

    if (modalType === "card") {
      return (
        <Form onSubmit={handleCardSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Enter card name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image *</Form.Label>

            {!cardImagePreview ? (
              <FileUploader
                onFileUpload={handleImageUpload}
                icon="ri:upload-cloud-2-line"
                text="Drop image here or click to upload."
                extraText="(Maximum file size: 5MB. Supported formats: JPG, PNG, SVG)"
              />
            ) : (
              <Card className="mt-1 mb-0 shadow-none border">
                <div className="p-2">
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <img
                        src={cardImagePreview}
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
                        {cardImage?.name || "Current Image"}
                      </p>
                      <p className="mb-0 text-muted small">
                        {cardImage
                          ? `${(cardImage.size / 1024).toFixed(2)} KB`
                          : "Uploaded"}
                      </p>
                    </Col>
                    <Col xs="auto">
                      <Link
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveImage();
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
            <Form.Label>Status *</Form.Label>
            <Form.Select
              value={cardStatus}
              onChange={(e) => setCardStatus(e.target.value)}
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
            <strong>Error!</strong> Failed to load management philosophy. Please
            try again later.
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <PageTitle title="Management Philosophy" subTitle="Management" />

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
            title="Management Philosophy"
            description="Manage your management philosophy content and cards."
          >
            {management ? (
              <>
                <div className="mb-4 p-3 bg-light rounded">
                  <h4>{management.heading}</h4>

                  <div
                    className="text-muted mb-3"
                    dangerouslySetInnerHTML={{ __html: management.paragraph }}
                  />

                  <div className="d-flex justify-content-end mt-3">
                    <Button onClick={handleOpenMainModal}>
                      <IconifyIcon icon="tabler:edit" className="me-1" />
                      Update Main Fields
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <Button onClick={() => handleOpenCardModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Card
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
                      {cards.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            <p className="text-muted mb-0">No cards found!</p>
                          </td>
                        </tr>
                      ) : (
                        cards.map((card: any, index: number) => (
                          <tr key={card._id || index}>
                            <td>{index + 1}</td>
                            <td>
                              <img
                                src={card.image}
                                alt={card.name}
                                className="avatar-sm rounded"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                }}
                              />
                            </td>
                            <td>{card.name}</td>
                            <td>
                              <span
                                className={`badge ${
                                  card.status === "Active"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {card.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenCardModal(true, card);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteCard(card._id);
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

export default ManagementPhilosophyPage;
