import { Routes, Route } from "react-router-dom";
import Landing from "./landingpage.jsx";
import App from "./App"; // your dashboard app

const MainApp = () => {
  return (
    <Routes>

      {/* Landing page */}
      <Route path="/" element={<Landing />} />

      {/* After login → full app */}
      <Route path="/app/*" element={<App />} />

    </Routes>
  );
};

export default MainApp;