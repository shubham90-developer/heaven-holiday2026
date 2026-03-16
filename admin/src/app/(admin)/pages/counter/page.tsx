"use client";

import React, { useState, useEffect } from "react";
import {
  useGetCounterQuery,
  useUpdateCounterMutation,
} from "@/app/redux/api/counter/counterApi";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Row, Col, Alert, Form, Button } from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const CounterPage: React.FC = () => {
  const { data: counterData, isLoading } = useGetCounterQuery(undefined);
  const [updateCounter, { isLoading: isUpdating, isSuccess, isError }] =
    useUpdateCounterMutation();

  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    guests: 0,
    toursCompleted: 0,
    tourExpert: 0,
    tourDestination: 0,
    bigTravelCompany: "",
  });

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // Load existing data into form fields
  useEffect(() => {
    if (counterData?.data) {
      setFormData({
        title: counterData.data.title || "",
        subTitle: counterData.data.subTitle || "",
        guests: counterData.data.guests || 0,
        toursCompleted: counterData.data.toursCompleted || 0,
        tourExpert: counterData.data.tourExpert || 0,
        tourDestination: counterData.data.tourDestination || 0,
        bigTravelCompany: counterData.data.bigTravelCompany || "",
      });
    }
  }, [counterData]);

  // Show success alert
  useEffect(() => {
    if (isSuccess) {
      setShowSuccessAlert(true);
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Show error alert
  useEffect(() => {
    if (isError) {
      setShowErrorAlert(true);
      const timer = setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateCounter(formData).unwrap();
    } catch (err) {
      console.error("Failed to update counter:", err);
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
      <PageTitle title="Counter Management" subTitle="Content Management" />

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
            <strong>Success!</strong> Counter has been updated successfully.
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
            <strong>Error!</strong> Failed to update counter. Please try again.
          </div>
        </Alert>
      )}

      <Row>
        <Col xs={12}>
          <ComponentContainerCard
            title="Counter Information"
            description="Manage counter statistics and travel company information."
          >
            <Form onSubmit={handleSubmit}>
              <Row className="gy-4">
                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="counter-title">
                      Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="counter-title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter title"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="counter-subtitle">
                      Subtitle <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="counter-subtitle"
                      name="subTitle"
                      value={formData.subTitle}
                      onChange={handleInputChange}
                      placeholder="Enter subtitle"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="gy-4">
                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="counter-guests">
                      Total Guests <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      id="counter-guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      placeholder="Enter total guests"
                      min="0"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="counter-tours-completed">
                      Tours Completed <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      id="counter-tours-completed"
                      name="toursCompleted"
                      value={formData.toursCompleted}
                      onChange={handleInputChange}
                      placeholder="Enter tours completed"
                      min="0"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="gy-4">
                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="counter-tour-expert">
                      Tour Experts <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      id="counter-tour-expert"
                      name="tourExpert"
                      value={formData.tourExpert}
                      onChange={handleInputChange}
                      placeholder="Enter tour experts"
                      min="0"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="counter-tour-destination">
                      Tour Destinations <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      id="counter-tour-destination"
                      name="tourDestination"
                      value={formData.tourDestination}
                      onChange={handleInputChange}
                      placeholder="Enter tour destinations"
                      min="0"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="gy-4">
                <Col lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="counter-big-travel-company">
                      Big Travel Company Info{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="counter-big-travel-company"
                      name="bigTravelCompany"
                      value={formData.bigTravelCompany}
                      onChange={handleInputChange}
                      placeholder="Enter big travel company information"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-end mt-3">
                <Button type="submit" variant="primary" disabled={isUpdating}>
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
                    "Save Changes"
                  )}
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* Counter Statistics Preview */}
      {counterData?.data && (
        <Row className="mt-4">
          <Col xs={12}>
            <ComponentContainerCard
              title="Current Statistics"
              description="Preview of current counter values."
            >
              <Row className="g-3">
                <Col md={3} sm={6}>
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <IconifyIcon
                        icon="solar:users-group-rounded-bold-duotone"
                        className="fs-1 text-primary mb-2"
                      />
                      <h3 className="mb-1">{counterData.data.guests}</h3>
                      <p className="text-muted mb-0">Total Guests</p>
                    </div>
                  </div>
                </Col>

                <Col md={3} sm={6}>
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <IconifyIcon
                        icon="solar:map-point-bold-duotone"
                        className="fs-1 text-success mb-2"
                      />
                      <h3 className="mb-1">
                        {counterData.data.toursCompleted}
                      </h3>
                      <p className="text-muted mb-0">Tours Completed</p>
                    </div>
                  </div>
                </Col>

                <Col md={3} sm={6}>
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <IconifyIcon
                        icon="solar:user-id-bold-duotone"
                        className="fs-1 text-warning mb-2"
                      />
                      <h3 className="mb-1">{counterData.data.tourExpert}</h3>
                      <p className="text-muted mb-0">Tour Experts</p>
                    </div>
                  </div>
                </Col>

                <Col md={3} sm={6}>
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <IconifyIcon
                        icon="solar:compass-bold-duotone"
                        className="fs-1 text-info mb-2"
                      />
                      <h3 className="mb-1">
                        {counterData.data.tourDestination}
                      </h3>
                      <p className="text-muted mb-0">Tour Destinations</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </ComponentContainerCard>
          </Col>
        </Row>
      )}
    </>
  );
};

export default CounterPage;
