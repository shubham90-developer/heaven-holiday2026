import { Row, Col, Form, Card, Button, Alert } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { ItineraryItem } from "../types";
import { modules } from "../constant";

interface ItineraryTabProps {
  itinerary: ItineraryItem[];
  handleAddItinerary: () => void;
  handleRemoveItinerary: (index: number) => void;
  handleItineraryChange: (
    index: number,
    field: string,
    value: string | number,
  ) => void;
}

const ItineraryTab = ({
  itinerary,
  handleAddItinerary,
  handleRemoveItinerary,
  handleItineraryChange,
}: ItineraryTabProps) => {
  return (
    <>
      <h6 className="mb-3">
        Day-wise Itinerary <span className="text-danger">*</span>
      </h6>

      {itinerary.map((item, index) => (
        <Card key={index} className="mb-3 border-primary">
          <Card.Body>
            <Row className="mb-3">
              <Col
                xs={12}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <h6 className="mb-0">Day {item.day}</h6>
                {itinerary.length > 1 && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveItinerary(index)}
                  >
                    <IconifyIcon icon="tabler:trash" className="me-1" />
                    Remove
                  </Button>
                )}
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Day Number <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={item.day}
                    onChange={(e) =>
                      handleItineraryChange(
                        index,
                        "day",
                        Number(e.target.value),
                      )
                    }
                    min="1"
                  />
                </Form.Group>
              </Col>
              <Col md={9}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Title <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      handleItineraryChange(index, "title", e.target.value)
                    }
                    placeholder="e.g., Arrival in Paris"
                  />
                </Form.Group>
              </Col>
              <Col md={9}>
                <Form.Group className="mb-3">
                  <Form.Label>Date (Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    value={item.date}
                    onChange={(e) =>
                      handleItineraryChange(index, "date", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="w-full">
              <div className="w-full mb-3">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Activity Description <span className="text-red-600">*</span>
                </label>
                <div className="w-full">
                  <ReactQuill
                    theme="snow"
                    value={item.activity}
                    onChange={(value) =>
                      handleItineraryChange(index, "activity", value)
                    }
                    modules={modules}
                    placeholder="Describe the day's activities..."
                    className="w-full bg-white rounded-lg"
                  />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}

      <Button
        variant="primary"
        size="sm"
        onClick={handleAddItinerary}
        className="mb-3"
      >
        <IconifyIcon icon="tabler:plus" className="me-1" />
        Add Another Day
      </Button>

      {itinerary.length > 0 && (
        <Alert variant="info" className="mt-3">
          <strong>Summary:</strong> {itinerary.length} day
          {itinerary.length !== 1 ? "s" : ""} planned
        </Alert>
      )}
    </>
  );
};

export default ItineraryTab;
