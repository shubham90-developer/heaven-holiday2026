import { Row, Col, Form, Card, Button, Alert } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Accommodation } from "../types";

interface AccommodationsTabProps {
  accommodations: Accommodation[];
  handleAddAccommodation: () => void;
  handleRemoveAccommodation: (index: number) => void;
  handleAccommodationChange: (
    index: number,
    field: keyof Accommodation,
    value: string,
  ) => void;
}

const AccommodationsTab = ({
  accommodations,
  handleAddAccommodation,
  handleRemoveAccommodation,
  handleAccommodationChange,
}: AccommodationsTabProps) => {
  return (
    <>
      <h6 className="mb-3">
        Accommodation Details <span className="text-danger">*</span>
      </h6>

      {accommodations.map((accommodation, index) => (
        <Card key={index} className="mb-3 border-primary">
          <Card.Body>
            <Row className="mb-3">
              <Col
                xs={12}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <h6 className="mb-0">Accommodation #{index + 1}</h6>
                {accommodations.length > 1 && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveAccommodation(index)}
                  >
                    <IconifyIcon icon="tabler:trash" className="me-1" />
                    Remove
                  </Button>
                )}
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    City <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={accommodation.city}
                    onChange={(e) =>
                      handleAccommodationChange(index, "city", e.target.value)
                    }
                    placeholder="e.g., Paris"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Country <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={accommodation.country}
                    onChange={(e) =>
                      handleAccommodationChange(
                        index,
                        "country",
                        e.target.value,
                      )
                    }
                    placeholder="e.g., France"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Hotel Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={accommodation.hotelName}
                    onChange={(e) =>
                      handleAccommodationChange(
                        index,
                        "hotelName",
                        e.target.value,
                      )
                    }
                    placeholder="e.g., Marriott Hotel"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Check-In Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={accommodation.checkInDate}
                    onChange={(e) =>
                      handleAccommodationChange(
                        index,
                        "checkInDate",
                        e.target.value,
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Check-Out Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={accommodation.checkOutDate}
                    onChange={(e) =>
                      handleAccommodationChange(
                        index,
                        "checkOutDate",
                        e.target.value,
                      )
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      <Button
        variant="primary"
        size="sm"
        onClick={handleAddAccommodation}
        className="mb-3"
      >
        <IconifyIcon icon="tabler:plus" className="me-1" />
        Add Another Accommodation
      </Button>

      {accommodations.length > 0 && (
        <Alert variant="info" className="mt-3">
          <strong>Summary:</strong> {accommodations.length} accommodation
          {accommodations.length !== 1 ? "s" : ""} added
        </Alert>
      )}
    </>
  );
};

export default AccommodationsTab;
