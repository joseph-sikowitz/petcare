import "./BusinessDashboard.css";

export default function BusinessDashboard() {
  return (
    <section className="business-dashboard">
      <h1>Welcome, Employee!</h1>

      <div className="dashboard-actions">
        <a href="/business/appointments">Manage Appointments</a>
        <a href="/business/services">Manage Services</a>
      </div>

      <section className="weekly-appointments">
        <h2>This Week's Appointments</h2>
        <p>No appointments to display yet.</p>
      </section>
    </section>
  );
}
