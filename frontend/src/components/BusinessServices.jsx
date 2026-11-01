import { useEffect, useState } from "react";
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
  const [services, setServices] = useState([]); // State to hold the list of services
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(""); // State to hold any error messages
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
    fetchServices();
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
    if (formData.price === "" || !Number.isFinite(serviceData.price) || serviceData.price < 0) {
      setError("Please enter a valid price.");
      return;
    }
    if (formData.durationMinutes === "" || !Number.isInteger(serviceData.durationMinutes) || serviceData.durationMinutes <= 0) {
      setError("Please enter a positive whole number of minutes.");
      return;
    }

    const isEditing = editingId !== null;
    try {
      setSaving(true);
      setError("");
      setMessage("");
      const response = await fetch(isEditing ? `${API_URL}/${editingId}` : API_URL, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });
      if (!response.ok) {
        throw new Error(isEditing ? "Failed to update service." : "Failed to create service.");
      }
      handleCancel();
      const refreshed = await fetchServices();
      if (refreshed) {
        setMessage(isEditing ? "Service updated successfully." : "Service created successfully.");
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
      const response = await fetch(`${API_URL}/${service._id}`, { method: "DELETE" });
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
        <button className="services-btn services-btn-primary" type="button" onClick={handleAdd}>
          + Add Service
        </button>
      </div>

      {error && <p className="services-alert services-error" role="alert">{error}</p>}
      {message && <p className="services-alert services-success" role="status">{message}</p>}

      {showForm && (
        <div className="services-form-card">
          <h2>{editingId ? "Edit Service" : "Add New Service"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="services-form-grid">
              <div className="services-field">
                <label htmlFor="service-name">Service Name</label>
                <input id="service-name" name="name" type="text" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="services-field">
                <label htmlFor="service-price">Price ($)</label>
                <input id="service-price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="services-field">
                <label htmlFor="service-duration">Duration (Minutes)</label>
                <input id="service-duration" name="durationMinutes" type="number" min="1" step="1" value={formData.durationMinutes} onChange={handleChange} required />
              </div>
              <div className="services-field services-checkbox-field">
                <label htmlFor="service-active">
                  <input id="service-active" name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} />
                  Active Service
                </label>
              </div>
              <div className="services-field services-full-width">
                <label htmlFor="service-description">Description</label>
                <textarea id="service-description" name="description" rows="3" value={formData.description} onChange={handleChange} required />
              </div>
            </div>
            <div className="services-form-actions">
              <button className="services-btn services-btn-secondary" type="button" onClick={handleCancel} disabled={saving}>Cancel</button>
              <button className="services-btn services-btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Service" : "Create Service"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="services-table-card">
        <div className="services-table-heading">
          <h2>All Services</h2>
          <span>{services.length} services</span>
        </div>
        <div className="services-table-wrapper">
          <table className="services-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td className="services-name">{service.name}</td>
                  <td>{service.description}</td>
                  <td>${Number(service.price).toFixed(2)}</td>
                  <td>{service.durationMinutes} min</td>
                  <td>
                    <span className={service.isActive ? "services-status active" : "services-status inactive"}>
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="services-row-actions">
                      <button className="services-btn services-btn-edit" type="button" onClick={() => handleEdit(service)}>Edit</button>
                      <button className="services-btn services-btn-delete" type="button" onClick={() => handleDelete(service)} disabled={deletingId === service._id}>
                        {deletingId === service._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {services.length === 0 && <p className="services-empty">No services found. Add your first service!</p>}
      </div>
    </section>
  );
}

export default BusinessServices;
