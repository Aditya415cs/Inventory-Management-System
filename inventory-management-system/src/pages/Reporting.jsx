import React from "react";
import "../styles/Reporting.css";

const Reporting = () => {
  return (
    <div className="report-container">
      <h1>Order History & Reporting</h1>

      <ul>
        <li>Order #1001 - Completed</li>
        <li>Order #1002 - Pending</li>
      </ul>
    </div>
  );
};

export default Reporting;