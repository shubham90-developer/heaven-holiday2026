"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetPreambleQuery,
  useCreatePreambleMutation,
  useUpdateMainFieldsMutation,
  useAddTableRowMutation,
  useUpdateTableRowMutation,
  useDeleteTableRowMutation,
} from "@/app/redux/api/csrPolicy/csrPolicyApi";
import Link from "next/link";

type ModalType = "main" | "row" | null;
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

const PreamblePage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetPreambleQuery(undefined);
  const [createPreamble] = useCreatePreambleMutation();
  const [updateMainFields] = useUpdateMainFieldsMutation();
  const [addTableRow] = useAddTableRowMutation();
  const [updateTableRow] = useUpdateTableRowMutation();
  const [deleteTableRow] = useDeleteTableRowMutation();

  const preamble = data?.data;
  const tableRows = preamble?.tableRows || [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Main fields state
  const [heading, setHeading] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [subtitle, setSubtitle] = useState("");

  // Row state
  const [rowTitle, setRowTitle] = useState("");
  const [rowParticulars, setRowParticulars] = useState("");
  const [rowStatus, setRowStatus] = useState("Active");
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

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
    setHeading("");
    setParagraph("");
    setSubtitle("");
    setRowTitle("");
    setRowParticulars("");
    setRowStatus("Active");
    setEditingRowId(null);
  };

  // --- Main Fields Modal Handlers ---
  const handleOpenMainModal = (editMode: boolean) => {
    setIsEditMode(editMode);
    if (editMode && preamble) {
      setHeading(preamble.heading || "");
      setParagraph(preamble.paragraph || "");
      setSubtitle(preamble.subtitle || "");
    } else {
      setHeading("");
      setParagraph("");
      setSubtitle("");
    }
    setModalType("main");
  };

  const handleMainFieldsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heading || !paragraph || !subtitle) {
      showAlert("Please fill all fields!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateMainFields({
          heading,
          paragraph: paragraph,
          subtitle,
        }).unwrap();
        showAlert("Main fields updated successfully!", "success");
      } else {
        await createPreamble({
          heading,
          paragraph: paragraph,
          subtitle,
          tableRows: [],
        }).unwrap();
        showAlert("Preamble created successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Table Row Modal Handlers ---
  const handleOpenRowModal = (editMode: boolean, row?: any) => {
    setIsEditMode(editMode);
    if (editMode && row) {
      setRowTitle(row.title);
      setRowParticulars(row.particulars);
      setRowStatus(row.status || "Active");
      setEditingRowId(row._id);
    } else {
      setRowTitle("");
      setRowParticulars("");
      setRowStatus("Active");
      setEditingRowId(null);
    }
    setModalType("row");
  };

  const handleRowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rowTitle || !rowParticulars) {
      showAlert("Please fill all fields!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && editingRowId) {
        await updateTableRow({
          id: editingRowId,
          title: rowTitle,
          particulars: rowParticulars,
          status: rowStatus,
        }).unwrap();
        showAlert("Table row updated successfully!", "success");
      } else {
        await addTableRow({
          title: rowTitle,
          particulars: rowParticulars,
          status: rowStatus,
        }).unwrap();
        showAlert("Table row added successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRow = async (rowId: string) => {
    if (!confirm("Are you sure you want to delete this row?")) return;
    try {
      await deleteTableRow(rowId).unwrap();
      showAlert("Table row deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "main") {
      return isEditMode ? "Update Main Fields" : "Create Preamble";
    }
    if (modalType === "row") {
      return isEditMode ? "Edit Table Row" : "Add Table Row";
    }
    return "";
  };

  const renderModalContent = () => {
    if (modalType === "main") {
      return (
        <Form onSubmit={handleMainFieldsSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Heading *</Form.Label>
            <Form.Control
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter heading"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Paragraph *</Form.Label>
            <div style={{ height: "250px" }}>
              <ReactQuill
                theme="snow"
                value={paragraph}
                onChange={setParagraph}
                modules={quillModules}
                placeholder="Enter paragraph..."
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subtitle *</Form.Label>
            <Form.Control
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Enter subtitle"
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

    if (modalType === "row") {
      return (
        <Form onSubmit={handleRowSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              value={rowTitle}
              onChange={(e) => setRowTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Particulars *</Form.Label>
            <div style={{ height: "200px" }}>
              <ReactQuill
                theme="snow"
                value={rowParticulars}
                onChange={setRowParticulars}
                modules={quillModules}
                placeholder="Enter particulars..."
                style={{ height: "150px", marginBottom: "50px" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status *</Form.Label>
            <Form.Select
              value={rowStatus}
              onChange={(e) => setRowStatus(e.target.value)}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
            <strong>Error!</strong> Failed to load preamble. Please try again
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
          <PageTitle title="Preamble" subTitle="Management" />

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
            title="Preamble Information"
            description="Manage your preamble content and table data."
          >
            {preamble ? (
              <>
                <div className="mb-4 p-3 bg-light rounded">
                  <h4>{preamble.heading}</h4>

                  <div
                    className="text-muted mb-3"
                    dangerouslySetInnerHTML={{ __html: preamble.paragraph }}
                  />

                  <p className="fw-semibold mb-0">{preamble.subtitle}</p>
                  <div className="d-flex justify-content-end mt-3">
                    <Button onClick={() => handleOpenMainModal(true)}>
                      <IconifyIcon icon="tabler:edit" className="me-1" />
                      Update Main Fields
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <Button onClick={() => handleOpenRowModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Table Row
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Particulars</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            <p className="text-muted mb-0">
                              No table rows found!
                            </p>
                          </td>
                        </tr>
                      ) : (
                        tableRows.map((row: any, index: number) => (
                          <tr key={row._id || index}>
                            <td>{index + 1}</td>
                            <td>{row.title}</td>
                            <td>
                              <div
                                style={{
                                  maxWidth: "400px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: row.particulars,
                                }}
                              />
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  row.status === "Active"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenRowModal(true, row);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteRow(row._id);
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
                  icon="solar:document-text-bold-duotone"
                  className="fs-1 text-muted mb-3"
                />
                <p className="text-muted mb-3">
                  No preamble found. Create your first preamble!
                </p>
                <Button onClick={() => handleOpenMainModal(false)}>
                  <IconifyIcon icon="tabler:plus" className="me-1" />
                  Create Preamble
                </Button>
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
};

export default PreamblePage;
