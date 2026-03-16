import { Row, Col, Form } from "react-bootstrap";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface TourInformationTabProps {
  tourInclusions: string;
  setTourInclusions: (value: string) => void;
  tourExclusions: string;
  setTourExclusions: (value: string) => void;
  tourPrepartion: string;
  setTourPrepartion: (value: string) => void;
}

const TourInformationTab = ({
  tourInclusions,
  setTourInclusions,
  tourExclusions,
  setTourExclusions,
  tourPrepartion,
  setTourPrepartion,
}: TourInformationTabProps) => {
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
              Tour Inclusions <span className="text-red-600">*</span>
            </label>
            <div className="w-full">
              <ReactQuill
                theme="snow"
                value={tourInclusions}
                onChange={setTourInclusions}
                modules={modules}
                placeholder="Enter tour inclusions..."
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
              Tour Exclusions <span className="text-red-600">*</span>
            </label>
            <div className="w-full">
              <ReactQuill
                theme="snow"
                value={tourExclusions}
                onChange={setTourExclusions}
                modules={modules}
                placeholder="Enter tour exclusions..."
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
              Tour Preparation <span className="text-red-600">*</span>
            </label>
            <div className="w-full">
              <ReactQuill
                theme="snow"
                value={tourPrepartion}
                onChange={setTourPrepartion}
                modules={modules}
                placeholder="Enter tour preparation details..."
                className="w-full bg-white rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourInformationTab;
