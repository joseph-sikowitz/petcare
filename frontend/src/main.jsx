import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import UserLogin from "./components/UserLogin.jsx";
import BusinessDashboard from "./pages/BusinessDashboard.jsx";
import BusinessServices from "./pages/BusinessServices.jsx";
import BusinessAppointments from "./pages/BusinessAppointments.jsx";
import BusinessServiceViewOnly from "./pages/BusinessServiceViewOnly.jsx";

import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/services" element={<BusinessServiceViewOnly />} />
          <Route path="/business/dashboard" element={<BusinessDashboard />} />
          <Route path="/business" element={<BusinessDashboard />} />
          <Route path="/business/services" element={<BusinessServices />} />
          <Route
            path="/business/appointments"
            element={<BusinessAppointments />}
          />
        </Routes>
      </App>
    </BrowserRouter>
  </StrictMode>,
);
