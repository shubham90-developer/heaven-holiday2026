"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert, Card } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import {
  useGetOfferBannerQuery,
  useCreateOfferBannerMutation,
  useUpdateOfferBannerMutation,
  useDeleteOfferBannerMutation,
} from "@/app/redux/api/banner/offer-bennerApi";

import Link from "next/link";
import { FileUploader } from "@/components/FileUploader";

type ModalType = "create" | "edit" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const OfferBannerPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetOfferBannerQuery(undefined);
  const [createOfferBanner, { isLoading: isCreating }] =
    useCreateOfferBannerMutation();
  const [updateOfferBanner, { isLoading: isUpdating }] =
    useUpdateOfferBannerMutation();
  const [deleteOfferBanner, { isLoading: isDeleting }] =
    useDeleteOfferBannerMutation();

  const banners = data?.data?.[0]?.banners || [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);

  // Banner fields state
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("inactive");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

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
    setLink("");
    setStatus("inactive");
    setImage(null);
    setImagePreview("");
    setEditingBannerId(null);
  };

  // --- Create Modal ---
  const handleOpenCreateModal = () => {
    setModalType("create");
  };

  // --- Edit Modal ---
  const handleOpenEditModal = (banner: any) => {
    setLink(banner.link || "");
    setStatus(banner.status || "inactive");
    setImagePreview(banner.image || "");
    setEditingBannerId(banner._id);
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

    if (!link) {
      showAlert("Please enter a link!", "warning");
      return;
    }

    if (modalType === "create" && !image) {
      showAlert("Please upload an image!", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("link", link);
      formData.append("status", status);

      if (image) {
        formData.append("image", image);
      }

      if (modalType === "create") {
        await createOfferBanner(formData).unwrap();
        showAlert("Banner created successfully!", "success");
      } else if (modalType === "edit" && editingBannerId) {
        formData.append("bannerId", editingBannerId);
        await updateOfferBanner(formData).unwrap();
        showAlert("Banner updated successfully!", "success");
      }

      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message ||
          `${modalType === "create" ? "Creation" : "Update"} failed!`,
        "danger",
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      await deleteOfferBanner({ id }).unwrap();
      showAlert("Banner deleted successfully!", "success");
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
            <strong>Error!</strong> Failed to load offer banners. Please try
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
            title="Offer Banner Management"
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
            title="Offer Banners"
            description="Manage your offer banners."
          >
            {banners.length > 0 ? (
              <>
                <div className="mb-3">
                  <Button onClick={handleOpenCreateModal}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Banner
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Link</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {banners.map((banner: any, index: number) => (
                        <tr key={banner._id || index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              src={banner.image}
                              alt="Offer Banner"
                              className="avatar-sm rounded"
                              style={{
                                width: "60px",
                                height: "40px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>
                            <a
                              href={banner.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary"
                            >
                              {banner.link}
                            </a>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                banner.status === "active"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {banner.status}
                            </span>
                          </td>
                          <td className="text-center">
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenEditModal(banner);
                              }}
                              className="link-reset fs-20 p-1"
                            >
                              <IconifyIcon icon="tabler:pencil" />
                            </Link>
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(banner._id);
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
                  icon="solar:gallery-bold-duotone"
                  className="fs-1 text-muted mb-3"
                />
                <p className="text-muted mb-3">No banners found!</p>
                <Button onClick={handleOpenCreateModal}>
                  <IconifyIcon icon="tabler:plus" className="me-1" />
                  Add Banner
                </Button>
              </div>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* Create/Edit Banner Modal */}
      <Modal
        show={modalType !== null}
        onHide={handleCloseModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "create" ? "Add Banner" : "Edit Banner"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Link <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter banner link (e.g., https://example.com)"
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

export default OfferBannerPage;
