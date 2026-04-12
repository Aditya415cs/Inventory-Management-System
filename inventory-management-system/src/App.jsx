import { Routes, Route, useNavigate } from "react-router-dom";


// Pages
import Dashboard from "./Dashboard";
import Inventory from "./pages/Inventory";
import OrderProcessing from "./pages/OrderProcessing";
import Manufacturing from "./pages/Manufacturing";
import Reporting from "./pages/Reporting";
import UIAccessibility from "./pages/UIAccessibility";

// 🔥 Layout with Sidebar (stays on all pages)
function Layout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="layout">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>📦 IMS</h2>

        <button onClick={() => navigate("/")}>Dashboard</button>
        <button onClick={() => navigate("/inventory")}>Inventory</button>
        <button onClick={() => navigate("/order-processing")}>Orders</button>
        <button onClick={() => navigate("/manufacturing")}>Manufacturing</button>
        <button onClick={() => navigate("/reporting")}>Reports</button>
        <button onClick={() => navigate("/ui-accessibility")}>UI</button>
      </div>

      {/* Main Content */}
      <div className="main">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />

      {/* Inventory */}
      <Route
        path="/inventory"
        element={
          <Layout>
            <Inventory />
          </Layout>
        }
      />

      {/* Orders */}
      <Route
        path="/order-processing"
        element={
          <Layout>
            <OrderProcessing />
          </Layout>
        }
      />

      {/* Manufacturing */}
      <Route
        path="/manufacturing"
        element={
          <Layout>
            <Manufacturing />
          </Layout>
        }
      />

      {/* Reporting */}
      <Route
        path="/reporting"
        element={
          <Layout>
            <Reporting />
          </Layout>
        }
      />

      {/* UI Page */}
      <Route
        path="/ui-accessibility"
        element={
          <Layout>
            <UIAccessibility />
          </Layout>
        }
      />

    </Routes>
  );
}

export default App;