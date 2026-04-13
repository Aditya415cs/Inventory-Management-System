import { useState, useEffect } from "react";
import { ordersApi, customersApi, suppliersApi, Order, Customer, Supplier } from "../api";
import "../styles/OrderProcessing.css";

const STATUS_LABEL: Record<string, string> = {
  confirmed:  "Confirmed",
  packing:    "Packing",
  dispatched: "Dispatched",
  ordered:    "Ordered",
  in_transit: "In Transit",
  completed:  "Completed",
};

const NEXT_STATUS: Record<string, string> = {
  confirmed:  "packing",
  packing:    "dispatched",
  ordered:    "in_transit",
  in_transit: "completed",
};

const SALE_STAGES     = ["confirmed", "packing", "dispatched"];
const PURCHASE_STAGES = ["ordered", "in_transit", "completed"];

export default function OrderProcessing() {
  const [orders,    setOrders]    = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [tab,       setTab]       = useState<"sale" | "purchase">("sale");
  const [selected,  setSelected]  = useState<Order | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const [o, c, s] = await Promise.all([
        ordersApi.getAll(),
        customersApi.getAll(),
        suppliersApi.getAll(),
      ]);
      setOrders(o);
      setCustomers(c);
      setSuppliers(s);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o => o.type === tab);
  const stages   = tab === "sale" ? SALE_STAGES : PURCHASE_STAGES;
  const byStage  = (stage: string) => filtered.filter(o => o.status === stage);

  const getName = (o: Order) => {
    if (tab === "sale") {
      return customers.find(c => String(c.customer_id) === String(o.customer_id))?.name ?? "—";
    }
    return suppliers.find(s => String(s.supplier_id) === String(o.supplier_id))?.name ?? "—";
  };

  const advance = async (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    try {
      await ordersApi.updateStatus(order.order_id, next);
      await load();
      if (selected?.order_id === order.order_id) setSelected({ ...order, status: next });
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  if (loading) return <div className="order-container"><p>Loading orders…</p></div>;
  if (error)   return <div className="order-container"><p style={{color:"red"}}>Error: {error}</p></div>;

  return (
    <div className="order-container">
      <h1>Order Processing</h1>

      {/* Tabs */}
      <div style={{display:"flex", gap:8, marginBottom:16}}>
        <button
          onClick={() => { setTab("sale"); setSelected(null); }}
          style={{padding:"8px 20px", borderRadius:8, border:"none", cursor:"pointer",
            background: tab === "sale" ? "#3b82f6" : "#1e293b", color:"white"}}
        >Sales Orders</button>
        <button
          onClick={() => { setTab("purchase"); setSelected(null); }}
          style={{padding:"8px 20px", borderRadius:8, border:"none", cursor:"pointer",
            background: tab === "purchase" ? "#3b82f6" : "#1e293b", color:"white"}}
        >Purchase Orders</button>
      </div>

      {/* Stats */}
      <div style={{display:"flex", gap:12, marginBottom:16}}>
        {stages.map(s => (
          <div className="order-box" key={s} style={{flex:1, textAlign:"center"}}>
            <p style={{color:"#94a3b8", fontSize:"0.8rem"}}>{STATUS_LABEL[s]}</p>
            <p style={{fontSize:"1.4rem", fontWeight:700}}>{byStage(s).length}</p>
          </div>
        ))}
      </div>

      {/* Kanban + Detail */}
      <div style={{display:"flex", gap:16}}>
        {/* Columns */}
        <div style={{display:"flex", gap:12, flex:1}}>
          {stages.map(stage => (
            <div key={stage} style={{flex:1, background:"#0f172a", borderRadius:10, padding:12}}>
              <h3 style={{color:"#94a3b8", fontSize:"0.85rem", marginBottom:10}}>
                {STATUS_LABEL[stage]} ({byStage(stage).length})
              </h3>
              {byStage(stage).length === 0
                ? <p style={{color:"#475569", fontSize:"0.8rem"}}>No orders</p>
                : byStage(stage).map(o => (
                  <div
                    key={o.order_id}
                    onClick={() => setSelected(o)}
                    style={{
                      background: selected?.order_id === o.order_id ? "#1e3a5f" : "#1e293b",
                      borderRadius:8, padding:10, marginBottom:8, cursor:"pointer",
                      border: selected?.order_id === o.order_id ? "1px solid #3b82f6" : "1px solid transparent"
                    }}
                  >
                    <p style={{fontFamily:"monospace", fontSize:"0.75rem", color:"#94a3b8"}}>#{o.order_id.slice(0,8)}…</p>
                    <p style={{fontSize:"0.82rem"}}>{getName(o)}</p>
                    <p style={{fontSize:"0.75rem", color:"#64748b"}}>{new Date(o.created_at).toLocaleDateString("en-IN")}</p>
                    {NEXT_STATUS[o.status] && (
                      <button
                        onClick={e => { e.stopPropagation(); advance(o); }}
                        style={{marginTop:6, background:"#1e3a5f", color:"#93c5fd",
                          border:"1px solid #2563eb", borderRadius:5, padding:"3px 10px",
                          fontSize:"0.75rem", cursor:"pointer"}}
                      >
                        → {STATUS_LABEL[NEXT_STATUS[o.status]]}
                      </button>
                    )}
                  </div>
                ))
              }
            </div>
          ))}
        </div>

        {/* Detail pane */}
        {selected && (
          <div style={{width:260, background:"#1e293b", borderRadius:10, padding:16, fontSize:"0.88rem", lineHeight:1.9}}>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:12}}>
              <b>Order Detail</b>
              <button onClick={() => setSelected(null)} style={{background:"none", border:"none", color:"#94a3b8", cursor:"pointer"}}>✕</button>
            </div>
            <p><b>ID:</b> {selected.order_id}</p>
            <p><b>Type:</b> {selected.type}</p>
            <p><b>Status:</b> {STATUS_LABEL[selected.status]}</p>
            <p><b>{tab === "sale" ? "Customer" : "Supplier"}:</b> {getName(selected)}</p>
            <p><b>Date:</b> {new Date(selected.created_at).toLocaleDateString("en-IN")}</p>
            {selected.notes && <p><b>Notes:</b> {selected.notes}</p>}
            <div style={{marginTop:8}}>
              <b>Products:</b>
              <ul style={{paddingLeft:16, marginTop:4}}>
                {(selected.products || []).map((p, i) => (
                  <li key={i} style={{fontSize:"0.82rem"}}>{p.product_code} × {p.quantity}</li>
                ))}
              </ul>
            </div>
            {NEXT_STATUS[selected.status] && (
              <button
                onClick={() => advance(selected)}
                style={{marginTop:12, background:"#1e3a5f", color:"#93c5fd",
                  border:"1px solid #2563eb", borderRadius:6, padding:"6px 14px", cursor:"pointer"}}
              >
                → Move to {STATUS_LABEL[NEXT_STATUS[selected.status]]}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}