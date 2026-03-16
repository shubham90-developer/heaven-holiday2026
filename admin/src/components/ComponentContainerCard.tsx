import { ReactNode } from "react";
import { Card, CardBody, CardHeader } from "react-bootstrap";

type ContainerCardProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  rightAction?: ReactNode;
};

const ComponentContainerCard = ({
  title,
  description,
  children,
  rightAction,
}: ContainerCardProps) => {
  return (
    <Card>
      <CardHeader className="border-0 border-bottom border-dashed">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="header-title mb-0">{title}</h4>

          {rightAction && <div>{rightAction}</div>}
        </div>
      </CardHeader>

      <CardBody>
        {description && <p className="text-muted">{description}</p>}
        {children}
      </CardBody>
    </Card>
  );
};

export default ComponentContainerCard;
