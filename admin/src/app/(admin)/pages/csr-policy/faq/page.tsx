"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetAllFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from "@/app/redux/api/csr-faq/csr-faqApi";

import Link from "next/link";

type ModalType = "faq" | null;
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

const FAQPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetAllFAQsQuery(undefined);
  const [createFAQ] = useCreateFAQMutation();
  const [updateFAQ] = useUpdateFAQMutation();
  const [deleteFAQ] = useDeleteFAQMutation();

  const faqs = Array.isArray(data?.data) ? data.data : [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FAQ state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("active");
  const [editingFAQId, setEditingFAQId] = useState<string | null>(null);

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
    setQuestion("");
    setAnswer("");
    setStatus("active");
    setEditingFAQId(null);
  };

  // --- FAQ Modal Handlers ---
  const handleOpenFAQModal = (editMode: boolean, faq?: any) => {
    setIsEditMode(editMode);
    if (editMode && faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setStatus(faq.status || "active");
      setEditingFAQId(faq._id);
    } else {
      setQuestion("");
      setAnswer("");
      setStatus("active");
      setEditingFAQId(null);
    }
    setModalType("faq");
  };

  const handleFAQSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question || !answer) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        question,
        answer,
        status,
      };

      if (isEditMode && editingFAQId) {
        await updateFAQ({ id: editingFAQId, ...payload }).unwrap();
        showAlert("FAQ updated successfully!", "success");
      } else {
        await createFAQ(payload).unwrap();
        showAlert("FAQ added successfully!", "success");
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

  const handleDeleteFAQ = async (faqId: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteFAQ(faqId).unwrap();
      showAlert("FAQ deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "faq") {
      return isEditMode ? "Edit FAQ" : "Add FAQ";
    }
    return "";
  };

  const renderModalContent = () => {
    if (modalType === "faq") {
      return (
        <Form onSubmit={handleFAQSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Question *</Form.Label>
            <Form.Control
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter question"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Answer *</Form.Label>
            <div style={{ height: "250px" }}>
              <ReactQuill
                theme="snow"
                value={answer}
                onChange={setAnswer}
                modules={quillModules}
                placeholder="Enter answer..."
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
              <option value="draft">Draft</option>
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
            <strong>Error!</strong> Failed to load FAQs. Please try again later.
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <PageTitle title="FAQ Management" subTitle="Content Management" />

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
            title="FAQs"
            description="Manage your frequently asked questions."
          >
            <div className="mb-3">
              <Button onClick={() => handleOpenFAQModal(false)}>
                <IconifyIcon icon="tabler:plus" className="me-1" />
                Add FAQ
              </Button>
            </div>

            <div className="table-responsive-sm">
              <table className="table table-striped-columns mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        <p className="text-muted mb-0">No FAQs found!</p>
                      </td>
                    </tr>
                  ) : (
                    faqs.map((faq: any, index: number) => (
                      <tr key={faq._id || index}>
                        <td>{index + 1}</td>
                        <td>{faq.question}</td>
                        <td>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: faq.answer,
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
                              faq.status === "active"
                                ? "bg-success"
                                : faq.status === "inactive"
                                  ? "bg-danger"
                                  : "bg-warning"
                            }`}
                          >
                            {faq.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenFAQModal(true, faq);
                            }}
                            className="link-reset fs-20 p-1"
                          >
                            <IconifyIcon icon="tabler:pencil" />
                          </Link>
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteFAQ(faq._id);
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

export default FAQPage;
