"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import {
  useGetAllEnquiriesQuery,
  useCreateEnquiryMutation,
  useUpdateEnquiryMutation,
  useDeleteEnquiryMutation,
} from "@/app/redux/api/enquiry/enquiryApi";

import Link from "next/link";

type ModalType = "create" | "edit" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const EnquiriesPage = () => {
  const { data, isLoading, refetch } = useGetAllEnquiriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createEnquiry, { isLoading: isCreating }] = useCreateEnquiryMutation();
  const [updateEnquiry, { isLoading: isUpdating }] = useUpdateEnquiryMutation();
  const [deleteEnquiry, { isLoading: isDeleting }] = useDeleteEnquiryMutation();

  const enquiries = data?.data || [];

  const [modalType, setModalType] = useState<ModalType>(null);
  const [name, setName] = useState("");
  const [mono, setMono] = useState("");
  const [destinations, setDestinations] = useState("");
  const [modeOfCommunication, setModeOfCommunication] = useState("call");
  const [status, setStatus] = useState("active");
  const [editingId, setEditingId] = useState<string | null>(null);

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
    setName("");
    setMono("");
    setDestinations("");
    setModeOfCommunication("call");
    setStatus("active");
    setEditingId(null);
  };

  const handleOpenCreateModal = () => {
    setName("");
    setMono("");
    setDestinations("");
    setModeOfCommunication("call");
    setStatus("active");
    setEditingId(null);
    setModalType("create");
  };

  const handleOpenEditModal = (enquiry: any) => {
    setName(enquiry.name);
    setMono(enquiry.mono);
    setDestinations(enquiry.destinations);
    setModeOfCommunication(enquiry.modeOfCommunication || "call");
    setStatus(enquiry.status);
    setEditingId(enquiry._id);
    setModalType("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !mono || !destinations) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    if (!/^[0-9]{10}$/.test(mono)) {
      showAlert("Mobile number must be exactly 10 digits!", "warning");
      return;
    }

    try {
      const payload = { name, mono, destinations, modeOfCommunication, status };

      if (modalType === "edit" && editingId) {
        await updateEnquiry({ id: editingId, data: payload }).unwrap();
        showAlert("Enquiry updated successfully!", "success");
      } else {
        await createEnquiry(payload).unwrap();
        showAlert("Enquiry created successfully!", "success");
      }
      handleCloseModal();
      refetch();
    } catch (err: any) {
      showAlert(
        err?.data?.message ||
          `${modalType === "edit" ? "Update" : "Creation"} failed!`,
        "danger",
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await deleteEnquiry(id).unwrap();
      showAlert("Enquiry deleted successfully!", "success");
      refetch();
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    return modalType === "create" ? "Create Enquiry" : "Edit Enquiry";
  };

  const renderModalContent = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name *</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mobile Number *</Form.Label>
          <Form.Control
            type="tel"
            value={mono}
            onChange={(e) => setMono(e.target.value)}
            placeholder="Enter 10 digit mobile number"
            pattern="[0-9]{10}"
            maxLength={10}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Destinations *</Form.Label>
          <Form.Control
            type="text"
            value={destinations}
            onChange={(e) => setDestinations(e.target.value)}
            placeholder="Enter destinations"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Preferred Communication *</Form.Label>
          <Form.Select
            value={modeOfCommunication}
            onChange={(e) => setModeOfCommunication(e.target.value)}
            required
          >
            <option value="call">Call</option>
            <option value="email">Email</option>
          </Form.Select>
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
            {isCreating || isUpdating ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {modalType === "edit" ? "Updating..." : "Creating..."}
              </>
            ) : modalType === "edit" ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </Form>
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
          <PageTitle
            title="Enquiries Management"
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
            title="Enquiries"
            description="Manage customer enquiries and their details."
          >
            <div className="mb-3">
              <Button onClick={handleOpenCreateModal}>
                <IconifyIcon icon="tabler:plus" className="me-1" />
                Add Enquiry
              </Button>
            </div>

            <div className="table-responsive-sm">
              <table className="table table-striped-columns mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Destinations</th>
                    <th>Message</th>
                    <th>Comm.</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-4">
                        <p className="text-muted mb-0">No enquiries found!</p>
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((enquiry: any, index: number) => (
                      <tr key={enquiry._id || index}>
                        <td>{index + 1}</td>
                        <td>{enquiry.name}</td>
                        <td>{enquiry.mono}</td>
                        <td>{enquiry.email}</td>
                        <td>{enquiry.destinations}</td>
                        <td>{enquiry.message}</td>
                        <td>
                          <span
                            className={`badge ${
                              enquiry.modeOfCommunication === "call"
                                ? "bg-primary"
                                : "bg-info"
                            }`}
                          >
                            {enquiry.modeOfCommunication === "call"
                              ? "Call"
                              : "Email"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              enquiry.status === "active"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {enquiry.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenEditModal(enquiry);
                            }}
                            className="link-reset fs-20 p-1"
                          >
                            <IconifyIcon icon="tabler:pencil" />
                          </Link>
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(enquiry._id);
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

export default EnquiriesPage;
