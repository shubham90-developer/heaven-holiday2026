import { Row, Col, Form, Card, Button, Alert } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Departure } from "../types";

interface DeparturesTabProps {
  departures: Departure[];
  handleAddDeparture: () => void;
  handleRemoveDeparture: (index: number) => void;
  handleDepartureChange: (
    index: number,
    field: keyof Departure,
    value: any,
  ) => void;
}

const DeparturesTab = ({
  departures,
  handleAddDeparture,
  handleRemoveDeparture,
  handleDepartureChange,
}: DeparturesTabProps) => {
  return (
    <>
      <h6 className="mb-3">
        Departure Schedule <span className="text-danger">*</span>
      </h6>

      {departures.map((departure, index) => (
        <Card key={index} className="mb-3 border-primary">
          <Card.Body>
            <Row className="mb-3">
              <Col
                xs={12}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <h6 className="mb-0">Departure #{index + 1}</h6>
                {departures.length > 1 && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveDeparture(index)}
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
                    Departure City <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={departure.city}
                    onChange={(e) =>
                      handleDepartureChange(index, "city", e.target.value)
                    }
                    placeholder="Enter departure city"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Departure Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={departure.date}
                    onChange={(e) =>
                      handleDepartureChange(index, "date", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Seats</Form.Label>
                  <Form.Control
                    type="number"
                    value={departure.totalSeats}
                    onChange={(e) =>
                      handleDepartureChange(
                        index,
                        "totalSeats",
                        Number(e.target.value),
                      )
                    }
                    min="1"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Full Package Price <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={departure.fullPackagePrice}
                    onChange={(e) =>
                      handleDepartureChange(
                        index,
                        "fullPackagePrice",
                        Number(e.target.value),
                      )
                    }
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Joining Price <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={departure.joiningPrice}
                    onChange={(e) =>
                      handleDepartureChange(
                        index,
                        "joiningPrice",
                        Number(e.target.value),
                      )
                    }
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Available Seats</Form.Label>
                  <Form.Control
                    type="number"
                    value={departure.availableSeats}
                    onChange={(e) =>
                      handleDepartureChange(
                        index,
                        "availableSeats",
                        Number(e.target.value),
                      )
                    }
                    min="0"
                    max={departure.totalSeats}
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
        onClick={handleAddDeparture}
        className="mb-3"
      >
        <IconifyIcon icon="tabler:plus" className="me-1" />
        Add Another Departure
      </Button>

      {departures.length > 0 && (
        <Alert variant="info" className="mt-3">
          <strong>Summary:</strong> {departures.length} departure
          {departures.length !== 1 ? "s" : ""} from{" "}
          {[...new Set(departures.map((d) => d.city))].length}{" "}
          {[...new Set(departures.map((d) => d.city))].length !== 1
            ? "cities"
            : "city"}
        </Alert>
      )}
    </>
  );
};

export default DeparturesTab;
