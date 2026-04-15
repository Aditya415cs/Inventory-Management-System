import React, { useEffect, useState } from "react";
import "../styles/UIAccessibility.css";
import { supabase } from "../supabaseClient";

const UIAccessibility = () => {
  const [prediction, setPrediction] = useState(null);
  const [systemsNeeded, setSystemsNeeded] = useState(0);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false); // ✅ NEW

  const PRICE_PER_SYSTEM = 1000;

  const MATERIAL_PER_SYSTEM = {
    aluminum: 2,
    steel: 1,
    plastic: 0.5,
  };

  // 🔹 Load Prediction + Materials
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8001/predict-auto");
        const data = await res.json();

        const predictedRevenue = data.prediction;
        setPrediction(predictedRevenue);

        const systems = Math.ceil(predictedRevenue / PRICE_PER_SYSTEM);
        setSystemsNeeded(systems);

        const materials = [
          { name: "Aluminum", qty: systems * MATERIAL_PER_SYSTEM.aluminum },
          { name: "Steel", qty: systems * MATERIAL_PER_SYSTEM.steel },
          { name: "Plastic", qty: systems * MATERIAL_PER_SYSTEM.plastic },
        ];

        setRawMaterials(materials);

        fetchOrders();

      } catch (err) {
        console.error("Prediction Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 🔹 Fetch Orders
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("raw_material_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch Orders Error:", error);
      return;
    }

    setOrders(data);
  };

  // 🔥 CONFIRM ORDER (FIXED)
  const handleConfirmOrder = async () => {
    try {
      const { data: dbMaterials, error: matError } = await supabase
        .from("raw_materials")
        .select("*");

      if (matError) {
        console.error(matError);
        alert("❌ Failed to fetch material data");
        return;
      }

      let totalCost = 0;

      const materialsPayload = rawMaterials
        .map((mat) => {
          const dbMat = dbMaterials.find(
            (m) =>
              m.name.trim().toLowerCase() ===
              mat.name.trim().toLowerCase()
          );

          if (!dbMat) {
            console.warn("❌ Material not found:", mat.name);
            return null;
          }

          const cost = mat.qty * dbMat.cost_per_kg;
          totalCost += cost;

          return {
            name: mat.name,
            qty: mat.qty,
            cost_per_kg: dbMat.cost_per_kg,
          };
        })
        .filter(Boolean);

      if (materialsPayload.length === 0) {
        alert("❌ No materials matched DB");
        return;
      }

      const { error } = await supabase
        .from("raw_material_orders")
        .insert([
          {
            supplier_id: "SUPP001",
            materials: materialsPayload,
            total_cost: totalCost,
            status: "quotation",
          },
        ]);

      if (error) {
        console.error("INSERT ERROR:", error);
        alert("❌ " + error.message);
        return;
      }

      alert("✅ Purchase Order Created!");
      setOrderPlaced(true); // ✅ hide button
      fetchOrders();

    } catch (err) {
      console.error("Full Error:", err);
      alert("❌ Failed to create order");
    }
  };

  return (
    <div className="ui-container">
      <h1>AI Raw Material Planner</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Prediction */}
          <div className="card">
            <h3>Predicted Revenue (Next 7 Days)</h3>
            <p>₹ {prediction?.toLocaleString()}</p>
          </div>

          {/* Systems */}
          <div className="card">
            <h3>Systems Needed</h3>
            <p>{systemsNeeded}</p>
          </div>

          {/* Materials */}
          <div className="card">
            <h3>Required Raw Materials</h3>
            {rawMaterials.map((mat, i) => (
              <p key={i}>
                {mat.name} : {mat.qty} kg
              </p>
            ))}
          </div>

          {/* ✅ BUTTON FIX */}
          {!orderPlaced && (
            <button onClick={handleConfirmOrder} className="confirm-btn">
              Confirm Raw Material Order
            </button>
          )}

          {orderPlaced && (
            <p style={{ color: "green", marginTop: "10px" }}>
              ✅ Order already placed
            </p>
          )}

          {/* 🔥 TIMELINE */}
          <div className="card">
            <h3>Order Timeline</h3>

            {orders.length === 0 ? (
              <p>No orders yet</p>
            ) : (
              orders.map((order) => (
                <div key={order.order_id} className="timeline-item">
                  <p><b>Supplier:</b> {order.supplier_id}</p>
                  <p><b>Status:</b> {order.status}</p>
                  <p><b>Total Cost:</b> ₹ {order.total_cost}</p>
                  <p><b>Date:</b> {new Date(order.created_at).toLocaleString()}</p>

                  {order.materials?.map((m, idx) => (
                    <p key={idx}>
                      → {m.name} ({m.qty} kg @ ₹{m.cost_per_kg}/kg)
                    </p>
                  ))}

                  <hr />
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UIAccessibility;