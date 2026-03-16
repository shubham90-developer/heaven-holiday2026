"use client";

import React, { useState } from "react";
import {
  useGetAllBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useAddImagesToBookMutation,
  useRemoveImageFromBookMutation,
} from "@/app/redux/api/books/booksApi";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Row, Col, Alert, Form, Button, Modal, Card } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { FileUploader } from "@/components/FileUploader";
import Link from "next/link";

type ModalType = "create" | "edit" | "addImages" | "viewImages" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const BooksPage: React.FC = () => {
  const { data: booksData, isLoading } = useGetAllBooksQuery(undefined);
  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();
  const [addImages, { isLoading: isAddingImages }] =
    useAddImagesToBookMutation();
  const [removeImage, { isLoading: isRemovingImage }] =
    useRemoveImageFromBookMutation();

  const books = booksData?.data || [];

  // Modal state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    status: "active",
  });

  const [coverImgFile, setCoverImgFile] = useState<File | null>(null);
  const [coverImgPreview, setCoverImgPreview] = useState<string>("");
  const [imagesFiles, setImagesFiles] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);

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
    setEditingBookId(null);
    setSelectedBook(null);
    setFormData({
      title: "",
      status: "active",
    });
    setCoverImgFile(null);
    setCoverImgPreview("");
    setImagesFiles([]);
    setImagesPreviews([]);
    setImagesToRemove([]);
  };

  const handleOpenCreateModal = () => {
    handleCloseModal();
    setModalType("create");
  };

  const handleOpenEditModal = (book: any) => {
    setFormData({
      title: book.title,
      status: book.status,
    });
    setCoverImgPreview(book.coverImg);
    setEditingBookId(book._id);
    setModalType("edit");
  };

  const handleOpenAddImagesModal = (book: any) => {
    setSelectedBook(book);
    setEditingBookId(book._id);
    setModalType("addImages");
  };

  const handleOpenViewImagesModal = (book: any) => {
    setSelectedBook(book);
    setModalType("viewImages");
  };

  const handleToggleImageRemoval = (imageUrl: string) => {
    setImagesToRemove((prev) => {
      if (prev.includes(imageUrl)) {
        return prev.filter((url) => url !== imageUrl);
      } else {
        return [...prev, imageUrl];
      }
    });
  };

  const handleRemoveImagesUpdate = async () => {
    if (imagesToRemove.length === 0) {
      showAlert("No images selected for removal!", "warning");
      return;
    }

    if (!selectedBook?._id) return;

    try {
      for (const imageUrl of imagesToRemove) {
        await removeImage({
          id: selectedBook._id,
          imageUrl,
        }).unwrap();
      }

      showAlert(
        `${imagesToRemove.length} image(s) removed successfully!`,
        "success",
      );
      handleCloseModal();
    } catch (err: any) {
      console.error("Failed to remove images:", err);
      showAlert(
        err?.data?.message || "Failed to remove images. Please try again.",
        "danger",
      );
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverImageChange = (files: File[]) => {
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

    setCoverImgFile(file);
    setCoverImgPreview(URL.createObjectURL(file));
  };

  const handleGalleryImagesChange = (files: File[]) => {
    if (files.length === 0) return;

    // Validate each file
    const validFiles: File[] = [];
    const previews: string[] = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert("Each image size should not exceed 5MB!", "warning");
        continue;
      }

      if (!file.type.startsWith("image/")) {
        showAlert("Please upload valid image files!", "warning");
        continue;
      }

      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    if (modalType === "create" || modalType === "edit") {
      setImagesFiles(validFiles);
      setImagesPreviews(previews);
    }

    // For addImages: check remaining slots
    if (modalType === "addImages" && selectedBook) {
      setImagesFiles(validFiles);
      setImagesPreviews(previews);
    }
  };

  const handleRemovePreviewImage = (index: number) => {
    setImagesFiles((prev) => prev.filter((_, i) => i !== index));
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      showAlert("Please enter book title!", "warning");
      return;
    }

    if (modalType === "create") {
      if (!coverImgFile) {
        showAlert("Please upload a cover image!", "warning");
        return;
      }

      if (imagesFiles.length === 0) {
        showAlert("Please upload at least one gallery image!", "warning");
        return;
      }
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("status", formData.status);

      if (coverImgFile) {
        submitData.append("coverImg", coverImgFile);
      }

      if (imagesFiles.length > 0) {
        imagesFiles.forEach((file) => {
          submitData.append("images", file);
        });
      }

      if (modalType === "create") {
        await createBook(submitData).unwrap();
        showAlert("Book created successfully!", "success");
      } else if (modalType === "edit" && editingBookId) {
        await updateBook({ id: editingBookId, formData: submitData }).unwrap();
        showAlert("Book updated successfully!", "success");
      }

      handleCloseModal();
    } catch (err: any) {
      console.error("Failed to save book:", err);
      showAlert(
        err?.data?.message || "Failed to save book. Please try again.",
        "danger",
      );
    }
  };

  const handleAddImagesSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (imagesFiles.length === 0) {
      showAlert("Please select at least one image!", "warning");
      return;
    }

    try {
      const submitData = new FormData();
      imagesFiles.forEach((file) => {
        submitData.append("images", file);
      });

      await addImages({ id: editingBookId!, formData: submitData }).unwrap();
      showAlert(
        `${imagesFiles.length} image(s) added successfully!`,
        "success",
      );
      handleCloseModal();
    } catch (err: any) {
      console.error("Failed to add images:", err);
      showAlert(
        err?.data?.message || "Failed to add images. Please try again.",
        "danger",
      );
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteBook(id).unwrap();
      showAlert("Book deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Failed to delete book.", "danger");
    }
  };

  const renderImagesList = (images: string[]) => {
    if (images.length === 0) return "No images";
    if (images.length <= 3) {
      return (
        <div className="d-flex gap-1">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Gallery ${idx + 1}`}
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="d-flex gap-1 align-items-center">
        {images.slice(0, 3).map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Gallery ${idx + 1}`}
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        ))}
        <span className="text-muted small">+{images.length - 3} more</span>
      </div>
    );
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
          <PageTitle title="Books Management" subTitle="Content Management" />

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
            title="Books"
            description="Manage your books and their gallery images."
          >
            {books.length > 0 ? (
              <>
                <div className="mb-3">
                  <Button onClick={handleOpenCreateModal}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Book
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Cover Image</th>
                        <th>Title</th>
                        <th>Gallery Images</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((book: any, index: number) => (
                        <tr key={book._id || index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              src={book.coverImg}
                              alt={book.title}
                              className="avatar-sm rounded"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>{book.title}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {renderImagesList(book.images)}
                              {book.images.length > 0 && (
                                <Link
                                  href=""
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleOpenViewImagesModal(book);
                                  }}
                                  className="link-reset text-primary small"
                                >
                                  View All
                                </Link>
                              )}
                            </div>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                book.status === "active"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {book.status}
                            </span>
                          </td>
                          <td>
                            {new Date(book.createdAt).toLocaleDateString()}
                          </td>
                          <td className="text-center">
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenAddImagesModal(book);
                              }}
                              className="link-reset fs-20 p-1"
                              title="Add Images"
                            >
                              <IconifyIcon icon="tabler:photo-plus" />
                            </Link>
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenEditModal(book);
                              }}
                              className="link-reset fs-20 p-1"
                              title="Edit Book"
                            >
                              <IconifyIcon icon="tabler:pencil" />
                            </Link>
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(book._id, book.title);
                              }}
                              className="link-reset fs-20 p-1"
                              title="Delete Book"
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
                  icon="solar:book-bold-duotone"
                  className="fs-1 text-muted mb-3"
                />
                <p className="text-muted mb-3">No books found!</p>
                <Button onClick={handleOpenCreateModal}>
                  <IconifyIcon icon="tabler:plus" className="me-1" />
                  Add Book
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
            {modalType === "create" ? "Add Book" : "Edit Book"}
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
                placeholder="Enter book title"
                required
              />
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

            <Form.Group className="mb-3">
              <Form.Label>
                Cover Image{" "}
                {modalType === "create" && (
                  <span className="text-danger">*</span>
                )}
              </Form.Label>

              {!coverImgPreview ? (
                <FileUploader
                  onFileUpload={handleCoverImageChange}
                  icon="ri:upload-cloud-2-line"
                  text="Drop cover image here or click to upload."
                  extraText="(Maximum file size: 5MB)"
                />
              ) : (
                <Card className="mt-1 mb-0 shadow-none border">
                  <div className="p-2">
                    <Row className="align-items-center">
                      <Col xs="auto">
                        <img
                          src={coverImgPreview}
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
                          {coverImgFile?.name || "Current Cover Image"}
                        </p>
                        <p className="mb-0 text-muted small">
                          {coverImgFile
                            ? `${(coverImgFile.size / 1024).toFixed(2)} KB`
                            : "Uploaded"}
                        </p>
                      </Col>
                      <Col xs="auto">
                        <Link
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            setCoverImgFile(null);
                            setCoverImgPreview("");
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
                Gallery Images (1-10){" "}
                {modalType === "create" && (
                  <span className="text-danger">*</span>
                )}
              </Form.Label>

              {imagesPreviews.length === 0 ? (
                <FileUploader
                  onFileUpload={handleGalleryImagesChange}
                  icon="ri:upload-cloud-2-line"
                  text="Drop gallery images here or click to upload."
                  extraText="(Select 1-10 images. Maximum 5MB each)"
                />
              ) : (
                <div className="mt-1">
                  <div className="row g-2">
                    {imagesPreviews.map((preview, index) => (
                      <div key={index} className="col-4 col-md-3">
                        <Card className="mb-0 shadow-none border position-relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "120px",
                              objectFit: "cover",
                            }}
                          />
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemovePreviewImage(index);
                            }}
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                            style={{ padding: "2px 6px" }}
                          >
                            <IconifyIcon icon="tabler:x" />
                          </Link>
                        </Card>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="link"
                    className="mt-2 p-0"
                    onClick={() => {
                      setImagesFiles([]);
                      setImagesPreviews([]);
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              )}
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
                {isCreating || isUpdating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {modalType === "create" ? "Creating..." : "Updating..."}
                  </>
                ) : (
                  <>{modalType === "create" ? "Create" : "Update"}</>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Images Modal */}
      <Modal
        show={modalType === "addImages"}
        onHide={handleCloseModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Images to "{selectedBook?.title}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddImagesSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Select Images <span className="text-danger">*</span>
              </Form.Label>

              {imagesPreviews.length === 0 ? (
                <FileUploader
                  onFileUpload={handleGalleryImagesChange}
                  icon="ri:upload-cloud-2-line"
                  text="Drop images here or click to upload."
                />
              ) : (
                <div className="mt-1">
                  <div className="row g-2">
                    {imagesPreviews.map((preview, index) => (
                      <div key={index} className="col-4 col-md-3">
                        <Card className="mb-0 shadow-none border position-relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "120px",
                              objectFit: "cover",
                            }}
                          />
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemovePreviewImage(index);
                            }}
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                            style={{ padding: "2px 6px" }}
                          >
                            <IconifyIcon icon="tabler:x" />
                          </Link>
                        </Card>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="link"
                    className="mt-2 p-0"
                    onClick={() => {
                      setImagesFiles([]);
                      setImagesPreviews([]);
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isAddingImages}>
                {isAddingImages ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Adding...
                  </>
                ) : (
                  "Add Images"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View All Images Modal */}
      <Modal
        show={modalType === "viewImages"}
        onHide={handleCloseModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Gallery Images - "{selectedBook?.title}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBook?.images && selectedBook.images.length > 0 ? (
            <>
              <p className="text-muted small mb-3">
                Click on the red cross to mark images for removal. Selected:{" "}
                {imagesToRemove.length}
              </p>
              <div className="row g-3">
                {selectedBook.images.map((img: string, index: number) => (
                  <div key={index} className="col-6 col-md-4">
                    <Card
                      className={`mb-0 shadow-none border position-relative ${
                        imagesToRemove.includes(img) ? "border-danger" : ""
                      }`}
                      style={{
                        opacity: imagesToRemove.includes(img) ? 0.6 : 1,
                      }}
                    >
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                      <Link
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleImageRemoval(img);
                        }}
                        className={`btn btn-sm position-absolute top-0 end-0 m-1 ${
                          imagesToRemove.includes(img)
                            ? "btn-secondary"
                            : "btn-danger"
                        }`}
                        style={{ padding: "4px 8px" }}
                        title={
                          imagesToRemove.includes(img)
                            ? "Undo removal"
                            : "Mark for removal"
                        }
                      >
                        <IconifyIcon
                          icon={
                            imagesToRemove.includes(img)
                              ? "tabler:arrow-back-up"
                              : "tabler:x"
                          }
                        />
                      </Link>
                      <Card.Body className="p-2 text-center">
                        <small className="text-muted">Image {index + 1}</small>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No gallery images available</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {imagesToRemove.length > 0 && (
            <Button
              variant="danger"
              onClick={handleRemoveImagesUpdate}
              disabled={isRemovingImage}
            >
              {isRemovingImage ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Removing...
                </>
              ) : (
                <>
                  <IconifyIcon icon="tabler:trash" className="me-1" />
                  Remove {imagesToRemove.length} Image(s)
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BooksPage;
