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
import {
  useGetBrandsSectionQuery,
  useUpdateBrandsSectionHeadingMutation,
  useCreateBrandMutation,
  useGetAllBrandsQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useCreateIndustryMutation,
  useGetAllIndustriesQuery,
  useUpdateIndustryMutation,
  useDeleteIndustryMutation,
} from "@/app/redux/api/corporate-travel/brandsApi";
import { FileUploader } from "@/components/FileUploader";
import Link from "next/link";

type ModalType = "heading" | "brand" | "industry" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const BrandsSectionPage = () => {
  // --- Data fetching & mutations ---
  const { data: sectionData, isLoading, isError } = useGetBrandsSectionQuery();
  const { data: brandsData } = useGetAllBrandsQuery();
  const { data: industriesData } = useGetAllIndustriesQuery();

  const [updateHeading, { isLoading: isUpdatingHeading }] =
    useUpdateBrandsSectionHeadingMutation();

  const [createBrand, { isLoading: isCreatingBrand }] =
    useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdatingBrand }] =
    useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const [createIndustry, { isLoading: isCreatingIndustry }] =
    useCreateIndustryMutation();
  const [updateIndustry, { isLoading: isUpdatingIndustry }] =
    useUpdateIndustryMutation();
  const [deleteIndustry] = useDeleteIndustryMutation();

  const section = sectionData?.data;
  const brands = brandsData?.data || [];
  const industries = industriesData?.data || [];

  // --- State ---
  const [activeTab, setActiveTab] = useState("brands");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Heading state
  const [heading, setHeading] = useState("");
  const [headingIsActive, setHeadingIsActive] = useState(true);

  // Brand state
  const [brandId, setBrandId] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("");
  const [brandIndustry, setBrandIndustry] = useState("");
  const [brandIsActive, setBrandIsActive] = useState(true);

  // Industry state
  const [industryId, setIndustryId] = useState<string | null>(null);
  const [industryIsActive, setIndustryIsActive] = useState(true);
  const [industryImage, setIndustryImage] = useState<File | null>(null);
  const [industryImagePreview, setIndustryImagePreview] = useState<string>("");

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
    setHeading("");
    setHeadingIsActive(true);
    setBrandId(null);
    setBrandName("");
    setBrandIndustry("");
    setBrandIsActive(true);
    setIndustryId(null);
    setIndustryIsActive(true);
    setIndustryImage(null);
    setIndustryImagePreview("");
  };

  const handleIndustryImageChange = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showAlert("Image size should not exceed 5MB!", "warning");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showAlert("Please upload a valid image file!", "warning");
      return;
    }

    setIndustryImage(file);
    setIndustryImagePreview(URL.createObjectURL(file));
  };

  // --- Heading Modal Handlers ---
  const handleOpenHeadingModal = () => {
    if (section) {
      setHeading(section.heading || "");
      setHeadingIsActive(section.isActive ?? true);
    }
    setModalType("heading");
  };

  const handleHeadingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!heading.trim()) {
      showAlert("Heading is required!", "warning");
      return;
    }

    try {
      await updateHeading({
        heading: heading.trim(),
      }).unwrap();
      showAlert("Heading updated successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      showAlert(err?.data?.message || "Update failed!", "danger");
    }
  };

  // --- Brand Modal Handlers ---
  const handleOpenBrandModal = (editMode: boolean, brand?: any) => {
    setIsEditMode(editMode);
    if (editMode && brand) {
      setBrandId(brand._id);
      setBrandName(brand.name);
      setBrandIndustry(brand.industry);
      setBrandIsActive(brand.isActive ?? true);
    } else {
      setBrandId(null);
      setBrandName("");
      setBrandIndustry("");
      setBrandIsActive(true);
    }
    setModalType("brand");
  };

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!brandName.trim()) {
      showAlert("Brand name is required!", "warning");
      return;
    }

    if (!brandIndustry.trim()) {
      showAlert("Industry is required!", "warning");
      return;
    }

    try {
      const brandData = {
        name: brandName.trim(),
        industry: brandIndustry.trim(),
        isActive: brandIsActive,
      };

      if (isEditMode && brandId) {
        await updateBrand({ id: brandId, ...brandData }).unwrap();
        showAlert("Brand updated successfully!", "success");
      } else {
        await createBrand(brandData).unwrap();
        showAlert("Brand created successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      await deleteBrand({ id }).unwrap();
      showAlert("Brand deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  // --- Industry Modal Handlers ---
  const handleOpenIndustryModal = (editMode: boolean, industry?: any) => {
    setIsEditMode(editMode);
    if (editMode && industry) {
      setIndustryId(industry._id);
      setIndustryIsActive(industry.isActive ?? true);
      setIndustryImagePreview(industry.image || "");
    } else {
      setIndustryId(null);
      setIndustryIsActive(true);
      setIndustryImage(null);
      setIndustryImagePreview("");
    }
    setModalType("industry");
  };

  const handleIndustrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditMode && !industryImage) {
      showAlert("Please upload an industry image!", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("isActive", industryIsActive.toString());

      if (industryImage) {
        formData.append("image", industryImage);
      }

      if (isEditMode && industryId) {
        await updateIndustry({ id: industryId, formData }).unwrap();
        showAlert("Industry updated successfully!", "success");
      } else {
        await createIndustry(formData).unwrap();
        showAlert("Industry created successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    }
  };

  const handleDeleteIndustry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this industry?")) return;
    try {
      await deleteIndustry({ id }).unwrap();
      showAlert("Industry deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "heading") return "Update Section Heading";
    if (modalType === "brand") return isEditMode ? "Edit Brand" : "Add Brand";
    if (modalType === "industry")
      return isEditMode ? "Edit Industry" : "Add Industry";
    return "";
  };

  const renderModalContent = () => {
    if (modalType === "heading") {
      return (
        <Form onSubmit={handleHeadingSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Heading <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter section heading"
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isUpdatingHeading}
            >
              {isUpdatingHeading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
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

    if (modalType === "brand") {
      return (
        <Form onSubmit={handleBrandSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Brand Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter brand name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Industry <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={brandIndustry}
              onChange={(e) => setBrandIndustry(e.target.value)}
              placeholder="Enter industry"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Status <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={brandIsActive ? "true" : "false"}
              onChange={(e) => setBrandIsActive(e.target.value === "true")}
              required
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isCreatingBrand || isUpdatingBrand}
            >
              {isCreatingBrand || isUpdatingBrand ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditMode ? "Update" : "Create"}</>
              )}
            </Button>
          </div>
        </Form>
      );
    }

    if (modalType === "industry") {
      return (
        <Form onSubmit={handleIndustrySubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Status <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={industryIsActive ? "true" : "false"}
              onChange={(e) => setIndustryIsActive(e.target.value === "true")}
              required
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Industry Image{" "}
              {!isEditMode && <span className="text-danger">*</span>}
            </Form.Label>

            {industryImagePreview && (
              <div className="mb-3">
                <Alert variant="info" className="d-flex align-items-center">
                  <IconifyIcon
                    icon="solar:info-circle-bold-duotone"
                    className="fs-20 me-2"
                  />
                  <div className="lh-1">
                    {industryImage ? "New image preview:" : "Current image:"}
                  </div>
                </Alert>
                <img
                  src={industryImagePreview}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{
                    maxHeight: "200px",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            {!industryImagePreview && (
              <FileUploader
                onFileUpload={handleIndustryImageChange}
                icon="ri:upload-cloud-2-line"
                text="Drop image here or click to upload."
                extraText="(Maximum file size: 5MB. Supported formats: JPG, PNG, WebP)"
              />
            )}
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isCreatingIndustry || isUpdatingIndustry}
            >
              {isCreatingIndustry || isUpdatingIndustry ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditMode ? "Update" : "Create"}</>
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
            <strong>Error!</strong> Failed to load brands section. Please try
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
            title="Brands Section Management"
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
            title="Brands & Industries"
            description="Manage brands, industries, and section heading."
          >
            {/* Section Heading */}
            <div className="mb-4 p-3 bg-light rounded">
              <h5>Section Heading</h5>
              <p className="text-muted mb-3">
                {section?.heading || "No heading set"}
              </p>
              <div className="d-flex justify-content-end">
                <Button onClick={handleOpenHeadingModal}>
                  <IconifyIcon icon="tabler:edit" className="me-1" />
                  Update Heading
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || "brands")}
              className="mb-3"
            >
              {/* BRANDS TAB */}
              <Tab eventKey="brands" title="Brands">
                <div className="mb-3">
                  <Button onClick={() => handleOpenBrandModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Brand
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Industry</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brands.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            <p className="text-muted mb-0">No brands found!</p>
                          </td>
                        </tr>
                      ) : (
                        brands.map((brand: any, index: number) => (
                          <tr key={brand._id || index}>
                            <td>{index + 1}</td>
                            <td>{brand.name}</td>
                            <td>{brand.industry}</td>
                            <td>
                              <span
                                className={`badge ${
                                  brand.isActive ? "bg-success" : "bg-danger"
                                }`}
                              >
                                {brand.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenBrandModal(true, brand);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteBrand(brand._id);
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

              {/* INDUSTRIES TAB */}
              <Tab eventKey="industries" title="Industries">
                <div className="mb-3">
                  <Button onClick={() => handleOpenIndustryModal(false)}>
                    <IconifyIcon icon="tabler:plus" className="me-1" />
                    Add Industry
                  </Button>
                </div>

                <div className="table-responsive-sm">
                  <table className="table table-striped-columns mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {industries.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-4">
                            <p className="text-muted mb-0">
                              No industries found!
                            </p>
                          </td>
                        </tr>
                      ) : (
                        industries.map((industry: any, index: number) => (
                          <tr key={industry._id || index}>
                            <td>{index + 1}</td>
                            <td>
                              <img
                                src={industry.image}
                                alt="Industry"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  industry.isActive ? "bg-success" : "bg-danger"
                                }`}
                              >
                                {industry.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="text-center">
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenIndustryModal(true, industry);
                                }}
                                className="link-reset fs-20 p-1"
                              >
                                <IconifyIcon icon="tabler:pencil" />
                              </Link>
                              <Link
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteIndustry(industry._id);
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

export default BrandsSectionPage;
