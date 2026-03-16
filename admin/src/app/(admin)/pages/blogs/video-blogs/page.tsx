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
import {
  useGetAllVideoBlogsQuery,
  useCreateVideoBlogMutation,
  useUpdateVideoBlogMutation,
  useDeleteVideoBlogMutation,
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/app/redux/api/video-blogs/videoBlogsApi";

import Link from "next/link";

type ModalType = "videoBlog" | "category" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const VIDEO_BLOG_STATUSES = ["active", "inactive", "draft"];
const CATEGORY_STATUSES = ["active", "inactive"];

const VideoBlogManagementPage = () => {
  // --- Data fetching & mutations ---
  const {
    data: videoBlogsData,
    isLoading,
    isError,
  } = useGetAllVideoBlogsQuery(undefined);
  const { data: categoriesData, refetch: refetchCategories } =
    useGetAllCategoriesQuery(undefined);

  const [createVideoBlog, { isLoading: isCreatingVideoBlog }] =
    useCreateVideoBlogMutation();
  const [updateVideoBlog, { isLoading: isUpdatingVideoBlog }] =
    useUpdateVideoBlogMutation();
  const [deleteVideoBlog] = useDeleteVideoBlogMutation();

  const [addCategory, { isLoading: isAddingCategory }] =
    useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] =
    useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const videoBlogs = videoBlogsData?.data || [];
  const categories = categoriesData?.data || [];

  // --- State ---
  const [activeTab, setActiveTab] = useState("videoBlogs");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Video Blog state
  const [videoBlogId, setVideoBlogId] = useState<string | null>(null);
  const [videoBlogTitle, setVideoBlogTitle] = useState("");
  const [videoBlogUrl, setVideoBlogUrl] = useState("");
  const [videoBlogCategory, setVideoBlogCategory] = useState("");
  const [videoBlogStatus, setVideoBlogStatus] = useState("active");

  // Category state
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryStatus, setCategoryStatus] = useState("active");

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
    setVideoBlogId(null);
    setVideoBlogTitle("");
    setVideoBlogUrl("");
    setVideoBlogCategory("");
    setVideoBlogStatus("active");
    setCategoryId(null);
    setCategoryName("");
    setCategoryStatus("active");
  };

  // --- Video Blog Modal Handlers ---
  const handleOpenVideoBlogModal = (editMode: boolean, videoBlog?: any) => {
    setIsEditMode(editMode);
    if (editMode && videoBlog) {
      setVideoBlogId(videoBlog._id);
      setVideoBlogTitle(videoBlog.title);
      setVideoBlogUrl(videoBlog.videoUrl);
      setVideoBlogCategory(videoBlog.category || "");
      setVideoBlogStatus(videoBlog.status || "active");
    } else {
      setVideoBlogId(null);
      setVideoBlogTitle("");
      setVideoBlogUrl("");
      setVideoBlogCategory("");
      setVideoBlogStatus("active");
    }
    setModalType("videoBlog");
  };

  const handleVideoBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoBlogTitle.trim()) {
      showAlert("Video blog title is required!", "warning");
      return;
    }

    if (!videoBlogUrl.trim()) {
      showAlert("Video URL is required!", "warning");
      return;
    }

    // Basic URL validation
    try {
      new URL(videoBlogUrl);
    } catch {
      showAlert("Please provide a valid URL!", "warning");
      return;
    }

    try {
      const payload = {
        title: videoBlogTitle.trim(),
        videoUrl: videoBlogUrl.trim(),
        category: videoBlogCategory.trim() || undefined,
        status: videoBlogStatus,
      };

      if (isEditMode && videoBlogId) {
        await updateVideoBlog({ id: videoBlogId, ...payload }).unwrap();
        showAlert("Video blog updated successfully!", "success");
      } else {
        await createVideoBlog(payload).unwrap();
        showAlert("Video blog created successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("Error submitting video blog:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        `${isEditMode ? "Update" : "Creation"} failed!`;
      showAlert(errorMessage, "danger");
    }
  };

  const handleDeleteVideoBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video blog?")) return;
    try {
      await deleteVideoBlog(id).unwrap();
      showAlert("Video blog deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  // --- Category Modal Handlers ---
  const handleOpenCategoryModal = (editMode: boolean, category?: any) => {
    setIsEditMode(editMode);
    if (editMode && category) {
      setCategoryId(category._id);
      setCategoryName(category.name);
      setCategoryStatus(category.status || "active");
    } else {
      setCategoryId(null);
      setCategoryName("");
      setCategoryStatus("active");
    }
    setModalType("category");
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      showAlert("Category name is required!", "warning");
      return;
    }

    try {
      if (isEditMode && categoryId) {
        await updateCategory({
          categoryId,
          name: categoryName.trim(),
          status: categoryStatus,
        }).unwrap();
        showAlert("Category updated successfully!", "success");
      } else {
        await addCategory({
          name: categoryName.trim(),
          status: categoryStatus,
        }).unwrap();
        showAlert("Category added successfully!", "success");
      }

      // Force refetch categories
      await refetchCategories();

      handleCloseModal();
    } catch (err: any) {
      console.error("Error submitting category:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        `${isEditMode ? "Update" : "Creation"} failed!`;
      showAlert(errorMessage, "danger");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(categoryId).unwrap();
      showAlert("Category deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "videoBlog")
      return isEditMode ? "Edit Video Blog" : "Add Video Blog";
    if (modalType === "category")
      return isEditMode ? "Edit Category" : "Add Category";
    return "";
  };

  const renderModalContent = () => {
    if (modalType === "videoBlog") {
      return (
        <Form onSubmit={handleVideoBlogSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Title <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={videoBlogTitle}
              onChange={(e) => setVideoBlogTitle(e.target.value)}
              placeholder="Enter video blog title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Video URL <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="url"
              value={videoBlogUrl}
              onChange={(e) => setVideoBlogUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              required
            />
            <Form.Text className="text-muted">
              Use YouTube embed URL format
            </Form.Text>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={videoBlogCategory}
                  onChange={(e) => setVideoBlogCategory(e.target.value)}
                >
                  <option value="">Select Category (Optional)</option>
                  {categories
                    .filter((cat: any) => cat.status === "active")
                    .map((cat: any) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                </Form.Select>
                {categories.length === 0 && (
                  <Form.Text className="text-muted">
                    No categories available. You can add categories in the
                    Categories tab.
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Status <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={videoBlogStatus}
                  onChange={(e) => setVideoBlogStatus(e.target.value)}
                  required
                >
                  {VIDEO_BLOG_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isCreatingVideoBlog || isUpdatingVideoBlog}
            >
              {isCreatingVideoBlog || isUpdatingVideoBlog ? (
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

    if (modalType === "category") {
      return (
        <Form onSubmit={handleCategorySubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Category Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Status <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={categoryStatus}
              onChange={(e) => setCategoryStatus(e.target.value)}
              required
            >
              {CATEGORY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isAddingCategory || isUpdatingCategory}
            >
              {isAddingCategory || isUpdatingCategory ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{isEditMode ? "Update" : "Add"}</>
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
            <strong>Error!</strong> Failed to load video blogs. Please try again
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
            title="Video Blog Management"
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
            title="Video Blogs"
            description="Manage video blogs and categories."
          >
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || "videoBlogs")}
              className="mb-3"
            >
              {/* VIDEO BLOGS TAB */}
              <Tab eventKey="videoBlogs" title="Video Blogs">
                <div className="mb-3">
                  <Button onClick={() => handleOpenVideoBlogModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Video Blog
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Video URL</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videoBlogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <p className="text-muted mb-0">
                              No video blogs found!
                            </p>
                          </td>
                        </tr>
                      ) : (
                        videoBlogs.map((blog: any, index: number) => (
                          <tr key={blog._id || index}>
                            <td>{index + 1}</td>
                            <td>{blog.title}</td>
                            <td>
                              <a
                                href={blog.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-truncate d-inline-block"
                                style={{ maxWidth: "200px" }}
                              >
                                {blog.videoUrl}
                              </a>
                            </td>
                            <td>{blog.category || "N/A"}</td>
                            <td>
                              <span
                                className={`badge ${
                                  blog.status === "active"
                                    ? "bg-success"
                                    : blog.status === "draft"
                                      ? "bg-warning"
                                      : "bg-danger"
                                }`}
                              >
                                {blog.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenVideoBlogModal(true, blog);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteVideoBlog(blog._id);
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
                        <th>Name</th>
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
                        categories.map((category: any, index: number) => (
                          <tr key={category._id || index}>
                            <td>{index + 1}</td>
                            <td>{category.name}</td>
                            <td>
                              <span
                                className={`badge ${
                                  category.status === "active"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {category.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenCategoryModal(true, category);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteCategory(category._id);
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

export default VideoBlogManagementPage;
