"use client";

import React, { useState } from "react";
import {
  useGetAllFormsQuery,
  useUpdateFormStatusMutation,
  useDeleteFormMutation,
} from "@/app/redux/api/become-partner/formApi";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Row, Col, Alert, Form, Button, Modal } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import Link from "next/link";

type ModalType = "view" | "status" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const BecomePartnerEnquiriesPage: React.FC = () => {
  const { data: formsData, isLoading } = useGetAllFormsQuery(undefined);
  const [updateFormStatus, { isLoading: isUpdatingStatus }] =
    useUpdateFormStatusMutation();
  const [deleteForm] = useDeleteFormMutation();

  const forms = formsData?.data || [];

  // Modal state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

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
    setSelectedForm(null);
    setSelectedStatus("");
  };

  const handleOpenViewModal = (form: any) => {
    setSelectedForm(form);
    setModalType("view");
  };

  const handleOpenStatusModal = (form: any) => {
    setSelectedForm(form);
    setSelectedStatus(form.status);
    setModalType("status");
  };

  const handleStatusUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedForm || !selectedStatus) {
      showAlert("Please select a status!", "warning");
      return;
    }

    try {
      await updateFormStatus({
        id: selectedForm._id,
        status: selectedStatus,
      }).unwrap();
      showAlert("Status updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      console.error("Failed to update status:", err);
      showAlert(
        err?.data?.message || "Failed to update status. Please try again.",
        "danger",
      );
    }
  };

  const handleDelete = async (id: string, fullName: string) => {
    if (!confirm(`Are you sure you want to delete enquiry from "${fullName}"?`))
      return;

    try {
      await deleteForm(id).unwrap();
      showAlert("Enquiry deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Failed to delete enquiry.", "danger");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: any = {
      pending: "bg-warning",
      "in-progress": "bg-info",
      completed: "bg-success",
      rejected: "bg-danger",
    };
    return statusColors[status] || "bg-secondary";
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
          <PageTitle
            title="Become Partner Enquiries"
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
            title="Partner Enquiries"
            description="Manage all partner enquiry submissions."
          >
            {forms.length > 0 ? (
              <div className="table-responsive-sm">
                <table className="table table-striped-columns mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Card Title</th>
                      <th>City</th>
                      <th>Status</th>
                      <th>Submitted At</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forms.map((form: any, index: number) => (
                      <tr key={form._id || index}>
                        <td>{index + 1}</td>
                        <td>{form.fullName}</td>
                        <td>{form.email}</td>
                        <td>{form.phone}</td>
                        <td>{form.cardTitle}</td>
                        <td>{form.city}</td>
                        <td>
                          <span
                            className={`badge ${getStatusBadge(form.status)}`}
                          >
                            {form.status}
                          </span>
                        </td>
                        <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                        <td className="text-center">
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenViewModal(form);
                            }}
                            className="link-reset fs-20 p-1"
                            title="View Details"
                          >
                            <IconifyIcon icon="tabler:eye" />
                          </Link>
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenStatusModal(form);
                            }}
                            className="link-reset fs-20 p-1"
                            title="Update Status"
                          >
                            <IconifyIcon icon="tabler:edit" />
                          </Link>
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(form._id, form.fullName);
                            }}
                            className="link-reset fs-20 p-1"
                            title="Delete Enquiry"
                          >
                            <IconifyIcon icon="tabler:trash" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <IconifyIcon
                  icon="solar:inbox-bold-duotone"
                  className="fs-1 text-muted mb-3"
                />
                <p className="text-muted mb-3">No enquiries found!</p>
              </div>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* View Details Modal */}
      <Modal
        show={modalType === "view"}
        onHide={handleCloseModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Enquiry Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedForm && (
            <div className="row g-3">
              <div className="col-md-6">
                <strong>Full Name:</strong>
                <p className="mb-0">{selectedForm.fullName}</p>
              </div>
              <div className="col-md-6">
                <strong>Email:</strong>
                <p className="mb-0">{selectedForm.email}</p>
              </div>
              <div className="col-md-6">
                <strong>Phone:</strong>
                <p className="mb-0">{selectedForm.phone}</p>
              </div>
              <div className="col-md-6">
                <strong>Card Title:</strong>
                <p className="mb-0">{selectedForm.cardTitle}</p>
              </div>
              <div className="col-md-6">
                <strong>Country:</strong>
                <p className="mb-0">{selectedForm.country}</p>
              </div>
              <div className="col-md-6">
                <strong>State:</strong>
                <p className="mb-0">{selectedForm.state}</p>
              </div>
              <div className="col-md-6">
                <strong>City:</strong>
                <p className="mb-0">{selectedForm.city}</p>
              </div>
              <div className="col-md-6">
                <strong>Pincode:</strong>
                <p className="mb-0">{selectedForm.pincode}</p>
              </div>
              <div className="col-12">
                <strong>Address:</strong>
                <p className="mb-0">{selectedForm.address}</p>
              </div>
              <div className="col-12">
                <strong>Message:</strong>
                <p className="mb-0">
                  {selectedForm.message || "No message provided"}
                </p>
              </div>
              <div className="col-md-6">
                <strong>Status:</strong>
                <p className="mb-0">
                  <span
                    className={`badge ${getStatusBadge(selectedForm.status)}`}
                  >
                    {selectedForm.status}
                  </span>
                </p>
              </div>
              <div className="col-md-6">
                <strong>Submitted At:</strong>
                <p className="mb-0">
                  {new Date(selectedForm.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Status Modal */}
      <Modal show={modalType === "status"} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleStatusUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>
                Status <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                required
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BecomePartnerEnquiriesPage;
