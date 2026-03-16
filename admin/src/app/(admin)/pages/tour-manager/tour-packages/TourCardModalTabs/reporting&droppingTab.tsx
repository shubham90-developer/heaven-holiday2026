import { Row, Col, Form, Card, Button, Alert } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { ReportingDropping } from "../types";

interface ReportingDroppingTabProps {
  reportingDropping: ReportingDropping[];
  handleAddReportingDropping: () => void;
  handleRemoveReportingDropping: (index: number) => void;
  handleReportingDroppingChange: (
    index: number,
    field: keyof ReportingDropping,
    value: string,
  ) => void;
}

const ReportingDroppingTab = ({
  reportingDropping,
  handleAddReportingDropping,
  handleRemoveReportingDropping,
  handleReportingDroppingChange,
}: ReportingDroppingTabProps) => {
  return (
    <>
      <h6 className="mb-3">
        Reporting & Dropping Points <span className="text-danger">*</span>
      </h6>

      {reportingDropping.map((item, index) => (
        <Card key={index} className="mb-3 border-primary">
          <Card.Body>
            <Row className="mb-3">
              <Col
                xs={12}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <h6 className="mb-0">Point #{index + 1}</h6>
                {reportingDropping.length > 1 && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveReportingDropping(index)}
                  >
                    <IconifyIcon icon="tabler:trash" className="me-1" />
                    Remove
                  </Button>
                )}
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Guest Type <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={item.guestType}
                    onChange={(e) =>
                      handleReportingDroppingChange(
                        index,
                        "guestType",
                        e.target.value,
                      )
                    }
                    placeholder="e.g., Full Package, Joining Only"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Reporting Point <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={item.reportingPoint}
                    onChange={(e) =>
                      handleReportingDroppingChange(
                        index,
                        "reportingPoint",
                        e.target.value,
                      )
                    }
                    placeholder="e.g., Mumbai Airport Terminal 2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Dropping Point <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={item.droppingPoint}
                    onChange={(e) =>
                      handleReportingDroppingChange(
                        index,
                        "droppingPoint",
                        e.target.value,
                      )
                    }
                    placeholder="e.g., Mumbai Airport Terminal 2"
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
        onClick={handleAddReportingDropping}
        className="mb-3"
      >
        <IconifyIcon icon="tabler:plus" className="me-1" />
        Add Another Point
      </Button>

      {reportingDropping.length > 0 && (
        <Alert variant="info" className="mt-3">
          <strong>Summary:</strong> {reportingDropping.length}{" "}
          reporting/dropping point{reportingDropping.length !== 1 ? "s" : ""}{" "}
          added
        </Alert>
      )}
    </>
  );
};

export default ReportingDroppingTab;
