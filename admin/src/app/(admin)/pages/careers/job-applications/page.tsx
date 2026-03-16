"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import {
  useGetAllJobApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useDeleteJobApplicationMutation,
} from "@/app/redux/api/jobApplications/jobApplicationsApi";

import Link from "next/link";

type ModalType = "status" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-warning" },
  { value: "reviewed", label: "Reviewed", color: "bg-info" },
  { value: "shortlisted", label: "Shortlisted", color: "bg-primary" },
  { value: "rejected", label: "Rejected", color: "bg-danger" },
  { value: "hired", label: "Hired", color: "bg-success" },
];

const JobApplicationsPage = () => {
  // --- State for pagination and filters ---
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetAllJobApplicationsQuery({
    status: statusFilter || undefined,
    page,
    limit,
    search: searchQuery || undefined,
  });

  const [updateStatus] = useUpdateApplicationStatusMutation();
  const [deleteApplication] = useDeleteJobApplicationMutation();

  const applications = data?.data || [];
  const pagination = data?.pagination;

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const [selectedStatus, setSelectedStatus] = useState("");

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
    setSelectedApplicationId(null);
    setSelectedStatus("");
  };

  // --- Status Modal Handlers ---
  const handleOpenStatusModal = (
    applicationId: string,
    currentStatus: string,
  ) => {
    setSelectedApplicationId(applicationId);
    setSelectedStatus(currentStatus);
    setModalType("status");
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStatus || !selectedApplicationId) {
      showAlert("Please select a status!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateStatus({
        id: selectedApplicationId,
        status: selectedStatus,
      }).unwrap();
      showAlert("Status updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      await deleteApplication(applicationId).unwrap();
      showAlert("Application deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "status") {
      return "Update Application Status";
    }
    return "";
  };

  const renderModalContent = () => {
    if (modalType === "status") {
      return (
        <Form onSubmit={handleStatusSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Status *</Form.Label>
            <Form.Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              required
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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

    return null;
  };

  const getStatusBadgeClass = (status: string) => {
    const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status);
    return statusOption?.color || "bg-secondary";
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
            <strong>Error!</strong> Failed to load applications. Please try
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
            title="Job Applications Management"
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
            title="Job Applications"
            description="Manage job applications and update their status."
          >
            {/* Filters */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Filter by Status</Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">All Status</option>
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="table-responsive-sm">
              <table className="table table-striped-columns mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4">
                        <p className="text-muted mb-0">
                          No applications found!
                        </p>
                      </td>
                    </tr>
                  ) : (
                    applications.map((application: any, index: number) => (
                      <tr key={application._id || index}>
                        <td>{(page - 1) * limit + index + 1}</td>
                        <td>{application.fullName}</td>
                        <td>{application.email}</td>
                        <td>{application.phone}</td>
                        <td>{application.currentCity}</td>
                        <td>{application.yearsOfExperience} years</td>
                        <td>
                          <span
                            className={`badge ${getStatusBadgeClass(application.status)}`}
                          >
                            {STATUS_OPTIONS.find(
                              (opt) => opt.value === application.status,
                            )?.label || application.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenStatusModal(
                                application._id,
                                application.status,
                              );
                            }}
                            className="link-reset fs-20 p-1"
                          >
                            <IconifyIcon icon="tabler:pencil" />
                          </Link>
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteApplication(application._id);
                            }}
                            className="link-reset fs-20 p-1"
                          >
                            <IconifyIcon icon="tabler:trash" />
                          </Link>
                          {application.resume && (
                            <Link
                              href={application.resume}
                              target="_blank"
                              className="link-reset fs-20 p-1"
                            >
                              <IconifyIcon icon="tabler:file-download" />
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted">
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, pagination.total)} of{" "}
                  {pagination.total} applications
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-3 py-1">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>

      <Modal show={modalType !== null} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{getModalTitle()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderModalContent()}</Modal.Body>
      </Modal>
    </>
  );
};

export default JobApplicationsPage;
