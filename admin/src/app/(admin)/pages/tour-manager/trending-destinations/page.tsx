"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert, Card } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import {
  useGetTrendingDestinationsQuery,
  useUpdateTitleMutation,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} from "@/app/redux/api/tourManager/trendingDestinationsAPi";

import Link from "next/link";
import { FileUploader } from "@/components/FileUploader";

type ModalType = "create" | "edit" | "editTitle" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const TrendingDestinationsPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } =
    useGetTrendingDestinationsQuery(undefined);
  const [updateTitle] = useUpdateTitleMutation();
  const [createDestination] = useCreateDestinationMutation();
  const [updateDestination] = useUpdateDestinationMutation();
  const [deleteDestination] = useDeleteDestinationMutation();

  const pageTitle = data?.data?.title || "Trending Destinations";
  const destinations = data?.data?.destinations || [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Title state
  const [newTitle, setNewTitle] = useState("");

  // Destination fields state
  const [title, setTitle] = useState("");
  const [tours, setTours] = useState(0);
  const [departures, setDepartures] = useState(0);
  const [guests, setGuests] = useState(0);
  const [category, setCategory] = useState<"World" | "India">("World");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [order, setOrder] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editingDestinationId, setEditingDestinationId] = useState<
    string | null
  >(null);

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
    setIsSubmitting(false);
    setTitle("");
    setTours(0);
    setDepartures(0);
    setGuests(0);
    setCategory("World");
    setStatus("active");
    setOrder(0);
    setImage(null);
    setImagePreview("");
    setEditingDestinationId(null);
    setNewTitle("");
  };

  // --- Title Modal ---
  const handleOpenTitleModal = () => {
    setNewTitle(pageTitle);
    setModalType("editTitle");
  };

  const handleTitleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle) {
      showAlert("Please enter a title!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateTitle({ title: newTitle }).unwrap();
      showAlert("Title updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Title update failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Create Modal ---
  const handleOpenCreateModal = () => {
    setModalType("create");
  };

  // --- Edit Modal ---
  const handleOpenEditModal = (destination: any) => {
    setTitle(destination.title || "");
    setTours(destination.tours || 0);
    setDepartures(destination.departures || 0);
    setGuests(destination.guests || 0);
    setCategory(destination.category || "World");
    setStatus(destination.status || "active");
    setOrder(destination.order || 0);
    setImagePreview(destination.image || "");
    setEditingDestinationId(destination._id);
    setModalType("edit");
  };

  const handleImageUpload = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showAlert("Image size should be less than 5MB!", "warning");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showAlert("Please upload a valid image file!", "warning");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      showAlert("Please enter a title!", "warning");
      return;
    }

    if (modalType === "create" && !image) {
      showAlert("Please upload an image!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalType === "create") {
        await createDestination({
          title,
          image: image!,
          tours,
          departures,
          guests,
          category,
          status,
          order,
        }).unwrap();
        showAlert("Destination created successfully!", "success");
      } else if (modalType === "edit" && editingDestinationId) {
        await updateDestination({
          id: editingDestinationId,
          title,
          ...(image && { image }),
          tours,
          departures,
          guests,
          category,
          status,
          order,
        }).unwrap();
        showAlert("Destination updated successfully!", "success");
      }

      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message ||
          `${modalType === "create" ? "Creation" : "Update"} failed!`,
        "danger",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    try {
      await deleteDestination(id).unwrap();
      showAlert("Destination deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
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

  if (isError) {
    return (
      <div className="container mt-5">
        <Alert variant="danger" className="d-flex align-items-center">
          <IconifyIcon
            icon="solar:danger-triangle-bold-duotone"
            className="fs-20 me-2"
          />
          <div>
            <strong>Error!</strong> Failed to load trending destinations. Please
            try again later.
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
            title="Trending Destinations Management"
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
            title="Trending Destinations"
            description="Manage your trending destinations."
          >
            {destinations.length > 0 || data?.data ? (
              <>
                <div className="mb-4 p-3 bg-light rounded">
                  <h4>{pageTitle}</h4>
                  <p className="text-muted mb-3">
                    {data?.data?.subtitle || ""}
                  </p>

                  <div className="d-flex justify-content-end mt-3">
                    <Button onClick={handleOpenTitleModal}>
                      <IconifyIcon icon="tabler:edit" className="me-1" />
                      Update Title
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <Button onClick={handleOpenCreateModal}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Destination
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Tours</th>
                        <th>Departures</th>
                        <th>Guests</th>
                        <th>Order</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {destinations.map((destination: any, index: number) => (
                        <tr key={destination._id || index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              src={destination.image}
                              alt={destination.title}
                              className="avatar-sm rounded"
                              style={{
                                width: "60px",
                                height: "40px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>{destination.title}</td>
                          <td>
                            <span
                              className={`badge ${
                                destination.category === "World"
                                  ? "bg-primary"
                                  : "bg-info"
                              }`}
                            >
                              {destination.category}
                            </span>
                          </td>
                          <td>{destination.tours}</td>
                          <td>{destination.departures}</td>
                          <td>{destination.guests}</td>
                          <td>{destination.order}</td>
                          <td>
                            <span
                              className={`badge ${
                                destination.status === "active"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {destination.status}
                            </span>
                          </td>
                          <td className="text-center">
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenEditModal(destination);
                              }}
                              className="link-reset fs-20 p-1"
                            >
                              <IconifyIcon icon="tabler:pencil" />
                            </Link>
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(destination._id);
                              }}
                              className="link-reset fs-20 p-1"
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
                  icon="solar:map-point-wave-bold-duotone"
                  className="fs-1 text-muted mb-3"
                />
                <p className="text-muted mb-3">No data found!</p>
                <Button onClick={handleOpenCreateModal}>
                  <IconifyIcon icon="tabler:plus" className="me-1" />
                  Add Destination
                </Button>
              </div>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* Edit Title Modal */}
      <Modal
        show={modalType === "editTitle"}
        onHide={handleCloseModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Page Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleTitleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter page title"
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
        </Modal.Body>
      </Modal>

      {/* Create/Edit Destination Modal */}
      <Modal
        show={modalType === "create" || modalType === "edit"}
        onHide={handleCloseModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "create" ? "Add Destination" : "Edit Destination"}
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter destination title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Image{" "}
                {modalType === "create" && (
                  <span className="text-danger">*</span>
                )}
              </Form.Label>
              {!imagePreview ? (
                <FileUploader
                  onFileUpload={handleImageUpload}
                  icon="ri:upload-cloud-2-line"
                  text="Drop image here or click to upload."
                  extraText="(Maximum file size: 5MB. Supported formats: JPG, PNG, WebP)"
                />
              ) : (
                <Card className="mt-1 mb-0 shadow-none border">
                  <div className="p-2">
                    <Row className="align-items-center">
                      <Col xs="auto">
                        <img
                          src={imagePreview}
                          className="rounded"
                          alt="preview"
                          style={{
                            width: "80px",
                            height: "48px",
                            objectFit: "cover",
                          }}
                        />
                      </Col>
                      <Col className="ps-0">
                        <p className="text-muted fw-bold mb-0">
                          {image?.name || "Current Image"}
                        </p>
                        <p className="mb-0 text-muted small">
                          {image
                            ? `${(image.size / 1024).toFixed(2)} KB`
                            : "Uploaded"}
                        </p>
                      </Col>
                      <Col xs="auto">
                        <Link
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            setImage(null);
                            setImagePreview("");
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

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Category <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as "World" | "India")
                    }
                    required
                  >
                    <option value="World">World</option>
                    <option value="India">India</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Status <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "active" | "inactive")
                    }
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tours</Form.Label>
                  <Form.Control
                    type="number"
                    value={tours}
                    onChange={(e) => setTours(Number(e.target.value))}
                    min="0"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Departures</Form.Label>
                  <Form.Control
                    type="number"
                    value={departures}
                    onChange={(e) => setDepartures(Number(e.target.value))}
                    min="0"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Guests</Form.Label>
                  <Form.Control
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Display Order</Form.Label>
              <Form.Control
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                min="0"
                placeholder="0"
              />
              <Form.Text className="text-muted">
                Lower numbers appear first in the list.
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
                    {modalType === "create" ? "Creating..." : "Updating..."}
                  </>
                ) : modalType === "create" ? (
                  "Create"
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TrendingDestinationsPage;
