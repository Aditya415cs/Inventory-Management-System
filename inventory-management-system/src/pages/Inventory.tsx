import { useState, useEffect } from "react";
import { productsApi, Product } from "../api";
import "../styles/Inventory.css";

function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.product_code.toLowerCase().includes(search.toLowerCase())
  );

  const stockStatus = (qty: number) => {
    if (qty === 0) return { label: "Out of Stock", cls: "out-of-stock" };
    if (qty < 20)  return { label: "Low Stock",    cls: "low-stock" };
    return               { label: "In Stock",      cls: "in-stock" };
  };

  if (loading) return <div className="inventory-container"><p>Loading products…</p></div>;
  if (error)   return <div className="inventory-container"><p style={{color:"red"}}>Error: {error}</p></div>;

  return (
    <div className="inventory-container">
      <h1 className="title">Inventory Management</h1>

      {/* Stats */}
      <div className="stats">
        <div className="card">Total Items: {products.length}</div>
        <div className="card">Low Stock: {products.filter(p => p.quantity > 0 && p.quantity < 20).length}</div>
        <div className="card">Out of Stock: {products.filter(p => p.quantity === 0).length}</div>
      </div>

      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name or code…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Price (₹)</th>
            <th>Qty</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={5} style={{textAlign:"center",padding:"20px"}}>No products found</td></tr>
          ) : filtered.map(p => {
            const { label, cls } = stockStatus(p.quantity);
            return (
              <tr
                key={p.product_code}
                onClick={() => setSelected(p)}
                style={{cursor:"pointer", background: selected?.product_code === p.product_code ? "#1e3a5f" : ""}}
              >
                <td>{p.product_code}</td>
                <td>{p.name}</td>
                <td>₹{Number(p.price).toLocaleString("en-IN")}</td>
                <td>{p.quantity}</td>
                <td><span className={`status ${cls}`}>{label}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Detail panel */}
      {selected && (
        <div style={{marginTop:20, background:"#1e293b", borderRadius:10, padding:18}}>
          <h3 style={{marginBottom:10}}>{selected.name}</h3>
          <p><b>Code:</b> {selected.product_code}</p>
          <p><b>Description:</b> {selected.description || "—"}</p>
          <p><b>Weight:</b> {selected.weight ?? "—"} kg</p>
          <p><b>Price:</b> ₹{Number(selected.price).toLocaleString("en-IN")}</p>
          <p><b>Quantity:</b> {selected.quantity}</p>
          <p><b>Last Updated:</b> {selected.last_updated ? new Date(selected.last_updated).toLocaleString() : "—"}</p>
          <button onClick={() => setSelected(null)} style={{marginTop:10}}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Inventory;