"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetAllOfficesQuery,
  useCreateOfficeMutation,
  useUpdateOfficeMutation,
  useDeleteOfficeMutation,
  useAddHolidayMutation,
  useRemoveHolidayMutation,
} from "@/app/redux/api/contactOffice/contactOfficeApi";

import Link from "next/link";

type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

type OfficeTime = {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
};

type Holiday = {
  date: string;
  description: string;
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

const defaultOfficeTimes: OfficeTime[] = [
  { day: "monday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "tuesday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "wednesday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "thursday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "friday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "saturday", isOpen: false, openTime: "", closeTime: "" },
  { day: "sunday", isOpen: false, openTime: "", closeTime: "" },
];

const OfficesPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetAllOfficesQuery(undefined);
  const [createOffice, { isLoading: isCreating }] = useCreateOfficeMutation();
  const [updateOffice, { isLoading: isUpdating }] = useUpdateOfficeMutation();
  const [deleteOffice] = useDeleteOfficeMutation();
  const [addHoliday] = useAddHolidayMutation();
  const [removeHoliday] = useRemoveHolidayMutation();

  const offices = data?.data || [];

  // --- State ---
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Office state
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [status, setStatus] = useState("active");
  const [forex, setForex] = useState(false);
  const [officeTimes, setOfficeTimes] =
    useState<OfficeTime[]>(defaultOfficeTimes);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [editingOfficeId, setEditingOfficeId] = useState<string | null>(null);

  // Holiday form state
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [newHolidayDescription, setNewHolidayDescription] = useState("");

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
    setActiveTab("basic");
    setCity("");
    setAddress("");
    setPhone("");
    setEmail("");
    setMapUrl("");
    setStatus("active");
    setForex(false);
    setOfficeTimes(defaultOfficeTimes);
    setHolidays([]);
    setEditingOfficeId(null);
    setNewHolidayDate("");
    setNewHolidayDescription("");
  };

  // --- Office Modal Handlers ---
  const handleOpenModal = (editMode: boolean, office?: any) => {
    setIsEditMode(editMode);
    if (editMode && office) {
      setCity(office.city);
      setAddress(office.address);
      setPhone(office.phone);
      setEmail(office.email || "");
      setMapUrl(office.mapUrl || "");
      setStatus(office.status || "active");
      setForex(office.forex === true);
      setOfficeTimes(office.officeTimes || defaultOfficeTimes);
      setHolidays(office.holidays || []);
      setEditingOfficeId(office._id);
    } else {
      setCity("");
      setAddress("");
      setPhone("");
      setEmail("");
      setMapUrl("");
      setStatus("active");
      setForex(false);
      setOfficeTimes(defaultOfficeTimes);
      setHolidays([]);
      setEditingOfficeId(null);
    }
    setShowModal(true);
  };

  const handleOfficeTimeChange = (
    index: number,
    field: keyof OfficeTime,
    value: any,
  ) => {
    const newOfficeTimes = [...officeTimes];
    newOfficeTimes[index] = { ...newOfficeTimes[index], [field]: value };
    setOfficeTimes(newOfficeTimes);
  };

  const handleAddHoliday = () => {
    if (!newHolidayDate || !newHolidayDescription) {
      showAlert("Please fill holiday date and description!", "warning");
      return;
    }

    setHolidays([
      ...holidays,
      { date: newHolidayDate, description: newHolidayDescription },
    ]);
    setNewHolidayDate("");
    setNewHolidayDescription("");
  };

  const handleRemoveHoliday = (index: number) => {
    const newHolidays = holidays.filter((_, i) => i !== index);
    setHolidays(newHolidays);
  };

  const handleOfficeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!city || !address || !phone || !email) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    // Validate office times
    for (const time of officeTimes) {
      if (time.isOpen && (!time.openTime || !time.closeTime)) {
        showAlert(
          `Please set opening and closing time for ${time.day}!`,
          "warning",
        );
        return;
      }
    }

    try {
      const payload = {
        city,
        address,
        phone,
        email,
        mapUrl: mapUrl || undefined,
        status,
        forex,
        officeTimes,
        holidays,
      };

      if (isEditMode && editingOfficeId) {
        await updateOffice({ id: editingOfficeId, ...payload }).unwrap();
        showAlert("Office updated successfully!", "success");
      } else {
        await createOffice(payload).unwrap();
        showAlert("Office added successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    }
  };

  const handleDeleteOffice = async (officeId: string) => {
    if (!confirm("Are you sure you want to delete this office?")) return;
    try {
      await deleteOffice(officeId).unwrap();
      showAlert("Office deleted successfully!", "success");
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
            <strong>Error!</strong> Failed to load offices. Please try again
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
          <PageTitle title="Offices Management" subTitle="Content Management" />

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
            title="Offices"
            description="Manage your office locations and details."
          >
            <div className="mb-3">
              <Button onClick={() => handleOpenModal(false)}>
                <IconifyIcon icon="tabler:plus" className="me-1" />
                Add Office
              </Button>
            </div>

            <div className="table-responsive-sm">
              <table className="table table-striped-columns mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>City</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Forex</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {offices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4">
                        <p className="text-muted mb-0">No offices found!</p>
                      </td>
                    </tr>
                  ) : (
                    offices.map((office: any, index: number) => (
                      <tr key={office._id || index}>
                        <td>{index + 1}</td>
                        <td>{office.city}</td>
                        <td>{office.email}</td>
                        <td>{office.phone}</td>
                        <td>
                          <span
                            className={`badge ${
                              office.forex ? "bg-success" : "bg-secondary"
                            }`}
                          >
                            {office.forex ? "Yes" : "No"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              office.status === "Active" ||
                              office.status === "active"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {office.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenModal(true, office);
                            }}
                            className="link-reset fs-20 p-1"
                          >
                            <IconifyIcon icon="tabler:pencil" />
                          </Link>
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteOffice(office._id);
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
          <Modal.Title>{isEditMode ? "Edit Office" : "Add Office"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleOfficeSubmit}>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || "basic")}
              className="mb-3"
            >
              <Tab eventKey="basic" title="Basic Info">
                <Form.Group className="mb-3">
                  <Form.Label>City *</Form.Label>
                  <Form.Control
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number (e.g., +1234567890 or 1234567890)"
                    required
                  />
                  <Form.Text className="text-muted">
                    Enter numbers only, optionally starting with +
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address *</Form.Label>
                  <div style={{ height: "250px" }}>
                    <ReactQuill
                      theme="snow"
                      value={address}
                      onChange={setAddress}
                      modules={quillModules}
                      placeholder="Enter office address..."
                      style={{ height: "200px", marginBottom: "50px" }}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Map URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={mapUrl}
                    onChange={(e) => setMapUrl(e.target.value)}
                    placeholder="Enter Google Maps URL or location URL"
                  />
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

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Forex Available"
                    checked={forex}
                    onChange={(e) => setForex(e.target.checked)}
                  />
                </Form.Group>
              </Tab>

              <Tab eventKey="times" title="Office Hours">
                <div className="mb-3">
                  <p className="text-muted">
                    Set office hours for each day of the week
                  </p>
                </div>
                {officeTimes.map((time, index) => (
                  <div key={time.day} className="mb-3 p-3 border rounded">
                    <Row className="align-items-center">
                      <Col md={3}>
                        <Form.Check
                          type="checkbox"
                          label={
                            time.day.charAt(0).toUpperCase() + time.day.slice(1)
                          }
                          checked={time.isOpen}
                          onChange={(e) =>
                            handleOfficeTimeChange(
                              index,
                              "isOpen",
                              e.target.checked,
                            )
                          }
                        />
                      </Col>
                      {time.isOpen && (
                        <>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label className="small">
                                Open Time
                              </Form.Label>
                              <Form.Control
                                type="time"
                                value={time.openTime || ""}
                                onChange={(e) =>
                                  handleOfficeTimeChange(
                                    index,
                                    "openTime",
                                    e.target.value,
                                  )
                                }
                                required={time.isOpen}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label className="small">
                                Close Time
                              </Form.Label>
                              <Form.Control
                                type="time"
                                value={time.closeTime || ""}
                                onChange={(e) =>
                                  handleOfficeTimeChange(
                                    index,
                                    "closeTime",
                                    e.target.value,
                                  )
                                }
                                required={time.isOpen}
                              />
                            </Form.Group>
                          </Col>
                        </>
                      )}
                    </Row>
                  </div>
                ))}
              </Tab>

              <Tab eventKey="holidays" title="Holidays">
                <div className="mb-3">
                  <p className="text-muted">
                    Add holidays when office will be closed
                  </p>
                </div>

                <div className="mb-3 p-3 border rounded">
                  <Row>
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={newHolidayDate}
                          onChange={(e) => setNewHolidayDate(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          value={newHolidayDescription}
                          onChange={(e) =>
                            setNewHolidayDescription(e.target.value)
                          }
                          placeholder="e.g., Christmas"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <Button
                        variant="primary"
                        onClick={handleAddHoliday}
                        className="w-100"
                      >
                        <IconifyIcon icon="tabler:plus" />
                      </Button>
                    </Col>
                  </Row>
                </div>

                {holidays.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Description</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {holidays.map((holiday, index) => (
                          <tr key={index}>
                            <td>
                              {new Date(holiday.date).toLocaleDateString()}
                            </td>
                            <td>{holiday.description}</td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveHoliday(index);
                                }}
                                className="link-reset text-danger"
                              >
                                <IconifyIcon icon="tabler:trash" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {holidays.length === 0 && (
                  <p className="text-muted text-center py-3">
                    No holidays added yet
                  </p>
                )}
              </Tab>
            </Tabs>

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

export default OfficesPage;
