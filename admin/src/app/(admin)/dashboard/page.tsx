import PageTitle from "@/components/PageTitle";
import { Col, Row } from "react-bootstrap";
import BrandsListing from "./components/BrandsListing";
import DailySales from "./components/DailySales";
import DataUsesChart from "./components/DataUsesChart";
import NewSignup from "./components/NewSignup";
import Stat from "./components/Stat";

import VisitorTraffics from "./components/VisitorTraffics";
import { Metadata } from "next";

// export const metadata: Metadata = { title: 'Dashboard' }

const DashboardPage = () => {
  return (
    <>
      <PageTitle title="Dashboard" />
      <Stat />

      {/* <Row>
        <Col xxl={6}>
          <BrandsListing />
        </Col>
        <Col xxl={6}>
          <NewSignup />
        </Col>
      </Row>
      <Row>
        <VisitorTraffics />
        <DataUsesChart />
      </Row> */}
    </>
  );
};

export default DashboardPage;
