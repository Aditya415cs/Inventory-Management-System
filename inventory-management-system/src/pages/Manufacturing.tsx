import { useState, useEffect } from "react";
import { manufacturingApi, productsApi, Batch, Product } from "../api";
import "../styles/Manufacturing.css";

const STATUS_COLOR: Record<string, string> = {
  in_progress: "#f59e0b",
  completed:   "#22c55e",
  planned:     "#60a5fa",
};

export default function Manufacturing() {
  const [batches,  setBatches]  = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [selected, setSelected] = useState<Batch | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const [b, p] = await Promise.all([
        manufacturingApi.getAll(),
        productsApi.getAll(),
      ]);
      setBatches(b);
      setProducts(p);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleComplete = async (batch: Batch) => {
    if (!window.confirm(`Mark batch ${batch.batch_number} as completed? This will add output stock.`)) return;
    try {
      await manufacturingApi.complete(batch.batch_number);
      await load();
      if (selected?.batch_number === batch.batch_number) setSelected({ ...batch, status: "completed" });
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  if (loading) return <div className="manufacturing-container"><p>Loading batches…</p></div>;
  if (error)   return <div className="manufacturing-container"><p style={{color:"red"}}>Error: {error}</p></div>;

  const inProgress = batches.filter(b => b.status === "in_progress").length;
  const completed  = batches.filter(b => b.status === "completed").length;

  return (
    <div className="manufacturing-container">
      <h1>Manufacturing — WIP Tracking</h1>

      {/* Stats */}
      <div style={{display:"flex", gap:12, marginBottom:20}}>
        <div className="batch" style={{flex:1, textAlign:"center"}}>
          <p style={{color:"#94a3b8", fontSize:"0.8rem"}}>Total Batches</p>
          <p style={{fontSize:"1.5rem", fontWeight:700}}>{batches.length}</p>
        </div>
        <div className="batch" style={{flex:1, textAlign:"center"}}>
          <p style={{color:"#94a3b8", fontSize:"0.8rem"}}>In Progress</p>
          <p style={{fontSize:"1.5rem", fontWeight:700, color:"#f59e0b"}}>{inProgress}</p>
        </div>
        <div className="batch" style={{flex:1, textAlign:"center"}}>
          <p style={{color:"#94a3b8", fontSize:"0.8rem"}}>Completed</p>
          <p style={{fontSize:"1.5rem", fontWeight:700, color:"#22c55e"}}>{completed}</p>
        </div>
      </div>

      {/* Master / Detail */}
      <div style={{display:"flex", gap:16}}>

        {/* Batch list */}
        <div style={{flex:1, display:"flex", flexDirection:"column", gap:10}}>
          {batches.length === 0
            ? <p style={{color:"#94a3b8"}}>No batches yet.</p>
            : batches.map(b => (
              <div
                key={b.batch_number}
                className="batch"
                onClick={() => setSelected(b)}
                style={{
                  cursor:"pointer",
                  border: selected?.batch_number === b.batch_number ? "1px solid #3b82f6" : "1px solid transparent",
                  background: selected?.batch_number === b.batch_number ? "#1e3a5f" : "#222",
                }}
              >
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <h3>#{b.batch_number}</h3>
                  <span style={{color: STATUS_COLOR[b.status] || "#fff", fontSize:"0.78rem", fontWeight:700}}>
                    {b.status.replace("_"," ").toUpperCase()}
                  </span>
                </div>
                <p style={{fontSize:"0.8rem", color:"#64748b", margin:"4px 0 10px"}}>
                  Started: {b.start_date ? new Date(b.start_date).toLocaleDateString("en-IN") : "—"}
                </p>
                {b.status === "in_progress" && (
                  <button
                    onClick={e => { e.stopPropagation(); handleComplete(b); }}
                    style={{background:"#14532d", color:"#86efac", border:"1px solid #16a34a",
                      padding:"4px 12px", borderRadius:6, cursor:"pointer", fontSize:"0.8rem"}}
                  >
                    ✓ Mark Complete
                  </button>
                )}
              </div>
            ))
          }
        </div>

        {/* Detail pane */}
        {selected && (
          <div style={{width:270, background:"#222", borderRadius:10, padding:16, fontSize:"0.88rem", lineHeight:1.9}}>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:12}}>
              <b>Batch #{selected.batch_number}</b>
              <button onClick={() => setSelected(null)} style={{background:"none", border:"none", color:"#94a3b8", cursor:"pointer"}}>✕</button>
            </div>
            <p><b>Status:</b> <span style={{color: STATUS_COLOR[selected.status] || "#fff"}}>{selected.status.replace("_"," ").toUpperCase()}</span></p>
            <p><b>Start:</b> {selected.start_date ? new Date(selected.start_date).toLocaleDateString("en-IN") : "—"}</p>
            <p><b>End:</b>   {selected.end_date   ? new Date(selected.end_date).toLocaleDateString("en-IN")   : "—"}</p>
            {selected.notes && <p><b>Notes:</b> {selected.notes}</p>}
            <div style={{marginTop:10}}>
              <b>Raw Materials:</b>
              <ul style={{paddingLeft:16, marginTop:4}}>
                {(selected.raw_materials || []).map((r, i) => (
                  <li key={i} style={{fontSize:"0.82rem"}}>{r.product_code} × {r.quantity}</li>
                ))}
              </ul>
            </div>
            <div style={{marginTop:10}}>
              <b>Output:</b>
              <ul style={{paddingLeft:16, marginTop:4}}>
                {(selected.output || []).map((o, i) => (
                  <li key={i} style={{fontSize:"0.82rem"}}>{o.product_code} × {o.quantity}</li>
                ))}
              </ul>
            </div>
            {selected.status === "in_progress" && (
              <button
                onClick={() => handleComplete(selected)}
                style={{marginTop:12, background:"#14532d", color:"#86efac",
                  border:"1px solid #16a34a", borderRadius:6, padding:"6px 14px", cursor:"pointer"}}
              >
                ✓ Mark Complete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}