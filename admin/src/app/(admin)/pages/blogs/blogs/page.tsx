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
  Card,
} from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import {
  useGetAllBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/app/redux/api/blogs/blogsApi";
import { FileUploader } from "@/components/FileUploader";
import ReactQuill from "react-quill-new";
import Link from "next/link";

// styles
import "react-quill-new/dist/quill.snow.css";

type ModalType = "blog" | "category" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const BLOG_STATUSES = ["draft", "published", "archived"];

const BlogManagementPage = () => {
  // --- Data fetching & mutations ---
  const { data: blogData, isLoading, isError } = useGetAllBlogsQuery(undefined);
  const { data: categoriesData, refetch: refetchCategories } =
    useGetAllCategoriesQuery(undefined);

  const [createBlog, { isLoading: isCreatingBlog }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdatingBlog }] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] =
    useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const blogs = blogData?.data || [];
  const categories = categoriesData?.data || [];

  // --- State ---
  const [activeTab, setActiveTab] = useState("blogs");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Blog state
  const [blogId, setBlogId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogReadTime, setBlogReadTime] = useState("");
  const [blogTags, setBlogTags] = useState("");
  const [blogCategory, setBlogCategory] = useState("");
  const [blogStatus, setBlogStatus] = useState("draft");
  const [blogHeroImage, setBlogHeroImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Category state
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  const [alert, setAlert] = useState<AlertType>({
    show: false,
    message: "",
    variant: "success",
  });

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

  const showAlert = (message: string, variant: AlertType["variant"]) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert({ show: false, message: "", variant: "success" });
    }, 5000);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setIsEditMode(false);
    setBlogId(null);
    setBlogTitle("");
    setBlogContent("");
    setBlogReadTime("");
    setBlogTags("");
    setBlogCategory("");
    setBlogStatus("draft");
    setBlogHeroImage(null);
    setImagePreview("");
    setCategoryId(null);
    setCategoryName("");
    setCategorySlug("");
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

    setBlogHeroImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // --- Blog Modal Handlers ---
  const handleOpenBlogModal = (editMode: boolean, blog?: any) => {
    // Check if categories are available
    if (!editMode && categories.length === 0) {
      showAlert("Please create at least one category first!", "warning");
      return;
    }

    setIsEditMode(editMode);
    if (editMode && blog) {
      setBlogId(blog._id);
      setBlogTitle(blog.title);
      setBlogContent(blog.content);
      setBlogReadTime(blog.readTime);
      setBlogTags(blog.tags.join(", "));

      // Extract category ID properly
      let catId = "";
      if (blog.category) {
        if (typeof blog.category === "object" && blog.category._id) {
          catId = blog.category._id;
        } else if (typeof blog.category === "string") {
          catId = blog.category;
        }
      }

      setBlogCategory(catId);
      setBlogStatus(blog.status || "draft");
      setImagePreview(blog.hero || "");
    } else {
      setBlogId(null);
      setBlogTitle("");
      setBlogContent("");
      setBlogReadTime("");
      setBlogTags("");
      setBlogCategory("");
      setBlogStatus("draft");
      setBlogHeroImage(null);
      setImagePreview("");
    }
    setModalType("blog");
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!blogTitle.trim()) {
      showAlert("Blog title is required!", "warning");
      return;
    }

    if (!blogContent.trim()) {
      showAlert("Blog content is required!", "warning");
      return;
    }

    if (!blogCategory) {
      showAlert("Please select a category!", "warning");
      return;
    }

    if (!blogReadTime.trim()) {
      showAlert("Read time is required!", "warning");
      return;
    }

    if (!blogTags.trim()) {
      showAlert("Tags are required!", "warning");
      return;
    }

    if (!isEditMode && !blogHeroImage) {
      showAlert("Please upload a hero image!", "warning");
      return;
    }

    // Validate category is valid MongoDB ObjectId
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(blogCategory)) {
      showAlert("Invalid category selected!", "danger");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", blogTitle.trim());
      formData.append("content", blogContent.trim());
      formData.append("readTime", blogReadTime.trim());
      formData.append(
        "tags",
        JSON.stringify(
          blogTags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t),
        ),
      );
      formData.append("category", blogCategory);
      formData.append("status", blogStatus);
      formData.append("date", Date.now().toString());

      if (blogHeroImage) {
        formData.append("hero", blogHeroImage);
      }

      if (isEditMode && blogId) {
        await updateBlog({ id: blogId, formData }).unwrap();
        showAlert("Blog updated successfully!", "success");
      } else {
        await createBlog(formData).unwrap();
        showAlert("Blog created successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("Error submitting blog:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        `${isEditMode ? "Update" : "Creation"} failed!`;
      showAlert(errorMessage, "danger");
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(id).unwrap();
      showAlert("Blog deleted successfully!", "success");
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
      setCategorySlug(category.slug);
    } else {
      setCategoryId(null);
      setCategoryName("");
      setCategorySlug("");
    }
    setModalType("category");
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim() || !categorySlug.trim()) {
      showAlert("Please fill all fields!", "warning");
      return;
    }

    try {
      if (isEditMode && categoryId) {
        await updateCategory({
          id: categoryId,
          name: categoryName.trim(),
          slug: categorySlug.trim(),
        }).unwrap();
        showAlert("Category updated successfully!", "success");
      } else {
        await createCategory({
          name: categoryName.trim(),
          slug: categorySlug.trim(),
        }).unwrap();
        showAlert("Category created successfully!", "success");
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

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will delete all blogs in this category!"))
      return;
    try {
      await deleteCategory(id).unwrap();
      showAlert("Category deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "blog") return isEditMode ? "Edit Blog" : "Add Blog";
    if (modalType === "category")
      return isEditMode ? "Edit Category" : "Add Category";
    return "";
  };

  const renderModalContent = () => {
    if (modalType === "blog") {
      return (
        <Form onSubmit={handleBlogSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Title <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Read Time <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={blogReadTime}
                  onChange={(e) => setBlogReadTime(e.target.value)}
                  placeholder="e.g., 5 min read"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Category <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={blogCategory}
                  onChange={(e) => setBlogCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
                {categories.length === 0 && (
                  <Form.Text className="text-danger">
                    No categories available. Please create a category first.
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Tags <span className="text-danger">*</span> (comma separated)
                </Form.Label>
                <Form.Control
                  type="text"
                  value={blogTags}
                  onChange={(e) => setBlogTags(e.target.value)}
                  placeholder="e.g., Travel, Food, Adventure"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Status <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={blogStatus}
                  onChange={(e) => setBlogStatus(e.target.value)}
                  required
                >
                  {BLOG_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              Content <span className="text-danger">*</span>
            </Form.Label>
            <div style={{ height: "400px" }}>
              <ReactQuill
                modules={modules}
                value={blogContent}
                onChange={(content) => setBlogContent(content)}
                theme="snow"
                placeholder="Enter blog content..."
                style={{ height: "350px" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Hero Image {!isEditMode && <span className="text-danger">*</span>}
            </Form.Label>

            {imagePreview && (
              <div className="mb-3">
                <Alert variant="info" className="d-flex align-items-center">
                  <IconifyIcon
                    icon="solar:info-circle-bold-duotone"
                    className="fs-20 me-2"
                  />
                  <div className="lh-1">
                    {blogHeroImage ? "New image preview:" : "Current image:"}
                  </div>
                </Alert>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{
                    maxHeight: "300px",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            <FileUploader
              onFileUpload={handleImageChange}
              icon="ri:upload-cloud-2-line"
              text="Drop image here or click to upload."
              extraText="(Maximum file size: 5MB. Supported formats: JPG, PNG, WebP)"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isCreatingBlog || isUpdatingBlog}
            >
              {isCreatingBlog || isUpdatingBlog ? (
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
              Slug <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              placeholder="e.g., travel, food-cuisine"
              required
            />
            <Form.Text className="text-muted">
              Use lowercase letters and hyphens only
            </Form.Text>
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
              {isCreatingCategory || isUpdatingCategory ? (
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
            <strong>Error!</strong> Failed to load blogs. Please try again
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
          <PageTitle title="Blog Management" subTitle="Content Management" />

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
            title="Blog Posts"
            description="Manage blog posts and categories."
          >
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || "blogs")}
              className="mb-3"
            >
              {/* BLOGS TAB */}
              <Tab eventKey="blogs" title="Blogs">
                <div className="mb-3">
                  <Button onClick={() => handleOpenBlogModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Blog
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Read Time</th>
                        <th>Tags</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            <p className="text-muted mb-0">No blogs found!</p>
                          </td>
                        </tr>
                      ) : (
                        blogs.map((blog: any, index: number) => (
                          <tr key={blog._id || index}>
                            <td>{index + 1}</td>
                            <td>{blog.title}</td>
                            <td>{blog.category?.name || "N/A"}</td>
                            <td>{blog.readTime}</td>
                            <td>
                              {blog.tags.slice(0, 2).map((tag: string) => (
                                <span
                                  key={tag}
                                  className="badge bg-secondary me-1"
                                >
                                  {tag}
                                </span>
                              ))}
                              {blog.tags.length > 2 && (
                                <span>+{blog.tags.length - 2}</span>
                              )}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  blog.status === "published"
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
                                  handleOpenBlogModal(true, blog);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteBlog(blog._id);
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
                        <th>Slug</th>
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
                            <td>{cat.name}</td>
                            <td>{cat.slug}</td>
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

export default BlogManagementPage;
