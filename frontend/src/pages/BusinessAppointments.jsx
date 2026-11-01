/*
  Author: Thai Ken Yong
  November 2026

  Business Appointments - Manage Appointments Page
*/

import { useEffect, useState } from "react";
import BusinessAppointmentForm from "../components/BusinessAppointmentForm.jsx";
import BusinessAppointmentTable from "../components/BusinessAppointmentTable.jsx";
import "./BusinessAppointments.css";

const API_URL = "/api/business/appointments";
const SERVICES_URL = "/api/business/services";

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Calculate the selected day's boundaries in local time.
function getDateRange(date) {
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
}

const emptyForm = {
  user_id: "",
  pet_id: "",
  service_id: "",
  date: getToday(),
  time: "",
  status: "scheduled",
  notes: "",
};

function BusinessAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  async function fetchAppointments(
    date = selectedDate,
    status = selectedStatus,
  ) {
    try {
      setError("");

      const params = new URLSearchParams({
        date,
        ...getDateRange(date),
      });
      if (status) {
        params.set("status", status);
      }

      const response = await fetch(`${API_URL}?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch appointments.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected appointments response.");
      }

      setAppointments(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function fetchServices() {
    try {
      const response = await fetch(SERVICES_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch services.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected services response.");
      }

      setServices(data);
    } catch (err) {
      setError(err.message);
    }
  }

  // Fetch appointments whenever the selected date or status changes.
  useEffect(() => {
    async function loadAppointments() {
      try {
        const params = new URLSearchParams({
          date: selectedDate,
          ...getDateRange(selectedDate),
        });

        if (selectedStatus) {
          params.set("status", selectedStatus);
        }

        const response = await fetch(`${API_URL}?${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch appointments.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected appointments response.");
        }

        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, [selectedDate, selectedStatus]);

  // Load available services when the page opens.
  useEffect(() => {
    async function loadServices() {
      await fetchServices();
    }

    loadServices();
  }, []);

  function handleAdd() {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      date: selectedDate,
    });
    setShowForm(true);
    setError("");
    setMessage("");
  }

  function handleEdit(appointment) {
    const startTime = new Date(appointment.startTime);

    const year = startTime.getFullYear();
    const month = String(startTime.getMonth() + 1).padStart(2, "0");
    const day = String(startTime.getDate()).padStart(2, "0");
    const hours = String(startTime.getHours()).padStart(2, "0");
    const minutes = String(startTime.getMinutes()).padStart(2, "0");

    setEditingId(appointment._id);
    setFormData({
      user_id: appointment.user_id,
      pet_id: appointment.pet_id,
      service_id: appointment.service_id,
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`,
      status: appointment.status,
      notes: appointment.notes || "",
    });

    setShowForm(true);
    setError("");
    setMessage("");
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setFormData({ ...emptyForm });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.user_id ||
      !formData.pet_id ||
      !formData.service_id ||
      !formData.date ||
      !formData.time
    ) {
      setError("Please complete all required appointment fields.");
      return;
    }

    const startTime = new Date(
      `${formData.date}T${formData.time}:00`,
    ).toISOString();

    const appointmentData = {
      user_id: formData.user_id,
      pet_id: formData.pet_id,
      service_id: formData.service_id,
      startTime,
      notes: formData.notes.trim(),
    };

    const isEditing = editingId !== null;

    if (isEditing) {
      appointmentData.status = formData.status;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointmentData),
        },
      );

      if (!response.ok) {
        throw new Error(
          isEditing
            ? "Failed to update appointment."
            : "Failed to create appointment.",
        );
      }

      handleCancel();

      const refreshed = await fetchAppointments();

      if (refreshed) {
        setMessage(
          isEditing
            ? "Appointment updated successfully."
            : "Appointment created successfully.",
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCancelAppointment(appointment) {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setUpdatingId(appointment._id);
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/${appointment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: appointment.user_id,
          pet_id: appointment.pet_id,
          service_id: appointment.service_id,
          startTime: appointment.startTime,
          status: "cancelled",
          notes: appointment.notes || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel appointment.");
      }

      const refreshed = await fetchAppointments();

      if (refreshed) {
        setMessage("Appointment cancelled successfully.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(appointment) {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this appointment?",
      )
    ) {
      return;
    }

    try {
      setDeletingId(appointment._id);
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/${appointment._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete appointment.");
      }

      const refreshed = await fetchAppointments();

      if (refreshed) {
        setMessage("Appointment deleted successfully.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  return (
    <section className="business-appointments">
      <div className="appointments-header">
        <div>
          <h1>Manage Appointments</h1>
          <p>Create, update, and manage customer appointments.</p>
        </div>

        <button
          className="appointments-btn appointments-btn-primary"
          type="button"
          onClick={handleAdd}
        >
          + New Appointment
        </button>
      </div>

      {error && (
        <p className="appointments-alert appointments-error" role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className="appointments-alert appointments-success" role="status">
          {message}
        </p>
      )}

      {showForm && (
        <BusinessAppointmentForm
          key={editingId || "new"}
          editingId={editingId}
          formData={formData}
          customerName={
            appointments.find((appointment) => appointment._id === editingId)
              ?.customerName || ""
          }
          services={services}
          saving={saving}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <div className="appointments-filters">
        <div className="appointments-field">
          <label htmlFor="appointments-filter-date">Date</label>
          <input
            id="appointments-filter-date"
            type="date"
            value={selectedDate}
            onChange={(event) => {
              if (event.target.value) {
                setSelectedDate(event.target.value);
              }
            }}
          />
        </div>

        <div className="appointments-field">
          <label htmlFor="appointments-filter-status">Status</label>
          <select
            id="appointments-filter-status"
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <BusinessAppointmentTable
        appointments={appointments}
        deletingId={deletingId}
        updatingId={updatingId}
        onEdit={handleEdit}
        onCancelAppointment={handleCancelAppointment}
        onDelete={handleDelete}
      />
    </section>
  );
}

export default BusinessAppointments;
