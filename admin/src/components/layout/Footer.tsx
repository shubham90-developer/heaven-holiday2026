import { currentYear } from "@/context/constants";
import Link from "next/link";
import React from "react";
import { Col, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="page-container">
        <Row>
          <Col md={6} className="text-center text-md-start">
            {currentYear} © HeavenHoliday - By{" "}
            <span className="fw-bold text-decoration-underline text-uppercase text-reset fs-12">
              HeavenHoliday
            </span>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;
