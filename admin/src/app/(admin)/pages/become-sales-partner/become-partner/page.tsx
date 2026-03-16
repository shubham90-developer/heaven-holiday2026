"use client";

import React, { useState } from "react";
import {
  useGetAllCardsQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
} from "@/app/redux/api/become-partner/becomePartnerApi";

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

const CardsPage: React.FC = () => {
  const { data: cardsData, isLoading } = useGetAllCardsQuery(undefined);
  const [createCard, { isLoading: isCreating }] = useCreateCardMutation();
  const [updateCard, { isLoading: isUpdating }] = useUpdateCardMutation();
  const [deleteCard] = useDeleteCardMutation();

  const cards = cardsData?.data || [];

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
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cities: [] as string[],
    status: "active",
  });

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [cityInput, setCityInput] = useState("");

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
    setEditingCardId(null);
    setFormData({
      title: "",
      description: "",
      cities: [],
      status: "active",
    });
    setIconFile(null);
    setIconPreview("");
    setCityInput("");
  };

  const handleOpenCreateModal = () => {
    handleCloseModal();
    setModalType("create");
  };

  const handleOpenEditModal = (card: any) => {
    setFormData({
      title: card.title,
      description: card.description,
      cities: card.cities || [],
      status: card.status,
    });
    setIconPreview(card.icon);
    setEditingCardId(card._id);
    setModalType("edit");
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (files: File[]) => {
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

    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const handleAddCity = () => {
    if (cityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        cities: [...prev.cities, cityInput.trim()],
      }));
      setCityInput("");
    }
  };

  const handleRemoveCity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      cities: prev.cities.filter((_, i) => i !== index),
    }));
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

    if (formData.cities.length === 0) {
      showAlert("Please add at least one city!", "warning");
      return;
    }

    if (modalType === "create" && !iconFile) {
      showAlert("Please upload an icon!", "warning");
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("cities", JSON.stringify(formData.cities));
      submitData.append("status", formData.status);

      if (iconFile) {
        submitData.append("icon", iconFile);
      }

      if (modalType === "create") {
        await createCard(submitData).unwrap();
        showAlert("Card created successfully!", "success");
      } else if (modalType === "edit" && editingCardId) {
        await updateCard({ id: editingCardId, formData: submitData }).unwrap();
        showAlert("Card updated successfully!", "success");
      }

      handleCloseModal();
    } catch (err: any) {
      console.error("Failed to save card:", err);
      showAlert(
        err?.data?.message || "Failed to save card. Please try again.",
        "danger",
      );
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteCard(id).unwrap();
      showAlert("Card deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Failed to delete card.", "danger");
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
          <PageTitle title="Cards Management" subTitle="Content Management" />

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
            title="Cards"
            description="Manage your cards. Maximum 3 cards allowed."
          >
            {cards.length > 0 ? (
              <>
                <div className="mb-3">
                  <Button
                    onClick={handleOpenCreateModal}
                    disabled={cards.length >= 3}
                  >
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Card {cards.length >= 3 && "(Limit Reached)"}
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Icon</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Cities</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cards.map((card: any, index: number) => (
                        <tr key={card._id || index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              src={card.icon}
                              alt={card.title}
                              className="avatar-sm rounded"
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>{card.title}</td>
                          <td>
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  card.description.length > 100
                                    ? card.description.substring(0, 100) + "..."
                                    : card.description,
                              }}
                            />
                          </td>
                          <td>
                            {card.cities && card.cities.length > 0
                              ? card.cities.join(", ")
                              : "No cities"}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                card.status === "active"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {card.status}
                            </span>
                          </td>
                          <td>
                            {new Date(card.createdAt).toLocaleDateString()}
                          </td>
                          <td className="text-center">
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenEditModal(card);
                              }}
                              className="link-reset fs-20 p-1"
                              title="Edit Card"
                            >
                              <IconifyIcon icon="tabler:pencil" />
                            </Link>
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(card._id, card.title);
                              }}
                              className="link-reset fs-20 p-1"
                              title="Delete Card"
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
                  icon="solar:card-bold-duotone"
                  className="fs-1 text-muted mb-3"
                />
                <p className="text-muted mb-3">No cards found!</p>
                <Button onClick={handleOpenCreateModal}>
                  <IconifyIcon icon="tabler:plus" className="me-1" />
                  Add Card
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
            {modalType === "create" ? "Add Card" : "Edit Card"}
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
                placeholder="Enter card title"
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
                Cities <span className="text-danger">*</span>
              </Form.Label>
              <div className=" gap-2 mb-2">
                <Form.Control
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="Enter city name"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCity();
                    }
                  }}
                />
                <Button
                  className="mt-2"
                  variant="primary"
                  onClick={handleAddCity}
                  type="button"
                >
                  <IconifyIcon icon="tabler:plus" className="me-1 " />
                  Add City
                </Button>
              </div>
              {formData.cities.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {formData.cities.map((city, index) => (
                    <div
                      key={index}
                      className="badge bg-secondary d-flex align-items-center gap-2"
                      style={{ fontSize: "14px", padding: "8px 12px" }}
                    >
                      <span>{city}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCity(index)}
                        className="btn-close btn-close-white"
                        style={{ fontSize: "10px" }}
                        aria-label="Remove"
                      ></button>
                    </div>
                  ))}
                </div>
              )}
              {formData.cities.length === 0 && (
                <Form.Text className="text-muted">
                  No cities added yet. Add at least one city.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Icon{" "}
                {modalType === "create" && (
                  <span className="text-danger">*</span>
                )}
              </Form.Label>

              {!iconPreview ? (
                <FileUploader
                  onFileUpload={handleIconChange}
                  icon="ri:upload-cloud-2-line"
                  text="Drop icon here or click to upload."
                  extraText="(Maximum file size: 5MB)"
                />
              ) : (
                <Card className="mt-1 mb-0 shadow-none border">
                  <div className="p-2">
                    <Row className="align-items-center">
                      <Col xs="auto">
                        <img
                          src={iconPreview}
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
                          {iconFile?.name || "Current Icon"}
                        </p>
                        <p className="mb-0 text-muted small">
                          {iconFile
                            ? `${(iconFile.size / 1024).toFixed(2)} KB`
                            : "Uploaded"}
                        </p>
                      </Col>
                      <Col xs="auto">
                        <Link
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            setIconFile(null);
                            setIconPreview("");
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
              <Form.Label>
                Status <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
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
                disabled={isCreating || isUpdating}
              >
                {(isCreating || isUpdating) && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                {modalType === "create" ? "Create" : "Update"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CardsPage;
