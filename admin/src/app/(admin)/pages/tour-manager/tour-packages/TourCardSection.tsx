import { Button, Badge } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import Link from "next/link";

interface TourCardSectionProps {
  tourCards: any[];
  onOpenTourCardModal: (editMode: boolean, card?: any) => void;
  onDeleteTourCard: (id: string) => void;
}

const TourCardSection = ({
  tourCards,
  onOpenTourCardModal,
  onDeleteTourCard,
}: TourCardSectionProps) => {
  return (
    <>
      <div className="mb-3">
        <Button onClick={() => onOpenTourCardModal(false)}>
          <IconifyIcon icon="tabler:plus" className="me-1" />
          Add Tour Package Card
        </Button>
      </div>

      <div className="table-responsive-sm">
        <table className="table table-striped-columns mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>

              <th>Base Price</th>
              <th>Departures</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {tourCards.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  <p className="text-muted mb-0">
                    No tour package cards found!
                  </p>
                </td>
              </tr>
            ) : (
              tourCards.map((card: any, index: number) => {
                const metadata = card.metadata || {};
                const departures = card.departures || [];
                const uniqueCities = [
                  ...new Set(departures.map((d: any) => d.city)),
                ];

                return (
                  <tr key={card._id || index}>
                    <td>{index + 1}</td>
                    <td>{card.title}</td>
                    <td>{card.category?.name || "N/A"}</td>
                    <td>{card.tourType}</td>

                    <td>
                      <div className="small">
                        <div>
                          ₹
                          {(
                            card.baseFullPackagePrice ||
                            card.fullPackagePrice ||
                            0
                          ).toLocaleString()}
                        </div>
                        <span className="text-muted">Starting from</span>
                      </div>
                    </td>
                    <td>
                      {departures.length > 0 ? (
                        <div className="small">
                          <Badge bg="primary" className="me-1">
                            {departures.length}{" "}
                            {departures.length === 1 ? "date" : "dates"}
                          </Badge>
                          <Badge bg="info">
                            {uniqueCities.length}{" "}
                            {uniqueCities.length === 1 ? "city" : "cities"}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted small">No departures</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          card.status === "Active" ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {card.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <Link
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          onOpenTourCardModal(true, card);
                        }}
                        className="link-reset fs-20 p-1"
                        title="Edit"
                      >
                        <IconifyIcon icon="tabler:pencil" />
                      </Link>
                      <Link
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          onDeleteTourCard(card._id);
                        }}
                        className="link-reset fs-20 p-1"
                        title="Delete"
                      >
                        <IconifyIcon icon="tabler:trash" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TourCardSection;
