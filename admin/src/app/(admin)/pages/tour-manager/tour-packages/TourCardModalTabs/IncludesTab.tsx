import { Row, Col, Form, Card, Button, Alert } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { modules } from "../constant";

interface IncludesTabProps {
  includesData: any[];
  tourIncludes: string[];
  handleToggleInclude: (includeId: string) => void;
  tourManagerIncluded: boolean;
  setTourManagerIncluded: (value: boolean) => void;
  tourManagerNote: string;
  setTourManagerNote: (value: string) => void;
  tourWhyTravel: string[];
  handleAddWhyTravel: () => void;
  handleRemoveWhyTravel: (index: number) => void;
  handleWhyTravelChange: (index: number, value: string) => void;
}

const IncludesTab = ({
  includesData,
  tourIncludes,
  handleToggleInclude,
  tourManagerIncluded,
  setTourManagerIncluded,
  tourManagerNote,
  setTourManagerNote,
  tourWhyTravel,
  handleAddWhyTravel,
  handleRemoveWhyTravel,
  handleWhyTravelChange,
}: IncludesTabProps) => {
  return (
    <>
      <h6 className="mb-3">What's Included</h6>
      {includesData.length > 0 ? (
        <Row>
          {includesData.map((include: any) => (
            <Col md={4} key={include._id} className="mb-3">
              <Card
                className={`h-100 ${tourIncludes.includes(include._id) ? "border-primary" : ""}`}
              >
                <Card.Body>
                  <div className="d-flex align-items-start">
                    <Form.Check
                      type="checkbox"
                      id={`include-${include._id}`}
                      checked={tourIncludes.includes(include._id)}
                      onChange={() => handleToggleInclude(include._id)}
                      className="me-2"
                    />
                    <div className="flex-grow-1">
                      <label
                        htmlFor={`include-${include._id}`}
                        className="d-flex align-items-center cursor-pointer"
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={include.image}
                          alt={include.title}
                          className="rounded me-2"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                        />
                        <span className="fw-medium">{include.title}</span>
                      </label>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">
          <IconifyIcon
            icon="solar:info-circle-bold-duotone"
            className="fs-20 me-2"
          />
          No includes available. Please add includes first.
        </Alert>
      )}

      <h6 className="mt-4 mb-3">Tour Manager</h6>
      <Row>
        <Col md={12}>
          <Form.Check
            type="checkbox"
            label="Tour Manager Included"
            checked={tourManagerIncluded}
            onChange={(e) => setTourManagerIncluded(e.target.checked)}
          />
        </Col>
      </Row>
      <div className="w-full mt-2">
        <div className="w-full mb-3">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tour Manager Note
          </label>
          <div className="w-full">
            <ReactQuill
              theme="snow"
              value={tourManagerNote}
              onChange={setTourManagerNote}
              modules={modules}
              placeholder="Additional information about tour manager..."
              className="w-full bg-white rounded-lg"
            />
          </div>
        </div>
      </div>

      <h6 className="mt-4 mb-3">Why Travel</h6>
      {tourWhyTravel.map((reason, index) => (
        <Row key={index} className="mb-2">
          <Col md={11}>
            <Form.Control
              type="text"
              value={reason}
              onChange={(e) => handleWhyTravelChange(index, e.target.value)}
              placeholder="Reason to travel"
            />
          </Col>
          <Col md={1}>
            {tourWhyTravel.length > 1 && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveWhyTravel(index)}
              >
                <IconifyIcon icon="tabler:trash" />
              </Button>
            )}
          </Col>
        </Row>
      ))}
      <Button variant="outline-primary" size="sm" onClick={handleAddWhyTravel}>
        <IconifyIcon icon="tabler:plus" className="me-1" />
        Add Reason
      </Button>
    </>
  );
};

export default IncludesTab;
