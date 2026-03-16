import { Row, Col, Form } from "react-bootstrap";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface PoliciesTabProps {
  needToKnow: string;
  setNeedToKnow: (value: string) => void;
  cancellationPolicy: string;
  setCancellationPolicy: (value: string) => void;
}

const PoliciesTab = ({
  needToKnow,
  setNeedToKnow,
  cancellationPolicy,
  setCancellationPolicy,
}: PoliciesTabProps) => {
  // Quill editor modules
  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "super" }, { script: "sub" }],
      [{ header: [false, 1, 2, 3, 4, 5, 6] }, "blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["direction", { align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="col-span-1">
          <div className="w-full mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Need to Know <span className="text-red-600">*</span>
            </label>
            <div className="w-full">
              <ReactQuill
                theme="snow"
                value={needToKnow}
                onChange={setNeedToKnow}
                modules={modules}
                placeholder="Enter important information travelers need to know..."
                className="w-full bg-white rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="col-span-1">
          <div className="w-full mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Payment & Cancellation Policy{" "}
              <span className="text-red-600">*</span>
            </label>
            <div className="w-full">
              <ReactQuill
                theme="snow"
                value={cancellationPolicy}
                onChange={setCancellationPolicy}
                modules={modules}
                placeholder="Enter payment terms and cancellation policy details..."
                className="w-full bg-white rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PoliciesTab;
