"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { FileUploader } from "@/components/FileUploader";
import { Button, Modal, Form, Row, Col, Alert, Card } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import {
  useGetAnnualReturnQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "@/app/redux/api/annualReturn/annualReturnApi";

import Link from "next/link";

type ModalType = "item" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const AnnualReturnPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetAnnualReturnQuery();
  const [addItem] = useAddItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();

  const annualReturn = data?.data;
  const items = annualReturn?.items || [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Item state
  const [itemTitle, setItemTitle] = useState("");
  const [itemParticulars, setItemParticulars] = useState("");
  const [itemStatus, setItemStatus] = useState("active");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<{
    name: string;
    size: string;
  } | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

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
    setItemTitle("");
    setItemParticulars("");
    setItemStatus("active");
    setPdfFile(null);
    setPdfPreview(null);
    setEditingItemId(null);
  };

  // --- Item Modal Handlers ---
  const handleOpenItemModal = (editMode: boolean, item?: any) => {
    setIsEditMode(editMode);
    if (editMode && item) {
      setItemTitle(item.title);
      setItemParticulars(item.particulars);
      setItemStatus(item.status || "active");
      setEditingItemId(item._id);
      setPdfFile(null);
      setPdfPreview(null);
    } else {
      setItemTitle("");
      setItemParticulars("");
      setItemStatus("active");
      setEditingItemId(null);
      setPdfFile(null);
      setPdfPreview(null);
    }
    setModalType("item");
  };

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        showAlert("Please select a PDF file!", "warning");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showAlert("File size must be less than 10MB!", "warning");
        return;
      }
      setPdfFile(file);
      setPdfPreview({
        name: file.name,
        size: formatFileSize(file.size),
      });
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    setPdfPreview(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemTitle) {
      showAlert("Title is required!", "warning");
      return;
    }

    if (!isEditMode && !pdfFile) {
      showAlert("PDF file is required!", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", itemTitle);
      formData.append("status", itemStatus);

      if (pdfFile) {
        formData.append("pdf", pdfFile);
      } else if (isEditMode && itemParticulars) {
        formData.append("particulars", itemParticulars);
      }

      if (isEditMode && editingItemId) {
        await updateItem({ id: editingItemId, formData }).unwrap();
        showAlert("Item updated successfully!", "success");
      } else {
        await addItem(formData).unwrap();
        showAlert("Item added successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger"
      );
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteItem(itemId).unwrap();
      showAlert("Item deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "item") {
      return isEditMode ? "Edit Item" : "Add Item";
    }
    return "";
  };

  const renderModalContent = () => {
    if (modalType === "item") {
      return (
        <Form onSubmit={handleItemSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              placeholder="Enter title (e.g., FY 2023-2024)"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>PDF File {!isEditMode && "*"}</Form.Label>

            {!pdfPreview ? (
              <FileUploader
                onFileUpload={handleFileSelect}
                icon="ri:upload-cloud-2-line"
                text="Drop PDF here or click to upload."
                extraText={
                  isEditMode
                    ? "(Leave empty to keep existing PDF. Max size: 10MB)"
                    : "(Required. Max size: 10MB)"
                }
              />
            ) : (
              <Card className="mt-1 mb-0 shadow-none border">
                <div className="p-2">
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <div className="avatar-sm rounded bg-light d-flex align-items-center justify-content-center">
                        <IconifyIcon
                          icon="solar:file-text-bold-duotone"
                          className="fs-24 text-danger"
                        />
                      </div>
                    </Col>
                    <Col className="ps-0">
                      <Link href="#" className="text-muted fw-bold">
                        {pdfPreview.name}
                      </Link>
                      <p className="mb-0 text-muted">{pdfPreview.size}</p>
                    </Col>
                    <Col xs="auto">
                      <Button
                        variant="link"
                        className="btn-lg text-muted p-0"
                        onClick={handleRemoveFile}
                      >
                        <IconifyIcon icon="tabler:x" />
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Card>
            )}

            {isEditMode && itemParticulars && !pdfFile && (
              <div className="mt-2">
                <small className="text-muted">
                  Current PDF:{" "}
                  <a
                    href={itemParticulars}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                </small>
              </div>
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
            <Button variant="primary" type="submit">
              {isEditMode ? "Update" : "Add"}
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
            <strong>Error!</strong> Failed to load annual return. Please try
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
            title="Annual Return Management"
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
            title="Annual Return"
            description="Manage your annual return documents and items."
          >
            {annualReturn ? (
              <>
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
                        <th>Title</th>
                        <th>PDF Document</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            <p className="text-muted mb-0">No items found!</p>
                          </td>
                        </tr>
                      ) : (
                        items.map((item: any, index: number) => (
                          <tr key={item._id || index}>
                            <td>{index + 1}</td>
                            <td>{item.title}</td>
                            <td>
                              <a
                                href={item.particulars}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                              >
                                <IconifyIcon
                                  icon="solar:file-text-bold-duotone"
                                  className="me-1"
                                />
                                View PDF
                              </a>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  item.status === "active"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {item.status || "Active"}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenItemModal(true, item);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteItem(item._id);
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

export default AnnualReturnPage;
