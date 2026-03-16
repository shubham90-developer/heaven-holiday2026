"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetContentQuery,
  useUpdateJoinUsMutation,
} from "@/app/redux/api/joinUs/joinUsApi";

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

export default function JoinUsPage() {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetContentQuery(undefined);
  const [updateJoinUs, { isLoading: isUpdating }] = useUpdateJoinUsMutation();

  const content = data?.data || null;

  // --- State ---
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");

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

  const handleOpenModal = () => {
    if (content) {
      setTitle(content.title || "");
      setSubtitle(content.subtitle || "");
      setDescription(content.description || "");
      setButtonText(content.button?.text || "Join Our Family");
      setButtonLink(content.button?.link || "#");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTitle("");
    setSubtitle("");
    setDescription("");
    setButtonText("");
    setButtonLink("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !subtitle.trim() || !description.trim()) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    if (!buttonText.trim() || !buttonLink.trim()) {
      showAlert("Please fill button text and link!", "warning");
      return;
    }

    try {
      await updateJoinUs({
        title: title.trim(),
        subtitle: subtitle.trim(),
        description,
        button: {
          text: buttonText.trim(),
          link: buttonLink.trim(),
        },
      }).unwrap();

      showAlert("Join Us content updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Failed to update content!", "danger");
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
            <strong>Error!</strong> Failed to load Join Us content. Please try
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
          <PageTitle title="Join Us Management" subTitle="Content Management" />

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
            title="Join Us Content"
            description="Manage the Join Us section content displayed on your website."
          >
            {content ? (
              <>
                <div className="mb-4 p-4 bg-light rounded">
                  <div className="mb-3">
                    <h5 className="text-muted mb-2">Title</h5>
                    <h4 className="mb-0">{content.title}</h4>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-muted mb-2">Subtitle</h5>
                    <p className="mb-0">{content.subtitle}</p>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-muted mb-2">Description</h5>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: content.description,
                      }}
                      className="ql-editor p-0"
                    />
                  </div>

                  <div className="mb-3">
                    <h5 className="text-muted mb-2">Button</h5>
                    <div className="d-flex align-items-center gap-3">
                      <Button variant="primary" disabled>
                        {content.button?.text || "Join Our Family"}
                      </Button>
                      <small className="text-muted">
                        Link: <code>{content.button?.link || "#"}</code>
                      </small>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted">
                      <strong>Last Updated:</strong>{" "}
                      {new Date(content.updatedAt).toLocaleString()}
                    </small>
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <Button onClick={handleOpenModal} variant="primary">
                    <IconifyIcon icon="tabler:edit" className="me-1" />
                    Update Content
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <IconifyIcon
                  icon="solar:users-group-two-rounded-bold-duotone"
                  className="fs-1 text-muted mb-3"
                />
                <p className="text-muted mb-3">No content found!</p>
                <Button onClick={handleOpenModal} variant="primary">
                  <IconifyIcon icon="tabler:plus" className="me-1" />
                  Create Content
                </Button>
              </div>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Join Us Content</Modal.Title>
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
                placeholder="Enter title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Subtitle <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter subtitle"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Description <span className="text-danger">*</span>
              </Form.Label>
              <div style={{ height: "400px", marginBottom: "50px" }}>
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  modules={quillModules}
                  placeholder="Enter description..."
                  style={{ height: "350px" }}
                />
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Button Text <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Enter button text"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Button Link <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                    placeholder="Enter button link"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
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
    </>
  );
}
