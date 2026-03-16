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
  useGetJobPageQuery,
  useUpdateJobPageHeaderMutation,
  useCreateJobItemMutation,
  useUpdateJobItemMutation,
  useDeleteJobItemMutation,
} from "@/app/redux/api/careers/jobsApi";

import {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useToggleDepartmentStatusMutation,
} from "@/app/redux/api/careers/jobsApi";

import {
  useGetLocationsQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  useToggleLocationStatusMutation,
} from "@/app/redux/api/careers/jobsApi";

import Link from "next/link";

type ModalType = "job" | "department" | "location" | "header" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const JOB_TYPES = ["Full Time", "Part Time", "Contract", "Internship"];
const JOB_STATUSES = ["active", "inactive", "closed"];

const modules = {
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

const JobOpeningsPage = () => {
  // --- Data fetching & mutations ---
  const { data: jobData, isLoading, isError } = useGetJobPageQuery(undefined);
  const { data: departmentsData } = useGetDepartmentsQuery(undefined);
  const { data: locationsData } = useGetLocationsQuery(undefined);

  const [updateJobPageHeader] = useUpdateJobPageHeaderMutation();
  const [createJobItem] = useCreateJobItemMutation();
  const [updateJobItem] = useUpdateJobItemMutation();
  const [deleteJobItem] = useDeleteJobItemMutation();

  const [createDepartment] = useCreateDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();
  const [toggleDepartmentStatus] = useToggleDepartmentStatusMutation();

  const [createLocation] = useCreateLocationMutation();
  const [updateLocation] = useUpdateLocationMutation();
  const [deleteLocation] = useDeleteLocationMutation();
  const [toggleLocationStatus] = useToggleLocationStatusMutation();

  const jobPage = jobData?.data;
  const jobs = jobPage?.jobs || [];
  const departments = departmentsData?.data || [];
  const locations = locationsData?.data || [];

  // --- State ---
  const [activeTab, setActiveTab] = useState("jobs");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Header state
  const [pageTitle, setPageTitle] = useState("");
  const [pageSubtitle, setPageSubtitle] = useState("");

  // Job state
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [jobDepartment, setJobDepartment] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobUrl, setJobUrl] = useState("/careers/careers-details");
  const [jobStatus, setJobStatus] = useState("active");

  // Department state
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [departmentName, setDepartmentName] = useState("");

  // Location state
  const [locationId, setLocationId] = useState<string | null>(null);
  const [locationName, setLocationName] = useState("");

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
    setPageTitle("");
    setPageSubtitle("");
    setJobId(null);
    setJobTitle("");
    setJobDescription("");
    setJobType("Full Time");
    setJobDepartment("");
    setJobLocation("");
    setJobUrl("/careers/careers-details");
    setJobStatus("active");
    setDepartmentId(null);
    setDepartmentName("");
    setLocationId(null);
    setLocationName("");
  };

  // --- Header Modal Handlers ---
  const handleOpenHeaderModal = () => {
    if (jobPage) {
      setPageTitle(jobPage.title || "");
      setPageSubtitle(jobPage.subtitle || "");
    }
    setModalType("header");
  };

  const handleHeaderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageTitle || !pageSubtitle) {
      showAlert("Please fill all fields!", "warning");
      return;
    }

    try {
      await updateJobPageHeader({
        title: pageTitle,
        subtitle: pageSubtitle,
      }).unwrap();
      showAlert("Page header updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    }
  };

  // --- Job Modal Handlers ---
  const handleOpenJobModal = (editMode: boolean, job?: any) => {
    // Check if departments and locations are available
    if (!editMode && (departments.length === 0 || locations.length === 0)) {
      showAlert(
        "Please create at least one department and one location first!",
        "warning",
      );
      return;
    }

    setIsEditMode(editMode);
    if (editMode && job) {
      setJobId(job._id);
      setJobTitle(job.jobTitle);
      setJobDescription(job.jobDescription || "");
      setJobType(job.type);
      // Extract ID properly - handle both populated and non-populated cases
      const deptId =
        typeof job.department === "object" && job.department?._id
          ? job.department._id
          : job.department;
      const locId =
        typeof job.location === "object" && job.location?._id
          ? job.location._id
          : job.location;
      setJobDepartment(deptId || "");
      setJobLocation(locId || "");
      setJobUrl(job.url || "/careers/careers-details");
      setJobStatus(job.status || "active");
    } else {
      setJobId(null);
      setJobTitle("");
      setJobDescription("");
      setJobType("Full Time");
      setJobDepartment("");
      setJobLocation("");
      setJobUrl("/careers/careers-details");
      setJobStatus("active");
    }
    setModalType("job");
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strip HTML tags to check if there's actual content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = jobDescription;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    if (!jobTitle || !textContent.trim() || !jobDepartment || !jobLocation) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    // Validate that department and location are valid MongoDB ObjectIds
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(jobDepartment)) {
      showAlert("Invalid department selected!", "danger");
      console.error("Invalid department ID:", jobDepartment);
      return;
    }

    if (!objectIdPattern.test(jobLocation)) {
      showAlert("Invalid location selected!", "danger");
      console.error("Invalid location ID:", jobLocation);
      return;
    }

    try {
      const jobData = {
        jobTitle,
        jobDescription, // Always send the HTML content from ReactQuill
        type: jobType,
        department: jobDepartment,
        location: jobLocation,
        url: jobUrl,
        status: jobStatus,
      };

      if (isEditMode && jobId) {
        await updateJobItem({ jobId, data: jobData }).unwrap();
        showAlert("Job updated successfully!", "success");
      } else {
        await createJobItem(jobData).unwrap();
        showAlert("Job created successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("Error:", err);
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJobItem(id).unwrap();
      showAlert("Job deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  // --- Department Modal Handlers ---
  const handleOpenDepartmentModal = (editMode: boolean, department?: any) => {
    setIsEditMode(editMode);
    if (editMode && department) {
      setDepartmentId(department._id);
      setDepartmentName(department.name);
    } else {
      setDepartmentId(null);
      setDepartmentName("");
    }
    setModalType("department");
  };

  const handleDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!departmentName) {
      showAlert("Please enter department name!", "warning");
      return;
    }

    try {
      if (isEditMode && departmentId) {
        await updateDepartment({
          id: departmentId,
          data: { name: departmentName },
        }).unwrap();
        showAlert("Department updated successfully!", "success");
      } else {
        await createDepartment({ name: departmentName }).unwrap();
        showAlert("Department created successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("Error:", err);
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      await deleteDepartment(id).unwrap();
      showAlert("Department deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const handleToggleDepartmentStatus = async (id: string) => {
    try {
      await toggleDepartmentStatus(id).unwrap();
      showAlert("Department status toggled successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Status toggle failed!", "danger");
    }
  };

  // --- Location Modal Handlers ---
  const handleOpenLocationModal = (editMode: boolean, location?: any) => {
    setIsEditMode(editMode);
    if (editMode && location) {
      setLocationId(location._id);
      setLocationName(location.name);
    } else {
      setLocationId(null);
      setLocationName("");
    }
    setModalType("location");
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationName) {
      showAlert("Please enter location name!", "warning");
      return;
    }

    try {
      if (isEditMode && locationId) {
        await updateLocation({
          id: locationId,
          data: { name: locationName },
        }).unwrap();
        showAlert("Location updated successfully!", "success");
      } else {
        await createLocation({ name: locationName }).unwrap();
        showAlert("Location created successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("Error:", err);
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    try {
      await deleteLocation(id).unwrap();
      showAlert("Location deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const handleToggleLocationStatus = async (id: string) => {
    try {
      await toggleLocationStatus(id).unwrap();
      showAlert("Location status toggled successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Status toggle failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "header") return "Update Page Header";
    if (modalType === "job") return isEditMode ? "Edit Job" : "Add Job";
    if (modalType === "department")
      return isEditMode ? "Edit Department" : "Add Department";
    if (modalType === "location")
      return isEditMode ? "Edit Location" : "Add Location";
    return "";
  };

  const renderModalContent = () => {
    if (modalType === "header") {
      return (
        <Form onSubmit={handleHeaderSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              placeholder="Enter page title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subtitle *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={pageSubtitle}
              onChange={(e) => setPageSubtitle(e.target.value)}
              placeholder="Enter page subtitle"
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </div>
        </Form>
      );
    }

    if (modalType === "job") {
      return (
        <Form onSubmit={handleJobSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Job Title *</Form.Label>
            <Form.Control
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter job title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Job Description *</Form.Label>
            <div style={{ height: "250px" }}>
              <ReactQuill
                theme="snow"
                value={jobDescription}
                onChange={setJobDescription}
                modules={modules}
                placeholder="Enter job description..."
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </div>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Department *</Form.Label>
                <Form.Select
                  value={jobDepartment}
                  onChange={(e) => setJobDepartment(e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept: any) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Job Type *</Form.Label>
                <Form.Select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  required
                >
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location *</Form.Label>
                <Form.Select
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  required
                >
                  <option value="">Select Location</option>
                  {locations.map((loc: any) => (
                    <option key={loc._id} value={loc._id}>
                      {loc.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status *</Form.Label>
                <Form.Select
                  value={jobStatus}
                  onChange={(e) => setJobStatus(e.target.value)}
                  required
                >
                  {JOB_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="text"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="/careers/careers-details"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEditMode ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      );
    }

    if (modalType === "department") {
      return (
        <Form onSubmit={handleDepartmentSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Department Name *</Form.Label>
            <Form.Control
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="Enter department name"
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEditMode ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      );
    }

    if (modalType === "location") {
      return (
        <Form onSubmit={handleLocationSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Location Name *</Form.Label>
            <Form.Control
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Enter location name"
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEditMode ? "Update" : "Create"}
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
            <strong>Error!</strong> Failed to load job openings. Please try
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
            title="Job Openings Management"
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
            title="Job Openings"
            description="Manage job openings, departments, and locations."
          >
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || "jobs")}
              className="mb-3"
            >
              {/* JOBS TAB */}
              <Tab eventKey="jobs" title="Jobs">
                {/* Page Header Section */}
                <div className="mb-4 p-3 bg-light rounded">
                  <h4>{jobPage?.title || "Current Openings"}</h4>
                  <p className="text-muted mb-3">
                    {jobPage?.subtitle ||
                      "We're currently looking to fill the following roles on our team."}
                  </p>
                  <div className="d-flex justify-content-end">
                    <Button onClick={handleOpenHeaderModal}>
                      <IconifyIcon icon="tabler:edit" className="me-1" />
                      Update Header
                    </Button>
                  </div>
                </div>

                {/* Jobs Table */}
                <div className="mb-3">
                  <Button onClick={() => handleOpenJobModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Job
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Job Title</th>
                        <th>Department</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            <p className="text-muted mb-0">No jobs found!</p>
                          </td>
                        </tr>
                      ) : (
                        jobs.map((job: any, index: number) => (
                          <tr key={job._id || index}>
                            <td>{index + 1}</td>
                            <td>{job.jobTitle}</td>
                            <td>{job.department?.name || "N/A"}</td>
                            <td>{job.type}</td>
                            <td>{job.location?.name || "N/A"}</td>
                            <td>
                              <span
                                className={`badge ${
                                  job.status === "active"
                                    ? "bg-success"
                                    : job.status === "inactive"
                                      ? "bg-warning"
                                      : "bg-danger"
                                }`}
                              >
                                {job.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenJobModal(true, job);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteJob(job._id);
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
              </Tab>

              {/* DEPARTMENTS TAB */}
              <Tab eventKey="departments" title="Departments">
                <div className="mb-3">
                  <Button onClick={() => handleOpenDepartmentModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Department
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-4">
                            <p className="text-muted mb-0">
                              No departments found!
                            </p>
                          </td>
                        </tr>
                      ) : (
                        departments.map((dept: any, index: number) => (
                          <tr key={dept._id || index}>
                            <td>{index + 1}</td>
                            <td>{dept.name}</td>
                            <td>
                              <span
                                className={`badge ${
                                  dept.isActive ? "bg-success" : "bg-danger"
                                }`}
                              >
                                {dept.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleToggleDepartmentStatus(dept._id);
                                }}
                                className="link-reset fs-20 p-1"
                                title="Toggle Status"
                              >
                                <IconifyIcon icon="tabler:power" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenDepartmentModal(true, dept);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteDepartment(dept._id);
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
              </Tab>

              {/* LOCATIONS TAB */}
              <Tab eventKey="locations" title="Locations">
                <div className="mb-3">
                  <Button onClick={() => handleOpenLocationModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Location
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locations.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-4">
                            <p className="text-muted mb-0">
                              No locations found!
                            </p>
                          </td>
                        </tr>
                      ) : (
                        locations.map((loc: any, index: number) => (
                          <tr key={loc._id || index}>
                            <td>{index + 1}</td>
                            <td>{loc.name}</td>
                            <td>
                              <span
                                className={`badge ${
                                  loc.isActive ? "bg-success" : "bg-danger"
                                }`}
                              >
                                {loc.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleToggleLocationStatus(loc._id);
                                }}
                                className="link-reset fs-20 p-1"
                                title="Toggle Status"
                              >
                                <IconifyIcon icon="tabler:power" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenLocationModal(true, loc);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteLocation(loc._id);
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
              </Tab>
            </Tabs>
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

export default JobOpeningsPage;
