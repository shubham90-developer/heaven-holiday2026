"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Modal, Form, Row, Col, Alert, Card } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetContactDetailsQuery,
  useUpdateContactDetailsMutation,
} from "@/app/redux/api/aboutus/contactUsApi";

type ModalType = "offices" | "callUs" | "writeToUs" | "socialLinks" | null;
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

export default function ContactUsPage() {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetContactDetailsQuery(undefined);
  const [updateContactDetails] = useUpdateContactDetailsMutation();

  const contactDetails = data?.data || null;

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Offices state
  const [officesTitle, setOfficesTitle] = useState("");
  const [officesDescription, setOfficesDescription] = useState("");
  const [mapLink, setMapLink] = useState("");

  // Call Us state
  const [callUsTitle, setCallUsTitle] = useState("");
  const [phoneNumbersList, setPhoneNumbersList] = useState<string[]>([""]);

  // Write to Us state
  const [writeToUsTitle, setWriteToUsTitle] = useState("");
  const [emailsList, setEmailsList] = useState<string[]>([""]);

  // Social Links state
  const [facebook, setFacebook] = useState("");
  const [youtube, setYoutube] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");

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
    setOfficesTitle("");
    setOfficesDescription("");
    setMapLink("");
    setCallUsTitle("");
    setPhoneNumbersList([""]);
    setWriteToUsTitle("");
    setEmailsList([""]);
    setFacebook("");
    setYoutube("");
    setLinkedin("");
    setInstagram("");
  };

  // --- Offices Modal Handlers ---
  const handleOpenOfficesModal = () => {
    if (contactDetails?.offices) {
      setOfficesTitle(contactDetails.offices.title || "");
      setOfficesDescription(contactDetails.offices.description || "");
      setMapLink(contactDetails.offices.mapLink || "");
    }
    setModalType("offices");
  };

  const handleOfficesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await updateContactDetails({
        offices: {
          title: officesTitle,
          description: officesDescription,
          mapLink: mapLink,
        },
        callUs: contactDetails?.callUs || {
          title: "Call Us",
          phoneNumbers: [],
        },
        writeToUs: contactDetails?.writeToUs || {
          title: "Write to Us",
          emails: [],
        },
        socialLinks: contactDetails?.socialLinks || {},
      }).unwrap();

      showAlert("Offices section updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Call Us Modal Handlers ---
  const handleOpenCallUsModal = () => {
    if (contactDetails?.callUs) {
      setCallUsTitle(contactDetails.callUs.title || "");
      setPhoneNumbersList(
        contactDetails.callUs.phoneNumbers &&
          contactDetails.callUs.phoneNumbers.length > 0
          ? contactDetails.callUs.phoneNumbers
          : [""],
      );
    }
    setModalType("callUs");
  };

  const addPhoneField = () => {
    if (phoneNumbersList.length < 2) {
      setPhoneNumbersList([...phoneNumbersList, ""]);
    }
  };

  const removePhoneField = (index: number) => {
    if (phoneNumbersList.length > 1) {
      setPhoneNumbersList(phoneNumbersList.filter((_, i) => i !== index));
    }
  };

  const updatePhoneField = (index: number, value: string) => {
    const updated = [...phoneNumbersList];
    updated[index] = value;
    setPhoneNumbersList(updated);
  };

  const handleCallUsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validPhoneNumbers = phoneNumbersList.filter((p) => p.trim());

    setIsSubmitting(true);
    try {
      await updateContactDetails({
        offices: contactDetails?.offices || { title: "Our Offices" },
        callUs: {
          title: callUsTitle,
          phoneNumbers: validPhoneNumbers,
        },
        writeToUs: contactDetails?.writeToUs || {
          title: "Write to Us",
          emails: [],
        },
        socialLinks: contactDetails?.socialLinks || {},
      }).unwrap();

      showAlert("Call Us section updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Write to Us Modal Handlers ---
  const handleOpenWriteToUsModal = () => {
    if (contactDetails?.writeToUs) {
      setWriteToUsTitle(contactDetails.writeToUs.title || "");
      setEmailsList(
        contactDetails.writeToUs.emails &&
          contactDetails.writeToUs.emails.length > 0
          ? contactDetails.writeToUs.emails
          : [""],
      );
    }
    setModalType("writeToUs");
  };

  const addEmailField = () => {
    if (emailsList.length < 2) {
      setEmailsList([...emailsList, ""]);
    }
  };

  const removeEmailField = (index: number) => {
    if (emailsList.length > 1) {
      setEmailsList(emailsList.filter((_, i) => i !== index));
    }
  };

  const updateEmailField = (index: number, value: string) => {
    const updated = [...emailsList];
    updated[index] = value;
    setEmailsList(updated);
  };

  const handleWriteToUsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validEmails = emailsList.filter((e) => e.trim());

    setIsSubmitting(true);
    try {
      await updateContactDetails({
        offices: contactDetails?.offices || { title: "Our Offices" },
        callUs: contactDetails?.callUs || {
          title: "Call Us",
          phoneNumbers: [],
        },
        writeToUs: {
          title: writeToUsTitle,
          emails: validEmails,
        },
        socialLinks: contactDetails?.socialLinks || {},
      }).unwrap();

      showAlert("Write to Us section updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Social Links Modal Handlers ---
  const handleOpenSocialLinksModal = () => {
    if (contactDetails?.socialLinks) {
      setFacebook(contactDetails.socialLinks.facebook || "");
      setYoutube(contactDetails.socialLinks.youtube || "");
      setLinkedin(contactDetails.socialLinks.linkedin || "");
      setInstagram(contactDetails.socialLinks.instagram || "");
    }
    setModalType("socialLinks");
  };

  const handleSocialLinksSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await updateContactDetails({
        offices: contactDetails?.offices || { title: "Our Offices" },
        callUs: contactDetails?.callUs || {
          title: "Call Us",
          phoneNumbers: [],
        },
        writeToUs: contactDetails?.writeToUs || {
          title: "Write to Us",
          emails: [],
        },
        socialLinks: {
          facebook,
          youtube,
          linkedin,
          instagram,
        },
      }).unwrap();

      showAlert("Social Links updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case "offices":
        return "Update Offices Section";
      case "callUs":
        return "Update Call Us Section";
      case "writeToUs":
        return "Update Write to Us Section";
      case "socialLinks":
        return "Update Social Links";
      default:
        return "";
    }
  };

  const renderModalContent = () => {
    if (modalType === "offices") {
      return (
        <Form onSubmit={handleOfficesSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={officesTitle}
              onChange={(e) => setOfficesTitle(e.target.value)}
              placeholder="Enter title"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <div style={{ height: "250px", marginBottom: "50px" }}>
              <ReactQuill
                theme="snow"
                value={officesDescription}
                onChange={setOfficesDescription}
                modules={quillModules}
                placeholder="Enter description..."
                style={{ height: "200px" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Map Link</Form.Label>
            <Form.Control
              type="text"
              value={mapLink}
              onChange={(e) => setMapLink(e.target.value)}
              placeholder="Enter Google Maps link"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
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

    if (modalType === "callUs") {
      return (
        <Form onSubmit={handleCallUsSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={callUsTitle}
              onChange={(e) => setCallUsTitle(e.target.value)}
              placeholder="Enter title"
            />
          </Form.Group>

          <Form.Label>Phone Numbers</Form.Label>
          {phoneNumbersList.map((phone, index) => (
            <div key={index} className="mb-2">
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  value={phone}
                  onChange={(e) => updatePhoneField(index, e.target.value)}
                  placeholder={`Phone number ${index + 1}`}
                />
                {phoneNumbersList.length > 1 && (
                  <Button
                    variant="outline-danger"
                    onClick={() => removePhoneField(index)}
                  >
                    <IconifyIcon icon="tabler:x" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {phoneNumbersList.length < 2 && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={addPhoneField}
              className="mb-3"
            >
              <IconifyIcon icon="tabler:plus" className="me-1" />
              Add Phone Number
            </Button>
          )}

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
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

    if (modalType === "writeToUs") {
      return (
        <Form onSubmit={handleWriteToUsSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={writeToUsTitle}
              onChange={(e) => setWriteToUsTitle(e.target.value)}
              placeholder="Enter title"
            />
          </Form.Group>

          <Form.Label>Email Addresses</Form.Label>
          {emailsList.map((email, index) => (
            <div key={index} className="mb-2">
              <div className="d-flex gap-2">
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => updateEmailField(index, e.target.value)}
                  placeholder={`Email address ${index + 1}`}
                />
                {emailsList.length > 1 && (
                  <Button
                    variant="outline-danger"
                    onClick={() => removeEmailField(index)}
                  >
                    <IconifyIcon icon="tabler:x" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {emailsList.length < 2 && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={addEmailField}
              className="mb-3"
            >
              <IconifyIcon icon="tabler:plus" className="me-1" />
              Add Email Address
            </Button>
          )}

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
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

    if (modalType === "socialLinks") {
      return (
        <Form onSubmit={handleSocialLinksSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Facebook URL</Form.Label>
            <Form.Control
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/yourpage"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>YouTube URL</Form.Label>
            <Form.Control
              type="text"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              placeholder="https://youtube.com/yourchannel"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>LinkedIn URL</Form.Label>
            <Form.Control
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/company/yourcompany"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Instagram URL</Form.Label>
            <Form.Control
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/youraccount"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
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
            <strong>Error!</strong> Failed to load contact details. Please try
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
            title="Contact Us Management"
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

          <Row>
            {/* Offices Section */}
            <Col md={6} className="mb-4">
              <div className="h-100">
                <ComponentContainerCard
                  title="Our Offices"
                  description="Manage office location information"
                >
                  <div
                    className="position-relative pb-5"
                    style={{ minHeight: "280px" }}
                  >
                    {contactDetails?.offices ? (
                      <>
                        <div>
                          <h5 className="mb-2">
                            {contactDetails.offices.title}
                          </h5>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: contactDetails.offices.description || "",
                            }}
                            className="ql-editor p-0 mb-3"
                          />
                          {contactDetails.offices.mapLink && (
                            <p className="text-muted small mb-3">
                              <strong>Map Link:</strong>{" "}
                              <a
                                href={contactDetails.offices.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Map
                              </a>
                            </p>
                          )}
                        </div>
                        <div className="position-absolute bottom-0 end-0">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={handleOpenOfficesModal}
                          >
                            <IconifyIcon icon="tabler:edit" className="me-1" />
                            Edit
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-muted">No data available</p>
                        <Button size="sm" onClick={handleOpenOfficesModal}>
                          Add Information
                        </Button>
                      </div>
                    )}
                  </div>
                </ComponentContainerCard>
              </div>
            </Col>

            {/* Call Us Section */}
            <Col md={6} className="mb-4">
              <div className="h-100">
                <ComponentContainerCard
                  title="Call Us"
                  description="Manage phone numbers"
                >
                  <div
                    className="position-relative pb-5"
                    style={{ minHeight: "280px" }}
                  >
                    {contactDetails?.callUs ? (
                      <>
                        <div>
                          <h5 className="mb-2">
                            {contactDetails.callUs.title}
                          </h5>
                          {contactDetails.callUs.phoneNumbers &&
                          contactDetails.callUs.phoneNumbers.length > 0 ? (
                            <ul className="mb-3">
                              {contactDetails.callUs.phoneNumbers.map(
                                (phone: any, idx: any) => (
                                  <li key={idx}>
                                    <a href={`tel:${phone}`}>{phone}</a>
                                  </li>
                                ),
                              )}
                            </ul>
                          ) : (
                            <p className="text-muted mb-3">
                              No phone numbers added
                            </p>
                          )}
                        </div>
                        <div className="position-absolute bottom-0 end-0">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={handleOpenCallUsModal}
                          >
                            <IconifyIcon icon="tabler:edit" className="me-1" />
                            Edit
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-muted">No data available</p>
                        <Button size="sm" onClick={handleOpenCallUsModal}>
                          Add Information
                        </Button>
                      </div>
                    )}
                  </div>
                </ComponentContainerCard>
              </div>
            </Col>

            {/* Write to Us Section */}
            <Col md={6} className="mb-4">
              <div className="h-100">
                <ComponentContainerCard
                  title="Write to Us"
                  description="Manage email addresses"
                >
                  <div
                    className="position-relative pb-5"
                    style={{ minHeight: "280px" }}
                  >
                    {contactDetails?.writeToUs ? (
                      <>
                        <div>
                          <h5 className="mb-2">
                            {contactDetails.writeToUs.title}
                          </h5>
                          {contactDetails.writeToUs.emails &&
                          contactDetails.writeToUs.emails.length > 0 ? (
                            <ul className="mb-3">
                              {contactDetails.writeToUs.emails.map(
                                (email: any, idx: any) => (
                                  <li key={idx}>
                                    <a href={`mailto:${email}`}>{email}</a>
                                  </li>
                                ),
                              )}
                            </ul>
                          ) : (
                            <p className="text-muted mb-3">No emails added</p>
                          )}
                        </div>
                        <div className="position-absolute bottom-0 end-0">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={handleOpenWriteToUsModal}
                          >
                            <IconifyIcon icon="tabler:edit" className="me-1" />
                            Edit
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-muted">No data available</p>
                        <Button size="sm" onClick={handleOpenWriteToUsModal}>
                          Add Information
                        </Button>
                      </div>
                    )}
                  </div>
                </ComponentContainerCard>
              </div>
            </Col>

            {/* Social Links Section */}
            <Col md={6} className="mb-4">
              <div className="h-100">
                <ComponentContainerCard
                  title="Social Links"
                  description="Manage social media links"
                >
                  <div
                    className="position-relative pb-5"
                    style={{ minHeight: "280px" }}
                  >
                    {contactDetails?.socialLinks ? (
                      <>
                        <div>
                          <div className="mb-3">
                            {contactDetails.socialLinks.facebook && (
                              <div className="mb-2">
                                <IconifyIcon
                                  icon="ri:facebook-fill"
                                  className="me-2"
                                />
                                <a
                                  href={contactDetails.socialLinks.facebook}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Facebook
                                </a>
                              </div>
                            )}
                            {contactDetails.socialLinks.youtube && (
                              <div className="mb-2">
                                <IconifyIcon
                                  icon="ri:youtube-fill"
                                  className="me-2"
                                />
                                <a
                                  href={contactDetails.socialLinks.youtube}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  YouTube
                                </a>
                              </div>
                            )}
                            {contactDetails.socialLinks.linkedin && (
                              <div className="mb-2">
                                <IconifyIcon
                                  icon="ri:linkedin-fill"
                                  className="me-2"
                                />
                                <a
                                  href={contactDetails.socialLinks.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  LinkedIn
                                </a>
                              </div>
                            )}
                            {contactDetails.socialLinks.instagram && (
                              <div className="mb-2">
                                <IconifyIcon
                                  icon="ri:instagram-fill"
                                  className="me-2"
                                />
                                <a
                                  href={contactDetails.socialLinks.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Instagram
                                </a>
                              </div>
                            )}
                            {!contactDetails.socialLinks.facebook &&
                              !contactDetails.socialLinks.youtube &&
                              !contactDetails.socialLinks.linkedin &&
                              !contactDetails.socialLinks.instagram && (
                                <p className="text-muted">
                                  No social links added
                                </p>
                              )}
                          </div>
                        </div>
                        <div className="position-absolute bottom-0 end-0">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={handleOpenSocialLinksModal}
                          >
                            <IconifyIcon icon="tabler:edit" className="me-1" />
                            Edit
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-muted">No data available</p>
                        <Button size="sm" onClick={handleOpenSocialLinksModal}>
                          Add Information
                        </Button>
                      </div>
                    )}
                  </div>
                </ComponentContainerCard>
              </div>
            </Col>
          </Row>
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
}
