import { Row, Col, Form, Alert } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { modules } from "../constant";

interface IPriceBreakdown {
  adultSingleSharing: number;
  adultDoubleSharing: number;
  adultTripleSharing: number;
  childWithBed: number;
  childWithoutBed: number;
  infantBasePrice: number;
  infantWithRoom: number;
}

interface PricingTabProps {
  tourBaseFullPackagePrice: number;
  setTourBaseFullPackagePrice: (value: number) => void;
  tourBaseJoiningPrice: number;
  setTourBaseJoiningPrice: (value: number) => void;
  tourPriceNote: string;
  setTourPriceNote: (value: string) => void;
  priceBreakdown: IPriceBreakdown;
  setPriceBreakdown: (value: IPriceBreakdown) => void;
  tscCharge: number;
  setTscCharge: (value: number) => void;
}

const PricingTab = ({
  tourBaseFullPackagePrice,
  setTourBaseFullPackagePrice,
  tourBaseJoiningPrice,
  setTourBaseJoiningPrice,
  tourPriceNote,
  setTourPriceNote,
  priceBreakdown,
  setPriceBreakdown,
  tscCharge,
  setTscCharge,
}: PricingTabProps) => {
  const handlePriceBreakdownChange = (
    field: keyof IPriceBreakdown,
    value: number,
  ) => {
    setPriceBreakdown({ ...priceBreakdown, [field]: value });
  };

  return (
    <>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              Base Full Package Price <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={tourBaseFullPackagePrice}
              onChange={(e) =>
                setTourBaseFullPackagePrice(Number(e.target.value))
              }
              min="0"
              required
            />
            <Form.Text className="text-muted">
              Lowest full package price (with flights)
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              Base Joining Price <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={tourBaseJoiningPrice}
              onChange={(e) => setTourBaseJoiningPrice(Number(e.target.value))}
              min="0"
              required
            />
            <Form.Text className="text-muted">
              Lowest joining price (without flights)
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>TSC Charge</Form.Label>
            <Form.Control
              type="number"
              value={tscCharge}
              onChange={(e) => setTscCharge(Number(e.target.value))}
              min="0"
            />
            <Form.Text className="text-muted">
              Tax/service charge per person
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {/* ── Price Breakdown ── */}
      <hr className="my-4" />
      <h5 className="mb-1 fw-semibold">Price Breakdown per Passenger Type</h5>
      <p className="text-muted mb-3 fs-13">
        Set individual prices per passenger category. These will be used to
        calculate the total booking amount.
      </p>

      {/* Adults */}
      <h6 className="mb-2 text-primary">
        <IconifyIcon
          icon="solar:users-group-rounded-bold-duotone"
          className="me-2 fs-16"
        />
        Adults
      </h6>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              Single Sharing <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={priceBreakdown.adultSingleSharing}
              onChange={(e) =>
                handlePriceBreakdownChange(
                  "adultSingleSharing",
                  Number(e.target.value),
                )
              }
              min="0"
              required
            />
            <Form.Text className="text-muted">1 person per room</Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              Double Sharing <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={priceBreakdown.adultDoubleSharing}
              onChange={(e) =>
                handlePriceBreakdownChange(
                  "adultDoubleSharing",
                  Number(e.target.value),
                )
              }
              min="0"
              required
            />
            <Form.Text className="text-muted">2 persons per room</Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              Triple Sharing <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={priceBreakdown.adultTripleSharing}
              onChange={(e) =>
                handlePriceBreakdownChange(
                  "adultTripleSharing",
                  Number(e.target.value),
                )
              }
              min="0"
              required
            />
            <Form.Text className="text-muted">3 persons per room</Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {/* Children */}
      <h6 className="mb-2 text-primary">
        <IconifyIcon
          icon="solar:sticker-smile-circle-2-bold-duotone"
          className="me-2 fs-16"
        />
        Children
      </h6>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              Child With Bed <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={priceBreakdown.childWithBed}
              onChange={(e) =>
                handlePriceBreakdownChange(
                  "childWithBed",
                  Number(e.target.value),
                )
              }
              min="0"
              required
            />
            <Form.Text className="text-muted">
              Child occupying a bed in the room
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              Child Without Bed <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={priceBreakdown.childWithoutBed}
              onChange={(e) =>
                handlePriceBreakdownChange(
                  "childWithoutBed",
                  Number(e.target.value),
                )
              }
              min="0"
              required
            />
            <Form.Text className="text-muted">
              Child sharing existing bed
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {/* Infant */}
      <h6 className="mb-2 text-primary">
        <IconifyIcon icon="mdi:baby-face" className="me-2 fs-16" />
        Infant
      </h6>
      <Alert variant="warning" className="mb-3 fs-13">
        <IconifyIcon
          icon="solar:info-circle-bold-duotone"
          className="fs-18 me-2"
        />
        Infant base price is always charged for travelling. Room addon price is
        added only if the infant needs a separate room.
      </Alert>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              Infant Base Price <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={priceBreakdown.infantBasePrice}
              onChange={(e) =>
                handlePriceBreakdownChange(
                  "infantBasePrice",
                  Number(e.target.value),
                )
              }
              min="0"
              required
            />
            <Form.Text className="text-muted">
              Charged for every infant travelling
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              Infant Room Addon Price <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={priceBreakdown.infantWithRoom}
              onChange={(e) =>
                handlePriceBreakdownChange(
                  "infantWithRoom",
                  Number(e.target.value),
                )
              }
              min="0"
              required
            />
            <Form.Text className="text-muted">
              Extra charge if infant needs a room
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {/* ── Price Note ── */}
      <hr className="my-4" />
      <div className="w-full">
        <div className="w-full mb-3">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Price Note
          </label>
          <div className="w-full">
            <ReactQuill
              theme="snow"
              value={tourPriceNote}
              onChange={setTourPriceNote}
              modules={modules}
              placeholder="Additional pricing notes..."
              className="w-full bg-white rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingTab;
