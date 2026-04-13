import React, { useState } from "react";
import "./Supplier.css";

const SupplierDashboard = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      material: "Aluminum Sheets",
      quantity: 50,
      company: "SunMount Technologies",
      status: "Pending",
    },
    {
      id: 2,
      material: "Copper Wire",
      quantity: 100,
      company: "SunMount Technologies",
      status: "Pending",
    },
    {
      id: 3,
      material: "Plastic Granules",
      quantity: 200,
      company: "SunMount Technologies",
      status: "Delivered",
    },
  ]);

  // ✅ Mark as Delivered
  const markDelivered = (id) => {
    const updated = orders.map((order) =>
      order.id === id
        ? { ...order, status: "Delivered" }
        : order
    );
    setOrders(updated);
  };

  return (
    <div className="supplier-container">

      <h1>🏭 Supplier Dashboard</h1>
      <p>Manage raw material orders from Admin Company</p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Material</th>
            <th>Quantity</th>
            <th>Company</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.material}</td>
              <td>{order.quantity}</td>
              <td>{order.company}</td>

              <td>
                <span
                  className={
                    order.status === "Delivered"
                      ? "status delivered"
                      : "status pending"
                  }
                >
                  {order.status}
                </span>
              </td>

              <td>
                {order.status === "Pending" ? (
                  <button
                    className="deliver-btn"
                    onClick={() => markDelivered(order.id)}
                  >
                    Mark Delivered
                  </button>
                ) : (
                  <span className="done">✔ Done</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default SupplierDashboard;