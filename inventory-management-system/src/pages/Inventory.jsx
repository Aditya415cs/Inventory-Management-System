import { useState } from "react";
import "../styles/Inventory.css";

function Inventory() {
  const [search, setSearch] = useState("");

  const items = [
    { id: 1, name: "Laptop", category: "Electronics", stock: 25, status: "In Stock" },
    { id: 2, name: "Mouse", category: "Electronics", stock: 5, status: "Low Stock" },
    { id: 3, name: "Chair", category: "Furniture", stock: 0, status: "Out of Stock" },
    { id: 4, name: "Desk", category: "Furniture", stock: 12, status: "In Stock" },
  ];

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-container">
      <h1 className="title">Inventory Management</h1>

      {/* Stats Cards */}
      <div className="stats">
        <div className="card">Total Items: {items.length}</div>
        <div className="card">Low Stock: {items.filter(i => i.stock < 10 && i.stock > 0).length}</div>
        <div className="card">Out of Stock: {items.filter(i => i.stock === 0).length}</div>
      </div>

      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.stock}</td>
              <td className={`status ${item.status.replace(" ", "-").toLowerCase()}`}>
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;