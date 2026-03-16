"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert, Card } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import {
  useGetAllCitiesQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} from "@/app/redux/api/contactCity/contactCityApi";

import Link from "next/link";
import Image from "next/image";
import { FileUploader } from "@/components/FileUploader";

type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const ContactCitiesPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetAllCitiesQuery(undefined);
  const [createCity, { isLoading: isCreating }] = useCreateCityMutation();
  const [updateCity, { isLoading: isUpdating }] = useUpdateCityMutation();
  const [deleteCity] = useDeleteCityMutation();

  const cities = data?.data || [];

  // --- State ---
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // City state
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [status, setStatus] = useState("active");
  const [editingCityId, setEditingCityId] = useState<string | null>(null);

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
    setShowModal(false);
    setIsEditMode(false);
    setName("");
    setIcon(null);
    setIconPreview("");
    setStatus("active");
    setEditingCityId(null);
  };

  const handleIconChange = (files: File[]) => {
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

    setIcon(file);
    setIconPreview(URL.createObjectURL(file));
  };

  // --- City Modal Handlers ---
  const handleOpenModal = (editMode: boolean, city?: any) => {
    setIsEditMode(editMode);
    if (editMode && city) {
      setName(city.name);
      setIconPreview(city.icon);
      setStatus(city.status || "active");
      setEditingCityId(city._id);
      setIcon(null);
    } else {
      setName("");
      setIcon(null);
      setIconPreview("");
      setStatus("active");
      setEditingCityId(null);
    }
    setShowModal(true);
  };

  const handleCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    if (!isEditMode && !icon) {
      showAlert("Please upload an icon!", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("status", status);

      if (icon) {
        formData.append("icon", icon);
      }

      if (isEditMode && editingCityId) {
        const result = await updateCity({
          id: editingCityId,
          data: formData,
        }).unwrap();

        showAlert("City updated successfully!", "success");
      } else {
        const result = await createCity(formData).unwrap();

        showAlert("City added successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("Submit error:", err);
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    }
  };

  const handleDeleteCity = async (cityId: string) => {
    if (!confirm("Are you sure you want to delete this city?")) return;
    try {
      await deleteCity(cityId).unwrap();
      showAlert("City deleted successfully!", "success");
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
            <strong>Error!</strong> Failed to load cities. Please try again
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
          <PageTitle title="Cities Management" subTitle="Content Management" />

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
            title="Cities"
            description="Manage your city locations and icons."
          >
            <div className="mb-3">
              <Button onClick={() => handleOpenModal(false)}>
                <IconifyIcon icon="tabler:plus" className="me-1" />
                Add City
              </Button>
            </div>

            <div className="table-responsive-sm">
              <table className="table table-striped-columns mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        <p className="text-muted mb-0">No cities found!</p>
                      </td>
                    </tr>
                  ) : (
                    cities.map((city: any, index: number) => (
                      <tr key={city._id || index}>
                        <td>{index + 1}</td>
                        <td>
                          {city.icon && (
                            <Image
                              src={city.icon}
                              alt={city.name}
                              width={40}
                              height={40}
                              className="rounded"
                              style={{ objectFit: "cover" }}
                            />
                          )}
                        </td>
                        <td>{city.name}</td>
                        <td>
                          <span
                            className={`badge ${
                              city.status === "active"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {city.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenModal(true, city);
                            }}
                            className="link-reset fs-20 p-1"
                          >
                            <IconifyIcon icon="tabler:pencil" />
                          </Link>
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteCity(city._id);
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

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit City" : "Add City"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCitySubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter city name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Icon * {isEditMode && "(Leave empty to keep current icon)"}
              </Form.Label>

              {!iconPreview ? (
                <FileUploader
                  onFileUpload={handleIconChange}
                  icon="ri:upload-cloud-2-line"
                  text="Drop icon here or click to upload."
                  extraText="(Maximum file size: 5MB)"
                />
              ) : (
                <Card className="mt-1 mb-0 shadow-none border">
                  <div className="p-2">
                    <Row className="align-items-center">
                      <Col xs="auto">
                        <img
                          src={iconPreview}
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
                          {icon?.name || "Current Icon"}
                        </p>
                        <p className="mb-0 text-muted small">
                          {icon
                            ? `${(icon.size / 1024).toFixed(2)} KB`
                            : "Uploaded"}
                        </p>
                      </Col>
                      <Col xs="auto">
                        <Link
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            setIcon(null);
                            setIconPreview("");
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
              <Form.Label>Status *</Form.Label>
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
                {(isCreating || isUpdating) && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                {isEditMode ? "Update" : "Add"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ContactCitiesPage;
