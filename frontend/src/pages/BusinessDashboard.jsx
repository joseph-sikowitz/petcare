/*
  Author: Thai Ken Yong
  November 2026

  Business Dashboard - Business after login landing page
*/

import { Navigate } from "react-router";
import { useUser } from "../context/UserContext.jsx";
import "./BusinessDashboard.css";

export default function BusinessDashboard() {
  const user = useUser();

  if (user === undefined) {
    return <p>Checking authentication...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.owner !== true) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="business-dashboard">
      <h1>Welcome, Employee!</h1>

      <div className="dashboard-actions">
        <a href="/business/appointments">Manage Appointments</a>
        <a href="/business/services">Manage Services</a>
      </div>
    </section>
  );
}
