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

/* ═══════════════════════════════════════════════════════════
   Timeline Component — Horizontal step-progress indicator
   ═══════════════════════════════════════════════════════════ */
function TimelineBar({
  stages,
  currentStatus,
}: {
  stages: string[];
  currentStatus: string;
}) {
  const currentIdx = stages.indexOf(currentStatus);

  return (
    <div className="order-timeline">
      <div className="timeline-label">Order Progress</div>
      <div className="timeline-track">
        {stages.map((stage, i) => {
          const isCompleted = i < currentIdx;
          const isActive    = i === currentIdx;
          const isPending   = i > currentIdx;

          // Connector before each step (except the first)
          const connector =
            i > 0 ? (
              <div
                key={`c-${i}`}
                className={`timeline-connector ${
                  i <= currentIdx ? "filled" : ""
                }`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ) : null;

          return (
            <span key={stage} style={{ display: "contents" }}>
              {connector}
              <div
                className={`timeline-step ${
                  isCompleted ? "is-completed" : ""
                } ${isActive ? "is-active" : ""}`}
              >
                <div
                  className={`step-dot ${
                    isCompleted
                      ? "completed"
                      : isActive
                        ? "active"
                        : "pending"
                  }`}
                >
                  {isCompleted ? "✓" : i + 1}
                </div>
                <span className="step-name">{STATUS_LABEL[stage]}</span>
              </div>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════════════════════ */
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

  /* ── Loading / Error States ─────────────────── */
  if (loading) {
    return (
      <div className="order-container">
        <p style={{ color: "var(--text-secondary)" }}>Loading orders…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="order-container">
        <p style={{ color: "var(--accent-red)" }}>Error: {error}</p>
      </div>
    );
  }

  /* ── Render ─────────────────────────────────── */
  return (
    <div className="order-container">
      <h1>Order Processing</h1>

      {/* ── Tabs ──────────────────────────────── */}
      <div className="order-tabs">
        <button
          className={`order-tab ${tab === "sale" ? "active" : ""}`}
          onClick={() => { setTab("sale"); setSelected(null); }}
        >
          🛒 Sales Orders
        </button>
        <button
          className={`order-tab ${tab === "purchase" ? "active" : ""}`}
          onClick={() => { setTab("purchase"); setSelected(null); }}
        >
          📥 Purchase Orders
        </button>
      </div>

      {/* ── Stat Cards ────────────────────────── */}
      <div className="order-stats">
        {stages.map(s => (
          <div className="order-stat-card" key={s}>
            <p className="order-stat-label">{STATUS_LABEL[s]}</p>
            <p className="order-stat-value">{byStage(s).length}</p>
          </div>
        ))}
      </div>

      {/* ── Kanban + Detail ───────────────────── */}
      <div className="order-body">
        {/* Kanban Columns */}
        <div className="order-kanban">
          {stages.map(stage => (
            <div key={stage} className="kanban-column">
              <div className="kanban-header">
                {STATUS_LABEL[stage]}
                <span className="count-badge">{byStage(stage).length}</span>
              </div>

              {byStage(stage).length === 0 ? (
                <p className="kanban-empty">No orders</p>
              ) : (
                byStage(stage).map(o => (
                  <div
                    key={o.order_id}
                    className={`order-card ${selected?.order_id === o.order_id ? "selected" : ""}`}
                    onClick={() => setSelected(o)}
                  >
                    <p className="order-card-id">#{o.order_id.slice(0, 8)}…</p>
                    <p className="order-card-name">{getName(o)}</p>
                    <p className="order-card-date">
                      {new Date(o.created_at).toLocaleDateString("en-IN")}
                    </p>
                    {NEXT_STATUS[o.status] && (
                      <button
                        className="order-card-advance"
                        onClick={e => { e.stopPropagation(); advance(o); }}
                      >
                        → {STATUS_LABEL[NEXT_STATUS[o.status]]}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>

        {/* ── Detail Pane with Timeline ────── */}
        {selected && (
          <div className="order-detail" key={selected.order_id}>
            <div className="detail-header">
              <b>Order Detail</b>
              <button className="detail-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            {/* ★ TIMELINE ★ */}
            <TimelineBar stages={stages} currentStatus={selected.status} />

            <p className="detail-field"><b>ID:</b> {selected.order_id}</p>
            <p className="detail-field"><b>Type:</b> {selected.type}</p>
            <p className="detail-field"><b>Status:</b> {STATUS_LABEL[selected.status]}</p>
            <p className="detail-field">
              <b>{tab === "sale" ? "Customer" : "Supplier"}:</b> {getName(selected)}
            </p>
            <p className="detail-field">
              <b>Date:</b> {new Date(selected.created_at).toLocaleDateString("en-IN")}
            </p>
            {selected.notes && (
              <p className="detail-field"><b>Notes:</b> {selected.notes}</p>
            )}

            <div className="detail-products">
              <b>Products:</b>
              <ul>
                {(selected.products || []).map((p, i) => (
                  <li key={i}>{p.product_code} × {p.quantity}</li>
                ))}
              </ul>
            </div>

            {NEXT_STATUS[selected.status] && (
              <button
                className="detail-advance-btn"
                onClick={() => advance(selected)}
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