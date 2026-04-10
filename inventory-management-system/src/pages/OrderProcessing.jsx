import React from "react";
import "../styles/OrderProcessing.css";

const OrderProcessing = () => {
  return (
    <div className="order-container">
      <h1>Order Processing</h1>

      <div className="order-box">
        <p>Status: Quotation</p>
        <button>Move to Packing</button>
      </div>

      <div className="order-box">
        <p>Status: Packing</p>
        <button>Dispatch</button>
      </div>
    </div>
  );
};

export default OrderProcessing;