import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import App from "./App.jsx";
import UserLogin from "./components/UserLogin.jsx";
import BusinessDashboard from "./pages/BusinessDashboard.jsx";
import BusinessServices from "./pages/BusinessServices.jsx";

import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<UserLogin />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/business" element={<BusinessDashboard />} />
          <Route path="/business/services" element={<BusinessServices />} />
        </Routes>
      </App>
    </BrowserRouter>
  </StrictMode>,
);
