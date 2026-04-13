import { Routes, Route } from "react-router-dom";
import Landing from "./landingpage.jsx";
import App from "./App"; // your dashboard app
import Customer from "./customers/customer";
import Supplier from "./raw material supplier/Supplier";

<Route path="/customer" element={<Customer />} />
const MainApp = () => {
  return (
    <Routes>

      {/* Landing page */}
      <Route path="/" element={<Landing />} />

      {/* After login → full app */}
      <Route path="/app/*" element={<App />} />
      
      <Route path="/customers" element={<Customer />} />

      <Route path="/raw material supplier" element={<Supplier />} />
    </Routes>
  );
};

export default MainApp;