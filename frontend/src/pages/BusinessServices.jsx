/*
  Author: Thai Ken Yong
  November 2026

  Business Services - Business Services Page
*/

import { useEffect, useState } from "react";
import BusinessServiceForm from "../components/BusinessServiceForm.jsx";
import BusinessServiceTable from "../components/BusinessServiceTable.jsx";
import "./BusinessServices.css";

const API_URL = "/api/business/services";
const emptyForm = {
  name: "",
  description: "",
  price: "",
  durationMinutes: "",
  isActive: true,
};

function BusinessServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function fetchServices() {
    try {
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Unexpected services response");
      }
      setServices(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  // Fetch services from the backend API when the component mounts
  useEffect(() => {
    async function loadServices() {
      await fetchServices();
    }

    loadServices();
  }, []);

  function handleAdd() {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setShowForm(true);
    setError("");
    setMessage("");
  }

  function handleEdit(service) {
    setEditingId(service._id);
    setFormData({
      name: service.name,
      description: service.description,
      price: String(service.price),
      durationMinutes: String(service.durationMinutes),
      isActive: service.isActive,
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
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const serviceData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      durationMinutes: Number(formData.durationMinutes),
      isActive: formData.isActive,
    };

    if (!serviceData.name || !serviceData.description) {
      setError("Please enter a name and description.");
      return;
    }
    if (
      formData.price === "" ||
      !Number.isFinite(serviceData.price) ||
      serviceData.price < 0
    ) {
      setError("Please enter a valid price.");
      return;
    }
    if (
      formData.durationMinutes === "" ||
      !Number.isInteger(serviceData.durationMinutes) ||
      serviceData.durationMinutes <= 0
    ) {
      setError("Please enter a positive whole number of minutes.");
      return;
    }

    const isEditing = editingId !== null;
    try {
      setSaving(true);
      setError("");
      setMessage("");
      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceData),
        },
      );
      if (!response.ok) {
        throw new Error(
          isEditing ? "Failed to update service." : "Failed to create service.",
        );
      }
      handleCancel();
      const refreshed = await fetchServices();
      if (refreshed) {
        setMessage(
          isEditing
            ? "Service updated successfully."
            : "Service created successfully.",
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(service) {
    if (!window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
      return;
    }
    try {
      setDeletingId(service._id);
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/${service._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete service.");
      }
      const refreshed = await fetchServices();
      if (refreshed) {
        setMessage("Service deleted successfully.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <p>Loading services...</p>;
  }

  return (
    <section className="business-services">
      <div className="services-header">
        <div>
          <h1>Manage Services</h1>
          <p>Add, update, and manage the services offered by your business.</p>
        </div>
        <button
          className="services-btn services-btn-primary"
          type="button"
          onClick={handleAdd}
        >
          + Add Service
        </button>
      </div>

      {error && (
        <p className="services-alert services-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="services-alert services-success" role="status">
          {message}
        </p>
      )}

      {showForm && (
        <BusinessServiceForm
          editingId={editingId}
          formData={formData}
          saving={saving}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <BusinessServiceTable
        services={services}
        deletingId={deletingId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </section>
  );
}

export default BusinessServices;
