import { Routes, Route } from "react-router-dom";
import Landing from "./landingpage.jsx";
import App from "./App.tsx";
import Customer from "./customers/customer.jsx";
import Supplier from "./raw material supplier/Supplier.jsx";

const MainApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app/*" element={<App />} />
      <Route path="/customers" element={<Customer />} />
      <Route path="/suppliers" element={<Supplier />} />
    </Routes>
  );
};

export default MainApp;