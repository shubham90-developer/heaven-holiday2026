"use client";

import React, { useState, useEffect } from "react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "@/app/redux/api/settings/settingsApi";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Row, Col, Alert } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { FileUploader } from "@/components/FileUploader";

const GeneralSettingsForm: React.FC = () => {
  const { data: settingsData, isLoading } = useGetSettingsQuery(undefined);
  const [updateSettings, { isLoading: isUpdating, isSuccess, isError }] =
    useUpdateSettingsMutation();

  const [formData, setFormData] = useState({
    // Brand
    companyName: "",
    copyrightText: "",

    // Phones
    tollFree1: "",
    tollFree2: "",
    callUs1: "",
    callUs2: "",
    nriWithinIndia: "",
    nriOutsideIndia: "",

    // Contact & Hours
    supportEmail: "",
    businessHoursFrom: "",
    businessHoursTo: "",

    // Caution
    cautionEnabled: false,
    cautionText: "",

    // Travel Planner
    travelPlannerEnabled: true,
    travelPlannerLabel: "",
    travelPlannerLink: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [paymentGatewaysFile, setPaymentGatewaysFile] = useState<File | null>(
    null,
  ); // ADD
  const [logoPreview, setLogoPreview] = useState("");
  const [faviconPreview, setFaviconPreview] = useState("");
  const [paymentGatewaysPreview, setPaymentGatewaysPreview] = useState(""); // ADD

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    if (settingsData?.data) {
      const d = settingsData.data;
      setFormData({
        companyName: d.companyName ?? "",
        copyrightText: d.copyrightText ?? "",
        tollFree1: d.tollFree1 ?? "",
        tollFree2: d.tollFree2 ?? "",
        callUs1: d.callUs1 ?? "",
        callUs2: d.callUs2 ?? "",
        nriWithinIndia: d.nriWithinIndia ?? "",
        nriOutsideIndia: d.nriOutsideIndia ?? "",
        supportEmail: d.supportEmail ?? "",
        businessHoursFrom: d.businessHoursFrom ?? "",
        businessHoursTo: d.businessHoursTo ?? "",
        cautionEnabled: d.cautionEnabled ?? false,
        cautionText: d.cautionText ?? "",
        travelPlannerEnabled: d.travelPlannerEnabled ?? true,
        travelPlannerLabel: d.travelPlannerLabel ?? "",
        travelPlannerLink: d.travelPlannerLink ?? "",
      });
      setLogoPreview(d.companyLogo ?? "");
      setFaviconPreview(d.favicon ?? "");
      setPaymentGatewaysPreview(d.paymentGateways ?? ""); // ADD
    }
  }, [settingsData]);

  useEffect(() => {
    if (isSuccess) {
      setLogoFile(null);
      setFaviconFile(null);
      setPaymentGatewaysFile(null); // ADD
      setShowSuccessAlert(true);
      const t = setTimeout(() => setShowSuccessAlert(false), 5000);
      return () => clearTimeout(t);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setShowErrorAlert(true);
      const t = setTimeout(() => setShowErrorAlert(false), 5000);
      return () => clearTimeout(t);
    }
  }, [isError]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleLogoChange = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleFaviconChange = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setFaviconFile(file);
    setFaviconPreview(URL.createObjectURL(file));
  };

  // ADD: Payment Gateways handler
  const handlePaymentGatewaysChange = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setPaymentGatewaysFile(file);
    setPaymentGatewaysPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = new FormData();

    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, String(value));
    });

    // Append images only if a new file was selected
    if (logoFile) submitData.append("companyLogo", logoFile);
    if (faviconFile) submitData.append("favicon", faviconFile);
    if (paymentGatewaysFile)
      submitData.append("paymentGateways", paymentGatewaysFile); // ADD

    try {
      await updateSettings(submitData).unwrap();
    } catch (err) {
      console.error("Failed to update settings:", err);
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

  return (
    <>
      <PageTitle title="General Settings" subTitle="Settings" />

      {/* ── Alerts ── */}
      {showSuccessAlert && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setShowSuccessAlert(false)}
          className="d-flex align-items-center"
        >
          <IconifyIcon
            icon="solar:check-read-line-duotone"
            className="fs-20 me-2"
          />
          <div className="lh-1">
            <strong>Success!</strong> Settings updated successfully.
          </div>
        </Alert>
      )}

      {showErrorAlert && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setShowErrorAlert(false)}
          className="d-flex align-items-center"
        >
          <IconifyIcon
            icon="solar:danger-triangle-bold-duotone"
            className="fs-20 me-2"
          />
          <div className="lh-1">
            <strong>Error!</strong> Failed to update settings. Please try again.
          </div>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12}>
            <ComponentContainerCard
              title="Brand Identity"
              description="Company name, logo, favicon and copyright."
            >
              <Row className="gy-3">
                <Col lg={6}>
                  <label htmlFor="companyName" className="form-label">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Heaven Holiday"
                  />
                </Col>

                <Col lg={6}>
                  <label htmlFor="copyrightText" className="form-label">
                    Copyright Text
                  </label>
                  <input
                    type="text"
                    id="copyrightText"
                    name="copyrightText"
                    value={formData.copyrightText}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="© 2025 Heaven Holiday. All rights reserved."
                  />
                </Col>

                {/* Company Logo */}
                <Col lg={6}>
                  <label className="form-label">Company Logo</label>
                  {logoPreview && (
                    <div className="mb-2">
                      <Alert
                        variant="info"
                        className="d-flex align-items-center py-2"
                      >
                        <IconifyIcon
                          icon="solar:info-circle-bold-duotone"
                          className="fs-20 me-2"
                        />
                        <div className="lh-1">
                          {logoFile ? "New logo preview:" : "Current logo:"}
                        </div>
                      </Alert>
                      <img
                        src={logoPreview}
                        alt="Company Logo"
                        className="img-fluid rounded border"
                        style={{ maxHeight: "100px", objectFit: "contain" }}
                      />
                    </div>
                  )}
                  <FileUploader
                    onFileUpload={handleLogoChange}
                    icon="ri:upload-cloud-2-line"
                    text="Drop logo here or click to upload."
                    extraText="(PNG, JPG, SVG recommended)"
                  />
                </Col>

                {/* Favicon */}
                <Col lg={6}>
                  <label className="form-label">Favicon</label>
                  {faviconPreview && (
                    <div className="mb-2">
                      <Alert
                        variant="info"
                        className="d-flex align-items-center py-2"
                      >
                        <IconifyIcon
                          icon="solar:info-circle-bold-duotone"
                          className="fs-20 me-2"
                        />
                        <div className="lh-1">
                          {faviconFile
                            ? "New favicon preview:"
                            : "Current favicon:"}
                        </div>
                      </Alert>
                      <img
                        src={faviconPreview}
                        alt="Favicon"
                        className="rounded border"
                        style={{ width: 48, height: 48, objectFit: "contain" }}
                      />
                    </div>
                  )}
                  <FileUploader
                    onFileUpload={handleFaviconChange}
                    icon="ri:upload-cloud-2-line"
                    text="Drop favicon here or click to upload."
                    extraText="(16×16 or 32×32 .ico / .png)"
                  />
                </Col>

                {/* ADD: Payment Gateways Image */}
                <Col lg={6}>
                  <label className="form-label">Payment Gateways Image</label>
                  {paymentGatewaysPreview && (
                    <div className="mb-2">
                      <Alert
                        variant="info"
                        className="d-flex align-items-center py-2"
                      >
                        <IconifyIcon
                          icon="solar:info-circle-bold-duotone"
                          className="fs-20 me-2"
                        />
                        <div className="lh-1">
                          {paymentGatewaysFile
                            ? "New payment gateways image preview:"
                            : "Current payment gateways image:"}
                        </div>
                      </Alert>
                      <img
                        src={paymentGatewaysPreview}
                        alt="Payment Gateways"
                        className="img-fluid rounded border"
                        style={{ maxHeight: "100px", objectFit: "contain" }}
                      />
                    </div>
                  )}
                  <FileUploader
                    onFileUpload={handlePaymentGatewaysChange}
                    icon="ri:upload-cloud-2-line"
                    text="Drop payment gateways image here or click to upload."
                    extraText="(PNG, JPG recommended)"
                  />
                </Col>
              </Row>
            </ComponentContainerCard>
          </Col>
        </Row>

        {/* ══════════════ 2. Phone Numbers ══════════════ */}
        <Row className="mt-3">
          <Col xs={12}>
            <ComponentContainerCard
              title="Phone Numbers"
              description="Toll-free, direct lines and NRI contact numbers."
            >
              <Row className="gy-3">
                <Col lg={6}>
                  <label htmlFor="tollFree1" className="form-label">
                    Toll Free — Line 1
                  </label>
                  <input
                    type="text"
                    id="tollFree1"
                    name="tollFree1"
                    value={formData.tollFree1}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="1800 22 7979"
                  />
                </Col>

                <Col lg={6}>
                  <label htmlFor="tollFree2" className="form-label">
                    Toll Free — Line 2
                  </label>
                  <input
                    type="text"
                    id="tollFree2"
                    name="tollFree2"
                    value={formData.tollFree2}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="1800 313 5555"
                  />
                </Col>

                <Col lg={6}>
                  <label htmlFor="callUs1" className="form-label">
                    Direct Number — Line 1
                  </label>
                  <input
                    type="text"
                    id="callUs1"
                    name="callUs1"
                    value={formData.callUs1}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="+91 22 2101 7979"
                  />
                </Col>

                <Col lg={6}>
                  <label htmlFor="callUs2" className="form-label">
                    Direct Number — Line 2
                  </label>
                  <input
                    type="text"
                    id="callUs2"
                    name="callUs2"
                    value={formData.callUs2}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="+91 22 2101 6969"
                  />
                </Col>

                <Col lg={6}>
                  <label htmlFor="nriWithinIndia" className="form-label">
                    NRI / Foreign — Within India
                  </label>
                  <input
                    type="text"
                    id="nriWithinIndia"
                    name="nriWithinIndia"
                    value={formData.nriWithinIndia}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="+91 915 200 4511"
                  />
                </Col>

                <Col lg={6}>
                  <label htmlFor="nriOutsideIndia" className="form-label">
                    NRI / Foreign — Outside India
                  </label>
                  <input
                    type="text"
                    id="nriOutsideIndia"
                    name="nriOutsideIndia"
                    value={formData.nriOutsideIndia}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="+91 887 997 2221"
                  />
                </Col>
              </Row>
            </ComponentContainerCard>
          </Col>
        </Row>

        {/* ══════════════ 3. Contact & Hours ══════════════ */}
        <Row className="mt-3">
          <Col xs={12}>
            <ComponentContainerCard
              title="Contact & Business Hours"
              description="Support email and office hours shown in the phone dropdown."
            >
              <Row className="gy-3">
                <Col lg={4}>
                  <label htmlFor="supportEmail" className="form-label">
                    Support Email
                  </label>
                  <input
                    type="email"
                    id="supportEmail"
                    name="supportEmail"
                    value={formData.supportEmail}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="travel@heavenholiday.com"
                  />
                </Col>

                <Col lg={4}>
                  <label htmlFor="businessHoursFrom" className="form-label">
                    Business Hours — From
                  </label>
                  <input
                    type="time"
                    id="businessHoursFrom"
                    name="businessHoursFrom"
                    value={formData.businessHoursFrom}
                    onChange={handleChange}
                    className="form-control"
                  />
                </Col>

                <Col lg={4}>
                  <label htmlFor="businessHoursTo" className="form-label">
                    Business Hours — To
                  </label>
                  <input
                    type="time"
                    id="businessHoursTo"
                    name="businessHoursTo"
                    value={formData.businessHoursTo}
                    onChange={handleChange}
                    className="form-control"
                  />
                </Col>
              </Row>
            </ComponentContainerCard>
          </Col>
        </Row>

        {/* ══════════════ 4. Caution / Notice ══════════════ */}
        <Row className="mt-3">
          <Col xs={12}>
            <Row className="gy-3">
              <Col lg={12}>
                <label htmlFor="cautionText" className="form-label">
                  Caution Message
                </label>
                <textarea
                  id="cautionText"
                  name="cautionText"
                  value={formData.cautionText}
                  onChange={handleChange}
                  className="form-control"
                  rows={3}
                  placeholder="e.g. Due to high demand, response times may be delayed."
                />
              </Col>
            </Row>
          </Col>
        </Row>

        {/* ══════════════ 5. Travel Planner ══════════════ */}
        <Row className="mt-3">
          <Col xs={12}>
            <Row className="gy-3">
              <Col lg={12}>
                <label htmlFor="travelPlannerLabel" className="form-label">
                  Button Label
                </label>
                <input
                  type="text"
                  id="travelPlannerLabel"
                  name="travelPlannerLabel"
                  value={formData.travelPlannerLabel}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Plan My Trip"
                />
              </Col>
            </Row>
          </Col>
        </Row>

        {/* ══════════════ Save ══════════════ */}
        <div className="text-end mt-3 mb-4">
          <button
            type="submit"
            className="btn btn-primary px-4"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default GeneralSettingsForm;
