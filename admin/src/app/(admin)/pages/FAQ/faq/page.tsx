"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetAllFAQsQuery,
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from "@/app/redux/api/faq/faqApi";

import Link from "next/link";

type ModalType = "category" | "faq" | null;
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

const FAQManagementPage = () => {
  // --- Data fetching & mutations ---
  const { data: faqData, isLoading, isError } = useGetAllFAQsQuery(undefined);
  const { data: categoriesData } = useGetAllCategoriesQuery(undefined);

  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] =
    useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [createFAQ, { isLoading: isCreatingFAQ }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdatingFAQ }] = useUpdateFAQMutation();
  const [deleteFAQ] = useDeleteFAQMutation();

  const allData = faqData?.data;
  const categories = categoriesData?.data || [];
  const faqs = allData?.faqs || [];

  // --- State ---
  const [activeTab, setActiveTab] = useState("faqs");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Category state
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryStatus, setCategoryStatus] = useState(true);

  // FAQ state
  const [faqId, setFaqId] = useState<string | null>(null);
  const [faqCategory, setFaqCategory] = useState("");
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqStatus, setFaqStatus] = useState(true);

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
    setCategoryId(null);
    setCategoryName("");
    setCategoryStatus(true);
    setFaqId(null);
    setFaqCategory("");
    setFaqQuestion("");
    setFaqAnswer("");
    setFaqStatus(true);
  };

  // --- Category Modal Handlers ---
  const handleOpenCategoryModal = (editMode: boolean, category?: any) => {
    setIsEditMode(editMode);
    if (editMode && category) {
      setCategoryId(category._id);
      setCategoryName(category.category);
      setCategoryStatus(category.isActive);
    } else {
      setCategoryId(null);
      setCategoryName("");
      setCategoryStatus(true);
    }
    setModalType("category");
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName) {
      showAlert("Please enter category name!", "warning");
      return;
    }

    try {
      if (isEditMode && categoryId) {
        await updateCategory({
          categoryId,
          category: categoryName,
          isActive: categoryStatus,
        }).unwrap();
        showAlert("Category updated successfully!", "success");
      } else {
        await createCategory({
          category: categoryName,
          isActive: categoryStatus,
        }).unwrap();
        showAlert("Category created successfully!", "success");
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

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id).unwrap();
      showAlert("Category deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  // --- FAQ Modal Handlers ---
  const handleOpenFAQModal = (editMode: boolean, faq?: any) => {
    if (!editMode && categories.length === 0) {
      showAlert("Please create at least one category first!", "warning");
      return;
    }

    setIsEditMode(editMode);
    if (editMode && faq) {
      setFaqId(faq._id);
      setFaqCategory(faq.category);
      setFaqQuestion(faq.question);
      setFaqAnswer(faq.answer);
      setFaqStatus(faq.isActive);
    } else {
      setFaqId(null);
      setFaqCategory("");
      setFaqQuestion("");
      setFaqAnswer("");
      setFaqStatus(true);
    }
    setModalType("faq");
  };

  const handleFAQSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!faqCategory || !faqQuestion || !faqAnswer) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    try {
      const faqData = {
        category: faqCategory,
        question: faqQuestion,
        answer: faqAnswer,
        isActive: faqStatus,
      };

      if (isEditMode && faqId) {
        await updateFAQ({ faqId, ...faqData }).unwrap();
        showAlert("FAQ updated successfully!", "success");
      } else {
        await createFAQ(faqData).unwrap();
        showAlert("FAQ created successfully!", "success");
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

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteFAQ(id).unwrap();
      showAlert("FAQ deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "category")
      return isEditMode ? "Edit Category" : "Add Category";
    if (modalType === "faq") return isEditMode ? "Edit FAQ" : "Add FAQ";
    return "";
  };

  const renderModalContent = () => {
    if (modalType === "category") {
      return (
        <Form onSubmit={handleCategorySubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Category Name *</Form.Label>
            <Form.Control
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Active"
              checked={categoryStatus}
              onChange={(e) => setCategoryStatus(e.target.checked)}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isCreatingCategory || isUpdatingCategory}
            >
              {(isCreatingCategory || isUpdatingCategory) && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              {isEditMode ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      );
    }

    if (modalType === "faq") {
      return (
        <Form onSubmit={handleFAQSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Category *</Form.Label>
            <Form.Select
              value={faqCategory}
              onChange={(e) => setFaqCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Question *</Form.Label>
            <Form.Control
              type="text"
              value={faqQuestion}
              onChange={(e) => setFaqQuestion(e.target.value)}
              placeholder="Enter question"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Answer *</Form.Label>
            <div style={{ height: "400px" }}>
              <ReactQuill
                modules={quillModules}
                value={faqAnswer}
                onChange={setFaqAnswer}
                theme="snow"
                placeholder="Enter answer..."
                style={{ height: "350px" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Active"
              checked={faqStatus}
              onChange={(e) => setFaqStatus(e.target.checked)}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isCreatingFAQ || isUpdatingFAQ}
            >
              {(isCreatingFAQ || isUpdatingFAQ) && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              {isEditMode ? "Update" : "Create"}
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
            description="Manage FAQ categories and questions."
          >
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || "faqs")}
              className="mb-3"
            >
              {/* FAQs TAB */}
              <Tab eventKey="faqs" title="FAQs">
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
                        <th>Category</th>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faqs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <p className="text-muted mb-0">No FAQs found!</p>
                          </td>
                        </tr>
                      ) : (
                        faqs.map((faq: any, index: number) => (
                          <tr key={faq._id || index}>
                            <td>{index + 1}</td>
                            <td>{faq.category}</td>
                            <td>
                              {faq.question.length > 50
                                ? faq.question.substring(0, 50) + "..."
                                : faq.question}
                            </td>
                            <td>
                              {faq.answer.length > 50
                                ? faq.answer.substring(0, 50) + "..."
                                : faq.answer}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  faq.isActive ? "bg-success" : "bg-danger"
                                }`}
                              >
                                {faq.isActive ? "Active" : "Inactive"}
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
              </Tab>

              {/* CATEGORIES TAB */}
              <Tab eventKey="categories" title="Categories">
                <div className="mb-3">
                  <Button onClick={() => handleOpenCategoryModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Category
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Category Name</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-4">
                            <p className="text-muted mb-0">
                              No categories found!
                            </p>
                          </td>
                        </tr>
                      ) : (
                        categories.map((cat: any, index: number) => (
                          <tr key={cat._id || index}>
                            <td>{index + 1}</td>
                            <td>{cat.category}</td>
                            <td>
                              <span
                                className={`badge ${
                                  cat.isActive ? "bg-success" : "bg-danger"
                                }`}
                              >
                                {cat.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenCategoryModal(true, cat);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteCategory(cat._id);
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
              </Tab>
            </Tabs>
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

export default FAQManagementPage;
