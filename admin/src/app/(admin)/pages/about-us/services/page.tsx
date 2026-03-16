"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert, Card } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetAllMainQuery,
  useCreateServicesMutation,
  useUpdateMainFieldsMutation,
  useUpdateMainItemMutation,
  useUpdateMainItemsArrayMutation,
  useDeleteMainMutation,
} from "@/app/redux/api/aboutus/servicesApi";

import Link from "next/link";
import { FileUploader } from "@/components/FileUploader";

type ModalType = "main" | "item" | null;
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

const ServicesPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetAllMainQuery(undefined);
  const [createServices] = useCreateServicesMutation();
  const [updateMainFields] = useUpdateMainFieldsMutation();
  const [updateMainItem] = useUpdateMainItemMutation();
  const [updateMainItemsArray] = useUpdateMainItemsArrayMutation();
  const [deleteMain] = useDeleteMainMutation();

  const services = data?.data || [];
  const service = Array.isArray(services)
    ? services.length > 0
      ? services[0]
      : null
    : services;
  const items = service?.items || [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Main fields state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  // Item state
  const [itemIconTitle, setItemIconTitle] = useState("");
  const [itemIconDescription, setItemIconDescription] = useState("");
  const [itemIcon, setItemIcon] = useState<File | null>(null);
  const [itemIconPreview, setItemIconPreview] = useState<string>("");
  const [itemStatus, setItemStatus] = useState("active");
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

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
    setItemIconTitle("");
    setItemIconDescription("");
    setItemIcon(null);
    setItemIconPreview("");
    setItemStatus("active");
    setEditingItemIndex(null);
  };

  // --- Main Fields Modal Handlers ---
  const handleOpenMainModal = () => {
    if (service) {
      setTitle(service.title || "");
      setSubtitle(service.subtitle || "");
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
      await updateMainFields({
        id: service._id,
        data: { title, subtitle },
      }).unwrap();
      showAlert("Main fields updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Item Modal Handlers ---
  const handleOpenItemModal = (
    editMode: boolean,
    item?: any,
    index?: number,
  ) => {
    setIsEditMode(editMode);
    if (editMode && item && index !== undefined) {
      setItemIconTitle(item.iconTitle);
      setItemIconDescription(item.iconDescription);
      setItemIconPreview(item.icon);
      setItemStatus(item.status || "active");
      setEditingItemIndex(index);
    } else {
      setItemIconTitle("");
      setItemIconDescription("");
      setItemIcon(null);
      setItemIconPreview("");
      setItemStatus("active");
      setEditingItemIndex(null);
    }
    setModalType("item");
  };

  const handleIconUpload = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showAlert("Icon size should be less than 5MB!", "warning");
      return;
    }

    setItemIcon(file);
    setItemIconPreview(URL.createObjectURL(file));
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemIconTitle || !itemIconDescription) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    if (!isEditMode && !itemIcon) {
      showAlert("Please upload an icon!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("iconTitle", itemIconTitle);
      formData.append("iconDescription", itemIconDescription);
      formData.append("status", itemStatus);

      // Append file if a new file was uploaded
      if (itemIcon) {
        formData.append("icon", itemIcon);
      }

      if (isEditMode && editingItemIndex !== null) {
        // Update specific item
        await updateMainItem({
          id: service._id,
          itemIndex: editingItemIndex,
          data: formData,
        }).unwrap();
        showAlert("Item updated successfully!", "success");
      } else {
        // Add new item - need to send entire array
        const newItem = {
          icon: "", // backend will replace with Cloudinary URL
          iconTitle: itemIconTitle,
          iconDescription: itemIconDescription,
          status: itemStatus,
        };

        const updatedItems = [...items, newItem];
        const arrayFormData = new FormData();
        arrayFormData.append("items", JSON.stringify(updatedItems));

        if (itemIcon) {
          arrayFormData.append("icon", itemIcon);
        }

        await updateMainItemsArray({
          id: service._id,
          data: arrayFormData,
        }).unwrap();
        showAlert("Item added successfully!", "success");
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

  const handleDeleteItem = async (index: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const updatedItems = items.filter((_: any, i: number) => i !== index);

      const formData = new FormData();
      formData.append("items", JSON.stringify(updatedItems));

      await updateMainItemsArray({
        id: service._id,
        data: formData,
      }).unwrap();
      showAlert("Item deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "main") {
      return "Update Main Fields";
    }
    if (modalType === "item") {
      return isEditMode ? "Edit Item" : "Add Item";
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

    if (modalType === "item") {
      return (
        <Form onSubmit={handleItemSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Icon Title *</Form.Label>
            <Form.Control
              type="text"
              value={itemIconTitle}
              onChange={(e) => setItemIconTitle(e.target.value)}
              placeholder="Enter icon title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Icon Description *</Form.Label>
            <div style={{ height: "400px", marginBottom: "50px" }}>
              <ReactQuill
                theme="snow"
                value={itemIconDescription}
                onChange={setItemIconDescription}
                modules={quillModules}
                placeholder="Enter icon description..."
                style={{ height: "350px" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Icon {!isEditMode && <span className="text-danger">*</span>}
            </Form.Label>
            {!itemIconPreview ? (
              <FileUploader
                onFileUpload={handleIconUpload}
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
                        src={itemIconPreview}
                        className="rounded"
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
                        {itemIcon?.name || "Current Icon"}
                      </p>
                      <p className="mb-0 text-muted small">
                        {itemIcon
                          ? `${(itemIcon.size / 1024).toFixed(2)} KB`
                          : "Uploaded"}
                      </p>
                    </Col>
                    <Col xs="auto">
                      <Link
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          setItemIcon(null);
                          setItemIconPreview("");
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
              value={itemStatus}
              onChange={(e) => setItemStatus(e.target.value)}
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
            <strong>Error!</strong> Failed to load services. Please try again
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
            title="Services Management"
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
            title="Services"
            description="Manage your services and their items."
          >
            <>
              <div className="mb-4 p-3 bg-light rounded">
                <h4>{service?.title || ""}</h4>
                <p className="text-muted mb-0">{service?.subtitle || ""}</p>

                <div className="d-flex justify-content-end mt-3">
                  <Button onClick={handleOpenMainModal}>
                    <IconifyIcon icon="tabler:edit" className="me-1" />
                    Update Main Fields
                  </Button>
                </div>
              </div>

              <div className="mb-3">
                <Button onClick={() => handleOpenItemModal(false)}>
                  <IconifyIcon icon="tabler:plus" className="me-1" />
                  Add Item
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
                      <th>Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          <p className="text-muted mb-0">No items found!</p>
                        </td>
                      </tr>
                    ) : (
                      items.map((item: any, index: number) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              src={item.icon}
                              alt={item.iconTitle}
                              className="avatar-sm rounded"
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>{item.iconTitle}</td>
                          <td>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.iconDescription,
                              }}
                              style={{
                                maxWidth: "300px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            />
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                item.status === "active"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="text-center">
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenItemModal(true, item, index);
                              }}
                              className="link-reset fs-20 p-1"
                            >
                              <IconifyIcon icon="tabler:pencil" />
                            </Link>
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteItem(index);
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

export default ServicesPage;
