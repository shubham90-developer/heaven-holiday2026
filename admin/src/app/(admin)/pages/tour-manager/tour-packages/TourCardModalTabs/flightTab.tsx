import { Row, Col, Form, Card, Button, Alert } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Flight } from "../types";

interface FlightsTabProps {
  flights: Flight[];
  handleAddFlight: () => void;
  handleRemoveFlight: (index: number) => void;
  handleFlightChange: (
    index: number,
    field: keyof Flight,
    value: string,
  ) => void;
}

const FlightsTab = ({
  flights,
  handleAddFlight,
  handleRemoveFlight,
  handleFlightChange,
}: FlightsTabProps) => {
  return (
    <>
      <h6 className="mb-3">
        Flight Details <span className="text-danger">*</span>
      </h6>

      {flights.map((flight, index) => (
        <Card key={index} className="mb-3 border-primary">
          <Card.Body>
            <Row className="mb-3">
              <Col
                xs={12}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <h6 className="mb-0">Flight #{index + 1}</h6>
                {flights.length > 1 && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveFlight(index)}
                  >
                    <IconifyIcon icon="tabler:trash" className="me-1" />
                    Remove
                  </Button>
                )}
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    From City <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={flight.fromCity}
                    onChange={(e) =>
                      handleFlightChange(index, "fromCity", e.target.value)
                    }
                    placeholder="e.g., Mumbai"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    To City <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={flight.toCity}
                    onChange={(e) =>
                      handleFlightChange(index, "toCity", e.target.value)
                    }
                    placeholder="e.g., Dubai"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Airline <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={flight.airline}
                    onChange={(e) =>
                      handleFlightChange(index, "airline", e.target.value)
                    }
                    placeholder="e.g., Air India"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Departure Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={flight.departureDate}
                    onChange={(e) =>
                      handleFlightChange(index, "departureDate", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Arrival Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={flight.arrivalDate}
                    onChange={(e) =>
                      handleFlightChange(index, "arrivalDate", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Departure Time <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="time"
                    value={flight.departureTime}
                    onChange={(e) =>
                      handleFlightChange(index, "departureTime", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Arrival Time <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="time"
                    value={flight.arrivalTime}
                    onChange={(e) =>
                      handleFlightChange(index, "arrivalTime", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    value={flight.duration}
                    onChange={(e) =>
                      handleFlightChange(index, "duration", e.target.value)
                    }
                    placeholder="e.g., 3h 30m"
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
        onClick={handleAddFlight}
        className="mb-3"
      >
        <IconifyIcon icon="tabler:plus" className="me-1" />
        Add Another Flight
      </Button>

      {flights.length > 0 && (
        <Alert variant="info" className="mt-3">
          <strong>Summary:</strong> {flights.length} flight
          {flights.length !== 1 ? "s" : ""} added
        </Alert>
      )}
    </>
  );
};

export default FlightsTab;
