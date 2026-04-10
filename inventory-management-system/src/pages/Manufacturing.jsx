import React from "react";
import "../styles/Manufacturing.css";

const Manufacturing = () => {
  return (
    <div className="manufacturing-container">
      <h1>Manufacturing (WIP Tracking)</h1>

      <div className="batch">
        <h3>Batch #001</h3>
        <p>Raw Materials: 50 units</p>
        <p>Output: 45 units</p>
        <p>Status: In Progress</p>
      </div>
    </div>
  );
};

export default Manufacturing;