import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { productsApi, ordersApi, manufacturingApi, Order } from "./api";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats,   setStats]   = useState({ products:0, sales:0, purchases:0, batches:0, lowStock:0 });
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [products, allOrders, batches] = await Promise.all([
          productsApi.getAll(),
          ordersApi.getAll(),
          manufacturingApi.getAll(),
        ]);
        setOrders(allOrders);
        setStats({
          products:  products.length,
          sales:     allOrders.filter(o => o.type === "sale").length,
          purchases: allOrders.filter(o => o.type === "purchase").length,
          batches:   batches.length,
          lowStock:  products.filter(p => p.quantity < 20 && p.quantity > 0).length,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Last 7 days sales order count from real data
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key   = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-IN", { weekday: "short" });
    const count = orders.filter(o => o.type === "sale" && o.created_at?.slice(0, 10) === key).length;
    return { day: label, orders: count };
  });

  const pipeline = [
    { name: "Confirmed",  value: orders.filter(o => o.type === "sale" && o.status === "confirmed").length },
    { name: "Packing",    value: orders.filter(o => o.type === "sale" && o.status === "packing").length },
    { name: "Dispatched", value: orders.filter(o => o.type === "sale" && o.status === "dispatched").length },
  ];

  return (
    <div className="main">
      <div className="topbar">
        <h1>Dashboard</h1>
        <span style={{color:"#94a3b8", fontSize:"0.9rem"}}>
          {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
        </span>
      </div>

      {loading ? <p style={{color:"#94a3b8"}}>Loading live data…</p> : (
        <>
          {/* KPI Cards */}
          <div className="cards">
            <div className="card" onClick={() => navigate("/app/inventory")} style={{cursor:"pointer"}}>
              <h3>Products</h3><p>{stats.products}</p>
            </div>
            <div className="card" onClick={() => navigate("/app/order-processing")} style={{cursor:"pointer"}}>
              <h3>Sales Orders</h3><p>{stats.sales}</p>
            </div>
            <div className="card" onClick={() => navigate("/app/order-processing")} style={{cursor:"pointer"}}>
              <h3>Purchase Orders</h3><p>{stats.purchases}</p>
            </div>
            <div className="card" onClick={() => navigate("/app/manufacturing")} style={{cursor:"pointer"}}>
              <h3>Mfg Batches</h3><p>{stats.batches}</p>
            </div>
            <div className="card" style={{borderLeft:"3px solid #f59e0b"}}>
              <h3>Low Stock</h3><p style={{color:"#f59e0b"}}>{stats.lowStock}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="charts">
            <div className="chart-box">
              <h2>Sales Orders — Last 7 Days</h2>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={last7}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip contentStyle={{background:"#1e293b", border:"none", color:"#fff"}} />
                  <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} dot={{fill:"#3b82f6"}} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-box">
              <h2>Sales Pipeline</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={pipeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip contentStyle={{background:"#1e293b", border:"none", color:"#fff"}} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="chart-box" style={{marginTop:24}}>
            <h2>Recent Orders</h2>
            <table style={{width:"100%", borderCollapse:"collapse", marginTop:12}}>
              <thead>
                <tr style={{borderBottom:"1px solid #334155", color:"#94a3b8", fontSize:"0.82rem"}}>
                  <th style={{padding:"8px", textAlign:"left"}}>Order ID</th>
                  <th style={{padding:"8px", textAlign:"left"}}>Type</th>
                  <th style={{padding:"8px", textAlign:"left"}}>Status</th>
                  <th style={{padding:"8px", textAlign:"left"}}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map(o => (
                  <tr key={o.order_id} style={{borderBottom:"1px solid #1e293b"}}>
                    <td style={{padding:"8px", fontFamily:"monospace", fontSize:"0.78rem"}}>{o.order_id.slice(0,12)}…</td>
                    <td style={{padding:"8px", textTransform:"capitalize"}}>{o.type}</td>
                    <td style={{padding:"8px"}}>
                      <span style={{
                        background: o.status==="dispatched"||o.status==="completed" ? "#166534"
                          : o.status==="packing"||o.status==="in_transit" ? "#92400e" : "#1e3a5f",
                        color:"#fff", padding:"2px 8px", borderRadius:4, fontSize:"0.75rem"
                      }}>{o.status.replace("_"," ")}</span>
                    </td>
                    <td style={{padding:"8px", color:"#94a3b8", fontSize:"0.82rem"}}>{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}