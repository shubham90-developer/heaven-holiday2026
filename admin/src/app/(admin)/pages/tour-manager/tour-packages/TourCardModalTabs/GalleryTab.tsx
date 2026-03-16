import { Form, Card, Button } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { FileUploader } from "@/components/FileUploader";

interface GalleryTabProps {
  tourGalleryPreviews: string[];
  tourGalleryFiles: File[];
  isEditMode: boolean;
  handleTourGalleryChange: (files: File[]) => void;
  handleRemoveGalleryImage: (index: number) => void;
}

const GalleryTab = ({
  tourGalleryPreviews,
  tourGalleryFiles,
  isEditMode,
  handleTourGalleryChange,
  handleRemoveGalleryImage,
}: GalleryTabProps) => {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>
          Gallery Images {!isEditMode && <span className="text-danger">*</span>}
        </Form.Label>

        {tourGalleryPreviews.length === 0 ? (
          <FileUploader
            onFileUpload={handleTourGalleryChange}
            icon="ri:upload-cloud-2-line"
            text="Drop images here or click to upload."
          />
        ) : (
          <>
            <div className="row g-2 mb-3">
              {tourGalleryPreviews.map((preview, index) => (
                <div key={index} className="col-md-3">
                  <Card className="mb-0 shadow-none border">
                    <div className="p-2 position-relative">
                      <img
                        src={preview}
                        className="w-100 rounded"
                        alt={`preview-${index}`}
                        style={{
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 m-2"
                        onClick={() => handleRemoveGalleryImage(index)}
                      >
                        <IconifyIcon icon="tabler:x" />
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = true;
                input.accept = "image/*";
                input.onchange = (e: any) => {
                  const files = Array.from(e.target.files || []) as File[];
                  handleTourGalleryChange(files);
                };
                input.click();
              }}
            >
              <IconifyIcon icon="tabler:plus" className="me-1" />
              Add More Images
            </Button>
          </>
        )}
      </Form.Group>
    </>
  );
};

export default GalleryTab;
