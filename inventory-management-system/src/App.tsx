import { Routes, Route, useNavigate } from "react-router-dom";
import Landing from "./landingpage.jsx";
import Dashboard from "./Dashboard.tsx";
import Inventory from "./pages/Inventory.tsx";
import OrderProcessing from "./pages/OrderProcessing.tsx";
import Manufacturing from "./pages/Manufacturing.tsx";
import Reporting from "./pages/Reporting.jsx";
import UIAccessibility from "./pages/UIAccessibility.jsx";

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="layout">
      <div className="sidebar">
        <h2>📦 IMS</h2>
        <button onClick={() => navigate("/app")}>Dashboard</button>
        <button onClick={() => navigate("/app/inventory")}>Inventory</button>
        <button onClick={() => navigate("/app/order-processing")}>Orders</button>
        <button onClick={() => navigate("/app/manufacturing")}>Manufacturing</button>
        <button onClick={() => navigate("/app/reporting")}>Reports</button>
        <button onClick={() => navigate("/app/ui-accessibility")}>UI</button>
      </div>
      <div className="main">{children}</div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
      <Route path="/order-processing" element={<Layout><OrderProcessing /></Layout>} />
      <Route path="/manufacturing" element={<Layout><Manufacturing /></Layout>} />
      <Route path="/reporting" element={<Layout><Reporting /></Layout>} />
      <Route path="/ui-accessibility" element={<Layout><UIAccessibility /></Layout>} />
    </Routes>
  );
}

export default App;