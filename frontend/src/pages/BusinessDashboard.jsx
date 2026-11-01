/*
  Author: Thai Ken Yong
  November 2026

  Business Dashboard - Business after login landing page
*/
import "./BusinessDashboard.css";

export default function BusinessDashboard() {
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