import React, { useState } from "react";
import "./rawmat.css";

const RawMaterial = () => {
  const [orders, setOrders] = useState([
    { id: 1, name: "Aluminum Sheets", quantity: 50, status: "Pending" },
    { id: 2, name: "Copper Wire", quantity: 100, status: "Pending" },
    { id: 3, name: "Plastic Granules", quantity: 200, status: "Delivered" },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Mark as Delivered
  const markDelivered = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "Delivered" } : order
      )
    );
  };

  // Filter + Search Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter === "All" ? true : order.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="raw-container">
      {/* 🔥 Header */}
      <div className="header">
        <h1>📦 Raw Material Orders</h1>
        <input
          className="search"
          placeholder="Search materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🔥 Filters */}
      <div className="filters">
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Pending")}>Pending</button>
        <button onClick={() => setFilter("Delivered")}>Delivered</button>
      </div>

      {/* 🔥 Table Card */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Material</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.name}</td>
                  <td>{order.quantity}</td>

                  <td>
                    <span
                      className={`status ${
                        order.status === "Delivered" ? "delivered" : "pending"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="action-btn"
                      disabled={order.status === "Delivered"}
                      onClick={() => markDelivered(order.id)}
                    >
                      {order.status === "Delivered"
                        ? "Completed"
                        : "Mark Delivered"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RawMaterial;
