import "./landingpage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Landing = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
const [mode, setMode] = useState("signin");

const openModal = (type) => {
  setMode(type);
  setShowModal(true);
};

const handleSubmit = (e) => {
  e.preventDefault();
  navigate("/app");
};

  return (
    <div className="landing">
      {/* Hero Section */}
      <div className="hero">
        <h1>Smart Inventory & Supply Chain System</h1>
        <p>Manage raw materials, manufacturing, and sales in one platform</p>
      </div>

      {/* Role Selection */}
      <div className="roles">
        {/* Admin */}
        <div className="role-card">
          <h2>🏢 Admin Company</h2>
          <p>Manage inventory, orders, and analytics</p>

          <button onClick={() => openModal("signup")}>Sign Up</button>
          <button onClick={() => openModal("signin")}>Sign In</button>
        </div>

        {/* Manufacturer */}
        <div className="role-card">
          <h2>🏭 Manufacturer</h2>
          <p>Supply raw materials and manage deliveries</p>

          <button onClick={() => navigate("/signup/manufacturer")}>
            Sign Up
          </button>

          <button onClick={() => navigate("/signin/manufacturer")}>
            Sign In
          </button>
        </div>

        {/* Customer */}
        <div className="role-card">
          <h2>🛒 Customer</h2>
          <p>Buy products from the company</p>

          <button onClick={() => navigate("/signup/customer")}>Sign Up</button>

          <button onClick={() => navigate("/signin/customer")}>Sign In</button>
        </div>
      </div>
      {showModal && (
  <div className="modal-overlay">
    <div className="modal">

      <h2>{mode === "signin" ? "Sign In" : "Sign Up"}</h2>

      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />

        <button type="submit">
          {mode === "signin" ? "Login" : "Create Account"}
        </button>
      </form>

      <button
        className="close-btn"
        onClick={() => setShowModal(false)}
      >
        ✖
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Landing;
