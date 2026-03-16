"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert, Badge } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetTourReviewQuery,
  useUpdateMainFieldsMutation,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/app/redux/api/aboutus/reviewsApi";

import Link from "next/link";

type ModalType = "main" | "review" | null;
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

export default function TourReviewPage() {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetTourReviewQuery(undefined);
  const [updateMainFields] = useUpdateMainFieldsMutation();
  const [addReview] = useAddReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const tourReview = data?.data || null;
  const reviews = tourReview?.reviews || [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Main fields state
  const [mainTitle, setMainTitle] = useState("");
  const [mainSubtitle, setMainSubtitle] = useState("");

  // Review state
  const [rating, setRating] = useState(5);
  const [tag, setTag] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [guides, setGuides] = useState("");
  const [status, setStatus] = useState("active");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

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
    setMainTitle("");
    setMainSubtitle("");
    setRating(5);
    setTag("");
    setTitle("");
    setText("");
    setAuthor("");
    setGuides("");
    setStatus("active");
    setEditingReviewId(null);
  };

  // --- Main Fields Modal Handlers ---
  const handleOpenMainModal = () => {
    if (tourReview) {
      setMainTitle(tourReview.mainTitle || "");
      setMainSubtitle(tourReview.mainSubtitle || "");
    }
    setModalType("main");
  };

  const handleMainFieldsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainTitle || !mainSubtitle) {
      showAlert("Please fill all fields!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMainFields({
        mainTitle,
        mainSubtitle,
      }).unwrap();
      showAlert("Main fields updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Review Modal Handlers ---
  const handleOpenReviewModal = (editMode: boolean, review?: any) => {
    setIsEditMode(editMode);
    if (editMode && review) {
      setRating(review.rating || 5);
      setTag(review.tag || "");
      setTitle(review.title || "");
      setText(review.text || "");
      setAuthor(review.author || "");
      setGuides(review.guides?.join(", ") || "");
      setStatus(review.status || "active");
      setEditingReviewId(review._id);
    } else {
      setRating(5);
      setTag("");
      setTitle("");
      setText("");
      setAuthor("");
      setGuides("");
      setStatus("active");
      setEditingReviewId(null);
    }
    setModalType("review");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tag || !title || !text || !author) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        rating,
        tag,
        title,
        text,
        author,
        guides: guides
          .split(",")
          .map((g) => g.trim())
          .filter((g) => g),
        status,
      };

      if (isEditMode && editingReviewId) {
        await updateReview({
          id: editingReviewId,
          data: reviewData,
        }).unwrap();
        showAlert("Review updated successfully!", "success");
      } else {
        await addReview(reviewData).unwrap();
        showAlert("Review added successfully!", "success");
      }

      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Add"} failed!`,
        "danger",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(id).unwrap();
      showAlert("Review deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "main") {
      return "Update Main Fields";
    }
    if (modalType === "review") {
      return isEditMode ? "Edit Review" : "Add Review";
    }
    return "";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="d-flex align-items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <IconifyIcon
            key={star}
            icon={star <= rating ? "solar:star-bold" : "solar:star-outline"}
            className={star <= rating ? "text-warning" : "text-muted"}
          />
        ))}
        <span className="ms-1 text-muted">({rating})</span>
      </div>
    );
  };

  const renderModalContent = () => {
    if (modalType === "main") {
      return (
        <Form onSubmit={handleMainFieldsSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Main Title <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={mainTitle}
              onChange={(e) => setMainTitle(e.target.value)}
              placeholder="Enter main title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Main Subtitle <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={mainSubtitle}
              onChange={(e) => setMainSubtitle(e.target.value)}
              placeholder="Enter main subtitle"
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

    if (modalType === "review") {
      return (
        <Form onSubmit={handleReviewSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Rating <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  required
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                  <option value={0}>0 Stars</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Tag <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g., Adventure, Family Trip"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              Title <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter review title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Review Text <span className="text-danger">*</span>
            </Form.Label>
            <div style={{ height: "250px", marginBottom: "50px" }}>
              <ReactQuill
                theme="snow"
                value={text}
                onChange={setText}
                modules={quillModules}
                placeholder="Enter review text..."
                style={{ height: "200px" }}
              />
            </div>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Author <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name"
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
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Guides (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              value={guides}
              onChange={(e) => setGuides(e.target.value)}
              placeholder="e.g., John Doe, Jane Smith"
            />
            <Form.Text className="text-muted">
              Separate multiple guide names with commas
            </Form.Text>
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
            <strong>Error!</strong> Failed to load tour reviews. Please try
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
            title="Tour Review Management"
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
            title="Tour Reviews"
            description="Manage tour review section and individual reviews."
          >
            {tourReview ? (
              <>
                <div className="mb-4 p-3 bg-light rounded">
                  <h4>{tourReview.mainTitle}</h4>
                  <p className="text-muted mb-0">{tourReview.mainSubtitle}</p>

                  <div className="d-flex justify-content-end mt-3">
                    <Button onClick={handleOpenMainModal}>
                      <IconifyIcon icon="tabler:edit" className="me-1" />
                      Update Main Fields
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <Button onClick={() => handleOpenReviewModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Review
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Rating</th>
                        <th>Tag</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Guides</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-4">
                            <p className="text-muted mb-0">No reviews found!</p>
                          </td>
                        </tr>
                      ) : (
                        reviews.map((review: any, index: number) => (
                          <tr key={review._id || index}>
                            <td>{index + 1}</td>
                            <td>{renderStars(review.rating)}</td>
                            <td>
                              <Badge bg="info">{review.tag}</Badge>
                            </td>
                            <td>{review.title}</td>
                            <td>{review.author}</td>
                            <td>
                              {review.guides && review.guides.length > 0
                                ? review.guides.join(", ")
                                : "—"}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  review.status === "active"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {review.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenReviewModal(true, review);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteReview(review._id);
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
                  icon="solar:star-bold-duotone"
                  className="fs-1 text-muted mb-3"
                />
                <p className="text-muted mb-0">No data found!</p>
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
}
