"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetPrincipleQuery,
  useUpdateMainFieldsMutation,
  useAddDetailMutation,
  useUpdateDetailMutation,
  useDeleteDetailMutation,
} from "@/app/redux/api/aboutus/principlesApi";

import Link from "next/link";

type ModalType = "main" | "detail" | null;
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

const GRADIENT_COLORS = [
  { value: "from-gray-700 to-yellow-800", label: "Gray to Yellow" },
  { value: "from-pink-500 to-purple-600", label: "Pink to Purple" },
  { value: "from-blue-500 to-indigo-600", label: "Blue to Indigo" },
  { value: "from-green-500 to-teal-600", label: "Green to Teal" },
  { value: "from-red-500 to-orange-600", label: "Red to Orange" },
  { value: "from-cyan-500 to-blue-600", label: "Cyan to Blue" },
  { value: "from-violet-500 to-purple-600", label: "Violet to Purple" },
  { value: "from-amber-500 to-yellow-600", label: "Amber to Yellow" },
];

const PrinciplesPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetPrincipleQuery(undefined);
  const [updateMainFields] = useUpdateMainFieldsMutation();
  const [addDetail] = useAddDetailMutation();
  const [updateDetail] = useUpdateDetailMutation();
  const [deleteDetail] = useDeleteDetailMutation();

  const principle = data?.data;
  const details = principle?.details || [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Main fields state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Detail state
  const [detailSubtitle, setDetailSubtitle] = useState("");
  const [detailDescription, setDetailDescription] = useState("");
  const [detailColor, setDetailColor] = useState("from-blue-500 to-indigo-600");
  const [detailStatus, setDetailStatus] = useState("Active");
  const [editingDetailId, setEditingDetailId] = useState<string | null>(null);

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
    setDescription("");
    setDetailSubtitle("");
    setDetailDescription("");
    setDetailColor("from-blue-500 to-indigo-600");
    setDetailStatus("Active");
    setEditingDetailId(null);
  };

  // --- Main Fields Modal Handlers ---
  const handleOpenMainModal = () => {
    if (principle) {
      setTitle(principle.title || "");
      setDescription(principle.description || "");
    }
    setModalType("main");
  };

  const handleMainFieldsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      showAlert("Please fill all fields!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMainFields({
        title,
        description,
      }).unwrap();
      showAlert("Main fields updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Detail Modal Handlers ---
  const handleOpenDetailModal = (editMode: boolean, detail?: any) => {
    setIsEditMode(editMode);
    if (editMode && detail) {
      setDetailSubtitle(detail.subtitle);
      setDetailDescription(detail.principleDescription);
      setDetailColor(detail.color || "from-blue-500 to-indigo-600");
      setDetailStatus(detail.status || "Active");
      setEditingDetailId(detail._id);
    } else {
      setDetailSubtitle("");
      setDetailDescription("");
      setDetailColor("from-blue-500 to-indigo-600");
      setDetailStatus("Active");
      setEditingDetailId(null);
    }
    setModalType("detail");
  };

  const handleDetailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!detailSubtitle || !detailDescription) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        subtitle: detailSubtitle,
        principleDescription: detailDescription,
        color: detailColor,
        status: detailStatus,
      };

      if (isEditMode && editingDetailId) {
        await updateDetail({ id: editingDetailId, ...payload }).unwrap();
        showAlert("Detail updated successfully!", "success");
      } else {
        await addDetail(payload).unwrap();
        showAlert("Detail added successfully!", "success");
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

  const handleDeleteDetail = async (detailId: string) => {
    if (!confirm("Are you sure you want to delete this detail?")) return;
    try {
      await deleteDetail(detailId).unwrap();
      showAlert("Detail deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "main") {
      return "Update Main Fields";
    }
    if (modalType === "detail") {
      return isEditMode ? "Edit Detail" : "Add Detail";
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
            <Form.Label>Description *</Form.Label>
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

    if (modalType === "detail") {
      return (
        <Form onSubmit={handleDetailSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Subtitle *</Form.Label>
            <Form.Control
              type="text"
              value={detailSubtitle}
              onChange={(e) => setDetailSubtitle(e.target.value)}
              placeholder="Enter subtitle"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Principle Description *</Form.Label>
            <div style={{ height: "250px" }}>
              <ReactQuill
                theme="snow"
                value={detailDescription}
                onChange={setDetailDescription}
                modules={quillModules}
                placeholder="Enter principle description..."
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gradient Color *</Form.Label>
            <Form.Select
              value={detailColor}
              onChange={(e) => setDetailColor(e.target.value)}
              required
            >
              {GRADIENT_COLORS.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status *</Form.Label>
            <Form.Select
              value={detailStatus}
              onChange={(e) => setDetailStatus(e.target.value)}
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
            <strong>Error!</strong> Failed to load principles. Please try again
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
            title="Principles Management"
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
            title="Principles"
            description="Manage your principles content and details."
          >
            {!principle ? (
              // Empty state - show only table structure and Add Principle button
              <>
                <div className="mb-3">
                  <Button onClick={handleOpenMainModal}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Principle
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Subtitle</th>
                        <th>Description</th>
                        <th>Color</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          <p className="text-muted mb-0">
                            No principles found! Please add a principle to get
                            started.
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              // Principle exists - show full content
              <>
                <div className="mb-4 p-3 bg-light rounded">
                  <h4>{principle.title}</h4>

                  <div
                    className="text-muted mb-3"
                    dangerouslySetInnerHTML={{ __html: principle.description }}
                  />

                  <div className="d-flex justify-content-end mt-3">
                    <Button onClick={handleOpenMainModal}>
                      <IconifyIcon icon="tabler:edit" className="me-1" />
                      Update Main Fields
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <Button onClick={() => handleOpenDetailModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Detail
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Subtitle</th>
                        <th>Description</th>
                        <th>Color</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <p className="text-muted mb-0">No details found!</p>
                          </td>
                        </tr>
                      ) : (
                        details.map((detail: any, index: number) => (
                          <tr key={detail._id || index}>
                            <td>{index + 1}</td>
                            <td>{detail.subtitle}</td>
                            <td>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: detail.principleDescription,
                                }}
                                style={{
                                  maxWidth: "300px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              />
                            </td>
                            <td>
                              <span className="badge bg-secondary">
                                {GRADIENT_COLORS.find(
                                  (c) => c.value === detail.color,
                                )?.label || detail.color}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  detail.status === "Active"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {detail.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenDetailModal(true, detail);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteDetail(detail._id);
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

export default PrinciplesPage;
