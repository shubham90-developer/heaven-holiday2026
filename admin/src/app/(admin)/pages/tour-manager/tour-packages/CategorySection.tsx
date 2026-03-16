import { Button } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import Link from "next/link";

interface CategorySectionProps {
  categories: any[];
  onOpenCategoryModal: (editMode: boolean, category?: any) => void;
  onDeleteCategory: (id: string) => void;
}

const CategorySection = ({
  categories,
  onOpenCategoryModal,
  onDeleteCategory,
}: CategorySectionProps) => {
  return (
    <>
      <div className="mb-3">
        <Button onClick={() => onOpenCategoryModal(false)}>
          <IconifyIcon icon="tabler:plus" className="me-1" />
          Add Category
        </Button>
      </div>

      <div className="table-responsive-sm">
        <table className="table table-striped-columns mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Title</th>
              <th>Guests</th>
              <th>Type</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  <p className="text-muted mb-0">No categories found!</p>
                </td>
              </tr>
            ) : (
              categories.map((category: any, index: number) => (
                <tr key={category._id || index}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="avatar-sm rounded"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{category.name}</td>
                  <td>{category.title}</td>
                  <td>{category.guests}</td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {category.categoryType}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        category.status === "Active"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <Link
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenCategoryModal(true, category);
                      }}
                      className="link-reset fs-20 p-1"
                    >
                      <IconifyIcon icon="tabler:pencil" />
                    </Link>
                    <Link
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        onDeleteCategory(category._id);
                      }}
                      className="link-reset fs-20 p-1"
                    >
                      <IconifyIcon icon="tabler:trash" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CategorySection;
