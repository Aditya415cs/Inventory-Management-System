import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Landing from "./landingpage.jsx";
import Dashboard from "./Dashboard.tsx";
import Inventory from "./pages/Inventory.tsx";
import OrderProcessing from "./pages/OrderProcessing.tsx";
import Manufacturing from "./pages/Manufacturing.tsx";
import Reporting from "./pages/Reporting.jsx";
import UIAccessibility from "./pages/UIAccessibility.jsx";

const NAV_ITEMS = [
  { path: "/app",                icon: "📊", label: "Dashboard" },
  { path: "/app/inventory",      icon: "📦", label: "Inventory" },
  { path: "/app/order-processing", icon: "🚚", label: "Orders" },
  { path: "/app/manufacturing",  icon: "🏭", label: "Manufacturing" },
  { path: "/app/reporting",      icon: "📈", label: "Reports" },
  { path: "/app/ui-accessibility", icon: "📉", label: "Sales Tracker" },
];

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand" onClick={() => navigate("/app")}>
          <span className="sidebar-brand-icon">📦</span>
          <span className="sidebar-brand-text">IMS</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <span className="sidebar-version">v1.0</span>
        </div>
      </aside>
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