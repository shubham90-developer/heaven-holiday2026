"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert, Badge } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import Link from "next/link";
import {
  useGetAllRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useCreateUserMutation,
  useGetAllUsersQuery,
  useChangeUserRoleMutation,
  useDeleteUserMutation,
} from "@/app/redux/api/adminApi/authApi";

// All available permissions matching your middleware
const ALL_PERMISSIONS = [
  { label: "Dashboard", value: "dashboard:view" },
  { label: "Hero Banner", value: "hero:view" },
  { label: "All Users", value: "users:view" },
  { label: "About Us", value: "about-us:view" },
  { label: "Principles", value: "principles:view" },
  { label: "Services", value: "services:view" },
  { label: "Gallery", value: "gallery:view" },
  { label: "Footer Info", value: "footer-info:view" },
  { label: "Join Us", value: "join-us:view" },
  { label: "Reviews", value: "reviews:view" },
  { label: "Contact", value: "contact:view" },
  { label: "CSR Preamble", value: "preamble:view" },
  { label: "Management Philosophy", value: "management-philosophy:view" },
  { label: "Purpose Policy", value: "purpose-policy:view" },
  { label: "CSR FAQ", value: "csr-faq:view" },
  { label: "Tour Manager", value: "tour-manager:view" },
  { label: "Tour Manager Team", value: "tour-manager-team:view" },
  { label: "Trending Destinations", value: "trending-destinations:view" },
  { label: "Tours Gallery", value: "tours-gallery:view" },
  { label: "Tour Includes", value: "tour-includes:view" },
  { label: "Tour Packages", value: "tour-packages:view" },
  { label: "Tour Bookings", value: "tour-bookings:view" },
  { label: "Travel Deals Hero", value: "travel-deals-hero:view" },
  { label: "Holiday Section", value: "holiday-section:view" },
  { label: "Offer Banners", value: "offer-banners:view" },
  { label: "Online Booking", value: "online-booking:view" },
  { label: "Sales Partner Steps", value: "sales-partner-steps:view" },
  { label: "Become Partner", value: "become-partner:view" },
  { label: "Partner Enquiries", value: "partner-enquiries:view" },
  { label: "Enquiries", value: "enquiries:view" },
  { label: "Offer Banner", value: "offer-banner:view" },
  { label: "Podcasts", value: "podcasts:view" },
  { label: "Books", value: "books:view" },
  { label: "Blogs", value: "blogs:view" },
  { label: "Video Blogs", value: "video-blogs:view" },
  { label: "Team", value: "team:view" },
  { label: "Careers Header", value: "careers-header:view" },
  { label: "Job Openings", value: "job-openings:view" },
  { label: "Hiring Process", value: "hiring:view" },
  { label: "Empowering Women", value: "empowering-women:view" },
  { label: "Excited to Work", value: "excited-to-work:view" },
  { label: "Job Applications", value: "job-applications:view" },
  { label: "Contact Office", value: "contact-office:view" },
  { label: "Contact City", value: "contact-city:view" },
  { label: "Contact Info", value: "contact-info:view" },
  { label: "Corporate Travel", value: "corporate-travel:view" },
  { label: "Singapore Visa", value: "singapore-visa:view" },
  { label: "FAQ", value: "faq:view" },
  { label: "Counter", value: "counter:view" },
  { label: "Annual Return", value: "annual-return:view" },
  { label: "Privacy Policy", value: "privacy-policy:view" },
  { label: "Terms & Conditions", value: "terms-conditions:view" },
  { label: "Settings", value: "settings:view" },
];

type ModalType = "role" | "user" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const RoleManagementPage = () => {
  // ─── RTK QUERIES ──────────────────────────────────────
  const { data: rolesData, isLoading: rolesLoading } =
    useGetAllRolesQuery(undefined);
  const { data: usersData, isLoading: usersLoading } =
    useGetAllUsersQuery(undefined);
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [createUser] = useCreateUserMutation();
  const [changeUserRole] = useChangeUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const roles = rolesData?.data || [];
  const users = usersData?.data || [];

  // ─── UI STATE ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"roles" | "users">("roles");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── ROLE STATE ────────────────────────────────────────
  const [roleId, setRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // ─── USER STATE ────────────────────────────────────────
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  // ─── ALERT STATE ───────────────────────────────────────
  const [alert, setAlert] = useState<AlertType>({
    show: false,
    message: "",
    variant: "success",
  });

  const showAlert = (message: string, variant: AlertType["variant"]) => {
    setAlert({ show: true, message, variant });
    setTimeout(
      () => setAlert({ show: false, message: "", variant: "success" }),
      5000,
    );
  };

  // ─── MODAL HANDLERS ────────────────────────────────────
  const handleCloseModal = () => {
    setModalType(null);
    setIsEditMode(false);
    setIsSubmitting(false);
    setRoleId(null);
    setRoleName("");
    setSelectedPermissions([]);
    setUserId(null);
    setUsername("");
    setEmail("");
    setPassword("");
    setSelectedRoleId("");
  };

  // ─── ROLE MODAL ────────────────────────────────────────
  const handleOpenRoleModal = (editMode: boolean, role?: any) => {
    setIsEditMode(editMode);
    if (editMode && role) {
      setRoleId(role._id);
      setRoleName(role.name);
      setSelectedPermissions(role.permissions || []);
    }
    setModalType("role");
  };

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const handleSelectAllPermissions = () => {
    if (selectedPermissions.length === ALL_PERMISSIONS.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(ALL_PERMISSIONS.map((p) => p.value));
    }
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName) {
      showAlert("Please enter a role name!", "warning");
      return;
    }
    if (selectedPermissions.length === 0) {
      showAlert("Please select at least one permission!", "warning");
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditMode && roleId) {
        await updateRole({
          id: roleId,
          permissions: selectedPermissions,
        }).unwrap();
        showAlert("Role updated successfully!", "success");
      } else {
        await createRole({
          name: roleName,
          permissions: selectedPermissions,
        }).unwrap();
        showAlert("Role created successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Operation failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(id).unwrap();
      showAlert("Role deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  // ─── USER MODAL ────────────────────────────────────────
  const handleOpenUserModal = (editMode: boolean, user?: any) => {
    setIsEditMode(editMode);
    if (editMode && user) {
      setUserId(user._id);
      setUsername(user.username);
      setEmail(user.email);
      setSelectedRoleId(user.role?._id || "");
    }
    setModalType("user");
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId) {
      showAlert("Please select a role!", "warning");
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditMode && userId) {
        await changeUserRole({ id: userId, roleId: selectedRoleId }).unwrap();
        showAlert("User role updated successfully!", "success");
      } else {
        await createUser({
          username,
          email,
          password,
          roleId: selectedRoleId,
        }).unwrap();
        showAlert("User created successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Operation failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id).unwrap();
      showAlert("User deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  // ─── MODAL CONTENT ─────────────────────────────────────
  const renderModalContent = () => {
    if (modalType === "role") {
      return (
        <Form onSubmit={handleRoleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Role Name *</Form.Label>
            <Form.Control
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Content Manager"
              disabled={isEditMode}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="mb-0">Permissions *</Form.Label>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleSelectAllPermissions}
              >
                {selectedPermissions.length === ALL_PERMISSIONS.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
            <Row>
              {ALL_PERMISSIONS.map((permission) => (
                <Col md={4} key={permission.value} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id={permission.value}
                    label={permission.label}
                    checked={selectedPermissions.includes(permission.value)}
                    onChange={() => handlePermissionToggle(permission.value)}
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </Form>
      );
    }

    if (modalType === "user") {
      return (
        <Form onSubmit={handleUserSubmit}>
          {!isEditMode && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Username *</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password *</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </Form.Group>
            </>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Role *</Form.Label>
            <Form.Select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              required
            >
              <option value="">Select a role</option>
              {roles.map((role: any) => (
                <option key={role._id} value={role._id}>
                  {role.name}
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
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Role"
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </Form>
      );
    }

    return null;
  };

  // ─── LOADING ───────────────────────────────────────────
  if (rolesLoading || usersLoading) {
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

  // ─── RENDER ────────────────────────────────────────────
  return (
    <>
      <Row>
        <Col xs={12}>
          <PageTitle title="Role Management" subTitle="Access Control" />

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
                      : "solar:shield-warning-line-duotone"
                }
                className="fs-20 me-2"
              />
              <div className="lh-1">{alert.message}</div>
            </Alert>
          )}

          {/* ─── TABS ─────────────────────────────────── */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "roles" ? "active" : ""}`}
                onClick={() => setActiveTab("roles")}
              >
                Roles
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                Users
              </button>
            </li>
          </ul>

          {/* ─── ROLES TAB ────────────────────────────── */}
          {activeTab === "roles" && (
            <ComponentContainerCard
              title="Roles"
              description="Create and manage roles with specific permissions."
            >
              <div className="mb-3">
                <Button onClick={() => handleOpenRoleModal(false)}>
                  <IconifyIcon icon="tabler:plus" className="me-1" />
                  Add Role
                </Button>
              </div>

              <div className="table-responsive-sm">
                <table className="table table-striped-columns mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Role Name</th>
                      <th>Permissions</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          <p className="text-muted mb-0">No roles found!</p>
                        </td>
                      </tr>
                    ) : (
                      roles.map((role: any, index: number) => (
                        <tr key={role._id || index}>
                          <td>{index + 1}</td>
                          <td>{role.name}</td>
                          <td>
                            <Badge bg="info">
                              {role.permissions?.length || 0} permissions
                            </Badge>
                          </td>
                          <td className="text-center">
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenRoleModal(true, role);
                              }}
                              className="link-reset fs-20 p-1"
                            >
                              <IconifyIcon icon="tabler:pencil" />
                            </Link>
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteRole(role._id);
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
          )}

          {/* ─── USERS TAB ────────────────────────────── */}
          {activeTab === "users" && (
            <ComponentContainerCard
              title="Users"
              description="Create and manage users with assigned roles."
            >
              <div className="mb-3">
                <Button onClick={() => handleOpenUserModal(false)}>
                  <IconifyIcon icon="tabler:plus" className="me-1" />
                  Add User
                </Button>
              </div>

              <div className="table-responsive-sm">
                <table className="table table-striped-columns mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          <p className="text-muted mb-0">No users found!</p>
                        </td>
                      </tr>
                    ) : (
                      users.map((user: any, index: number) => (
                        <tr key={user._id || index}>
                          <td>{index + 1}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            <Badge bg="primary">
                              {user.role?.name || "N/A"}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenUserModal(true, user);
                              }}
                              className="link-reset fs-20 p-1"
                              title="Change Role"
                            >
                              <IconifyIcon icon="tabler:pencil" />
                            </Link>
                            <Link
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteUser(user._id);
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
          )}
        </Col>
      </Row>

      {/* ─── MODAL ──────────────────────────────────── */}
      <Modal
        show={modalType !== null}
        onHide={handleCloseModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "role"
              ? isEditMode
                ? "Edit Role"
                : "Add Role"
              : isEditMode
                ? "Change User Role"
                : "Add User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderModalContent()}</Modal.Body>
      </Modal>
    </>
  );
};

export default RoleManagementPage;
