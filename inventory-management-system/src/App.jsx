import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

// Pages
import Inventory from "./pages/Inventory";
import OrderProcessing from "./pages/OrderProcessing";
import Manufacturing from "./pages/Manufacturing";
import Reporting from "./pages/Reporting";
import UIAccessibility from "./pages/UIAccessibility";

// Home with buttons
function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <button onClick={() => navigate("/inventory")}>Inventory</button>
      <br /><br />

      <button onClick={() => navigate("/order-processing")}>Order Processing</button>
      <br /><br />

      <button onClick={() => navigate("/manufacturing")}>Manufacturing</button>
      <br /><br />

      <button onClick={() => navigate("/reporting")}>Reporting</button>
      <br /><br />

      <button onClick={() => navigate("/ui-accessibility")}>UI Accessibility</button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/order-processing" element={<OrderProcessing />} />
        <Route path="/manufacturing" element={<Manufacturing />} />
        <Route path="/reporting" element={<Reporting />} />
        <Route path="/ui-accessibility" element={<UIAccessibility />} />
      </Routes>
    </Router>
  );
}

export default App;