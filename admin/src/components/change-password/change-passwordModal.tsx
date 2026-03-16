"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useChangePasswordMutation,
  useUpdateEmailMutation,
} from "@/app/redux/api/adminApi/authApi";

interface ToastState {
  message: string;
  type: "success" | "error";
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  // ✅ Tab state
  const [activeTab, setActiveTab] = useState<"password" | "email">("password");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // ✅ Email fields
  const [newEmail, setNewEmail] = useState<string>("");
  const [emailPassword, setEmailPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [changePassword] = useChangePasswordMutation();
  const [updateEmail] = useUpdateEmailMutation(); // ✅ new mutation
  const router = useRouter();

  const isPasswordFormValid: boolean = !!(
    currentPassword &&
    newPassword &&
    confirmPassword
  );

  // ✅ Email form validation
  const isEmailFormValid: boolean = !!(newEmail && emailPassword);

  const showToast = (message: string, type: "success" | "error"): void => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = (): void => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setNewEmail("");
    setEmailPassword("");
    setActiveTab("password");
  };

  // Existing password handler — unchanged
  const handlePasswordSubmit = async (): Promise<void> => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Please fill all fields", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (currentPassword === newPassword) {
      showToast(
        "New password must be different from current password",
        "error",
      );
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();
      showToast(
        "Password changed successfully! Redirecting to login...",
        "success",
      );
      resetForm();
      setTimeout(() => {
        onClose();
        router.push("/auth/login");
      }, 2000);
    } catch (error: any) {
      const message: string =
        error?.data?.message || "Failed to change password";
      if (message.includes("incorrect")) {
        showToast("Current password is incorrect", "error");
      } else {
        showToast(message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Email update handler
  const handleEmailSubmit = async (): Promise<void> => {
    if (!newEmail || !emailPassword) {
      showToast("Please fill all fields", "error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    try {
      setLoading(true);
      await updateEmail({
        newEmail,
        currentPassword: emailPassword,
      }).unwrap();
      showToast("Email updated successfully!", "success");
      resetForm();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      const message: string = error?.data?.message || "Failed to update email";
      if (message.includes("incorrect")) {
        showToast("Current password is incorrect", "error");
      } else if (message.includes("already in use")) {
        showToast("Email already in use", "error");
      } else {
        showToast(message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className={`position-fixed top-0 start-50 translate-middle-x mt-3 px-4 py-2 rounded text-white fw-medium z-3 ${
            toast.type === "success" ? "bg-success" : "bg-danger"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={() => {
          resetForm();
          onClose();
        }}
      />

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Account Settings</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              />
            </div>

            {/* ✅ Tabs */}
            <div className="modal-body">
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "password" ? "active" : ""}`}
                    onClick={() => setActiveTab("password")}
                  >
                    Change Password
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "email" ? "active" : ""}`}
                    onClick={() => setActiveTab("email")}
                  >
                    Update Email
                  </button>
                </li>
              </ul>

              {/* Password Tab — existing, unchanged */}
              {activeTab === "password" && (
                <>
                  <p className="text-muted mb-4">
                    Enter your current password and set a new one
                  </p>

                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      Current Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCurrentPassword(e.target.value)
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      New Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPassword(e.target.value)
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      Confirm Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setConfirmPassword(e.target.value)
                      }
                      className="form-control"
                    />
                  </div>
                </>
              )}

              {/* ✅ Email Tab */}
              {activeTab === "email" && (
                <>
                  <p className="text-muted mb-4">
                    Enter your new email and confirm with your current password
                  </p>

                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      New Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter new email address"
                      value={newEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEmail(e.target.value)
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      Current Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password to confirm"
                      value={emailPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmailPassword(e.target.value)
                      }
                      className="form-control"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                Cancel
              </button>
              {/* ✅ Button and handler switches based on active tab */}
              <button
                type="button"
                className="btn btn-primary fw-semibold"
                onClick={
                  activeTab === "password"
                    ? handlePasswordSubmit
                    : handleEmailSubmit
                }
                disabled={
                  loading ||
                  (activeTab === "password"
                    ? !isPasswordFormValid
                    : !isEmailFormValid)
                }
              >
                {loading
                  ? "Updating..."
                  : activeTab === "password"
                    ? "Change Password"
                    : "Update Email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordModal;
