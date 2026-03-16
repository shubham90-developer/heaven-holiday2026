"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Row, Col, Alert, Badge } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import { useGetAllUsersQuery } from "@/app/redux/api/users/usersApi";
import Link from "next/link";

const AllUsersPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useGetAllUsersQuery({ page, limit });

  const users = data?.data?.users || [];
  const total = data?.data?.users.length || 0;
  const totalPages = Math.ceil(total / limit);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleView = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const DOCUMENT_TYPES = [
    { key: "aadharCard", label: "Aadhar Card" },
    { key: "panCard", label: "PAN Card" },
    { key: "passport", label: "Passport" },
    { key: "voterId", label: "Voter ID" },
    { key: "birthCertificate", label: "Birth Certificate" },
    { key: "drivingLicense", label: "Driving License" },
    { key: "visa", label: "Visa" },
    { key: "otherDocument", label: "Other Document" },
  ];

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
            <strong>Error!</strong> Failed to load users. Please try again
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
          <PageTitle title="Users Management" subTitle="User Management" />

          <ComponentContainerCard
            title="All Users"
            description="View all registered users and their details."
          >
            <div className="table-responsive-sm">
              <table className="table table-striped-columns mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Auth Provider</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4">
                        <p className="text-muted mb-0">No users found!</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((user: any, index: number) => (
                      <tr key={user._id || index}>
                        <td>{(page - 1) * limit + index + 1}</td>
                        <td>{user.name || "—"}</td>
                        <td>{user.email || "—"}</td>
                        <td>{user.phone || "—"}</td>
                        <td>
                          <span
                            className={`badge ${user.role === "admin" ? "bg-danger" : "bg-primary"}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              user.accountStatus === "active"
                                ? "bg-success"
                                : user.accountStatus === "pending"
                                  ? "bg-warning"
                                  : "bg-danger"
                            }`}
                          >
                            {user.accountStatus}
                          </span>
                        </td>
                        <td>{user.authProvider || "—"}</td>
                        <td className="text-center">
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleView(user);
                            }}
                            className="link-reset fs-20 p-1"
                          >
                            <IconifyIcon icon="tabler:eye" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <p className="text-muted mb-0">
                  Showing {(page - 1) * limit + 1}–
                  {Math.min(page * limit, total)} of {total} users
                </p>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <IconifyIcon icon="tabler:chevron-left" />
                  </Button>
                  <span className="align-self-center">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <IconifyIcon icon="tabler:chevron-right" />
                  </Button>
                </div>
              </div>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* View User Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              {/* Profile */}
              <div className="d-flex align-items-center gap-3 mb-4">
                {selectedUser.profileImg ? (
                  <img
                    src={selectedUser.profileImg}
                    alt="Profile"
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="bg-secondary d-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: 70, height: 70 }}
                  >
                    <IconifyIcon
                      icon="tabler:user"
                      className="text-white fs-24"
                    />
                  </div>
                )}
                <div>
                  <h5 className="mb-0">{selectedUser.name || "No Name"}</h5>
                  <small className="text-muted">
                    {selectedUser.email || "No Email"}
                  </small>
                </div>
              </div>

              {/* Basic Info */}
              <h6 className="text-uppercase text-muted mb-2">Basic Info</h6>
              <table className="table table-bordered table-sm mb-4">
                <tbody>
                  <tr>
                    <th>Phone</th>
                    <td>{selectedUser.phone || "—"}</td>
                    <th>Gender</th>
                    <td>{selectedUser.gender || "—"}</td>
                  </tr>
                  <tr>
                    <th>Nationality</th>
                    <td>{selectedUser.nationality || "—"}</td>
                    <th>Date of Birth</th>
                    <td>
                      {selectedUser.dateOfBirth
                        ? new Date(
                            selectedUser.dateOfBirth,
                          ).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                  <tr>
                    <th>Role</th>
                    <td>
                      <span
                        className={`badge ${selectedUser.role === "admin" ? "bg-danger" : "bg-primary"}`}
                      >
                        {selectedUser.role}
                      </span>
                    </td>
                    <th>Account Status</th>
                    <td>
                      <span
                        className={`badge ${
                          selectedUser.accountStatus === "active"
                            ? "bg-success"
                            : selectedUser.accountStatus === "pending"
                              ? "bg-warning"
                              : "bg-danger"
                        }`}
                      >
                        {selectedUser.accountStatus}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Auth Provider</th>
                    <td>{selectedUser.authProvider || "—"}</td>
                    <th>Address</th>
                    <td>{selectedUser.address?.address || "—"}</td>
                  </tr>
                  <tr>
                    <th>Phone Verified</th>
                    <td>
                      <span
                        className={`badge ${selectedUser.phoneVerified ? "bg-success" : "bg-danger"}`}
                      >
                        {selectedUser.phoneVerified ? "Yes" : "No"}
                      </span>
                    </td>
                    <th>Email Verified</th>
                    <td>
                      <span
                        className={`badge ${selectedUser.emailVerified ? "bg-success" : "bg-danger"}`}
                      >
                        {selectedUser.emailVerified ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Joined</th>
                    <td colSpan={3}>
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Documents */}
              <h6 className="text-uppercase text-muted mb-2">Documents</h6>
              <table className="table table-bordered table-sm mb-0">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Front Image</th>
                    <th>Back Image</th>
                  </tr>
                </thead>
                <tbody>
                  {DOCUMENT_TYPES.map(({ key, label }) => {
                    const doc = selectedUser[key];
                    const hasFront = doc?.frontImage;
                    const hasBack = doc?.backImage;
                    const hasDoc = hasFront || hasBack;

                    if (!hasDoc) return null;

                    return (
                      <tr key={key}>
                        <td>
                          <strong>{label}</strong>
                          {key === "otherDocument" && doc?.documentName && (
                            <div>
                              <small className="text-muted">
                                {doc.documentName}
                              </small>
                            </div>
                          )}
                        </td>
                        <td>
                          {hasFront ? (
                            <a
                              href={doc.frontImage}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={doc.frontImage}
                                alt="front"
                                style={{
                                  width: 60,
                                  height: 40,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                }}
                              />
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          {hasBack ? (
                            <a
                              href={doc.backImage}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={doc.backImage}
                                alt="back"
                                style={{
                                  width: 60,
                                  height: 40,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                }}
                              />
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {DOCUMENT_TYPES.every(
                    ({ key }) =>
                      !selectedUser[key]?.frontImage &&
                      !selectedUser[key]?.backImage,
                  ) && (
                    <tr>
                      <td colSpan={3} className="text-center text-muted py-3">
                        No documents uploaded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AllUsersPage;
