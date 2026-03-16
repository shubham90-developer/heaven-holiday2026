import { Row, Col, Form } from "react-bootstrap";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { modules, STATUS_OPTIONS, TOUR_TYPES } from "../constant";

interface BasicInfoTabProps {
  tourTitle: string;
  setTourTitle: (value: string) => void;
  tourSubtitle: string;
  setTourSubtitle: (value: string) => void;
  tourCategory: string;
  setTourCategory: (value: string) => void;
  tourType: string;
  setTourType: (value: string) => void;
  tourBadge: string;
  setTourBadge: (value: string) => void;
  tourStatus: string;
  setTourStatus: (value: string) => void;
  tourMetaDescription: string;
  setTourMetaDescription: (value: string) => void;
  tourDays: number;
  setTourDays: (value: number) => void;
  tourNights: number;
  setTourNights: (value: number) => void;
  categories: any[];
}

const BasicInfoTab = ({
  tourTitle,
  setTourTitle,
  tourSubtitle,
  setTourSubtitle,
  tourCategory,
  setTourCategory,
  tourType,
  setTourType,
  tourBadge,
  setTourBadge,
  tourStatus,
  setTourStatus,
  tourMetaDescription,
  setTourMetaDescription,
  tourDays,
  setTourDays,
  tourNights,
  setTourNights,
  categories,
}: BasicInfoTabProps) => {
  return (
    <>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>
              Title <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={tourTitle}
              onChange={(e) => setTourTitle(e.target.value)}
              placeholder="Enter tour title"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>
              Subtitle <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={tourSubtitle}
              onChange={(e) => setTourSubtitle(e.target.value)}
              placeholder="Enter tour subtitle"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              Category <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={tourCategory}
              onChange={(e) => setTourCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              Tour Type <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={tourType}
              onChange={(e) => setTourType(e.target.value)}
              required
            >
              {TOUR_TYPES.map((type: any) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Badge</Form.Label>
            <Form.Control
              type="text"
              value={tourBadge}
              onChange={(e) => setTourBadge(e.target.value)}
              placeholder="Badge text"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={tourStatus}
              onChange={(e) => setTourStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((status: any) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <div className="w-full">
        <div className="w-full mb-3">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="w-full">
            <ReactQuill
              theme="snow"
              value={tourMetaDescription}
              onChange={setTourMetaDescription}
              modules={modules}
              placeholder="Enter description..."
              className="w-full bg-white rounded-lg"
            />
          </div>
        </div>
      </div>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              Days <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={tourDays}
              onChange={(e) => setTourDays(Number(e.target.value))}
              min="1"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              Nights <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={tourNights}
              onChange={(e) => setTourNights(Number(e.target.value))}
              min="0"
              required
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default BasicInfoTab;
