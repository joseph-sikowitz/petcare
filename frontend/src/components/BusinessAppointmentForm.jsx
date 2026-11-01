/*
  Author: Thai Ken Yong
  November 2026

  Business Appointments - Create and Edit Form
*/

import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function BusinessAppointmentForm({
  editingId,
  formData,
  customerName,
  services,
  saving,
  onChange,
  onSubmit,
  onCancel,
}) {
  const [customerSearch, setCustomerSearch] = useState(customerName || "");
  const [customers, setCustomers] = useState([]);
  const [pets, setPets] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loadingPets, setLoadingPets] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lookupError, setLookupError] = useState("");

  // Search customers when the employee types a name.
  useEffect(() => {
    if (!customerSearch.trim() || !showResults) {
      return;
    }

    const controller = new AbortController();

    async function searchCustomers() {
      try {
        setSearching(true);
        setLookupError("");

        const response = await fetch(
          `/api/business/appointments/customers?search=${encodeURIComponent(customerSearch.trim())}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to search customers.");
        }

        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setLookupError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearching(false);
        }
      }
    }

    const timeout = setTimeout(searchCustomers, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [customerSearch, showResults]);

  // Load only pets belonging to the selected customer.
  useEffect(() => {
    if (!formData.user_id) {
      return;
    }

    const controller = new AbortController();

    async function fetchPets() {
      try {
        setLoadingPets(true);
        setLookupError("");

        const response = await fetch(
          `/api/business/appointments/customers/${formData.user_id}/pets`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to load customer pets.");
        }

        const data = await response.json();
        setPets(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setLookupError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingPets(false);
        }
      }
    }

    fetchPets();

    return () => controller.abort();
  }, [formData.user_id]);

  function handleCustomerSearch(event) {
    const value = event.target.value;

    setCustomerSearch(value);
    setCustomers([]);
    setPets([]);
    setShowResults(true);

    // Clear the previous customer and pet selections.
    onChange({ target: { name: "user_id", value: "" } });
    onChange({ target: { name: "pet_id", value: "" } });
  }

  function handleSelectCustomer(customer) {
    const name = `${customer.firstName} ${customer.lastName}`;

    setCustomerSearch(name);
    setShowResults(false);
    setCustomers([]);
    setPets([]);

    onChange({ target: { name: "user_id", value: customer._id } });
    onChange({ target: { name: "pet_id", value: "" } });
  }

  const activeServices = services.filter(
    (service) => service.isActive || service._id === formData.service_id,
  );

  return (
    <div className="appointments-form-card">
      <h2>{editingId ? "Edit Appointment" : "New Appointment"}</h2>

      <form onSubmit={onSubmit}>
        <div className="appointments-form-grid">
          <div className="appointments-field">
            <label htmlFor="appointment-customer">Customer</label>
            <input
              id="appointment-customer"
              type="text"
              value={customerSearch}
              onChange={handleCustomerSearch}
              onFocus={() => {
                if (!formData.user_id && customerSearch.trim()) {
                  setShowResults(true);
                }
              }}
              placeholder="Search by customer name"
              autoComplete="off"
              required
            />

            {showResults && customerSearch.trim() && (
              <div className="appointments-search-results">
                {searching && <p>Searching...</p>}

                {!searching && customers.length === 0 && (
                  <p>No matching customers.</p>
                )}

                {!searching &&
                  customers.map((customer) => (
                    <button
                      className="appointments-search-option"
                      key={customer._id}
                      type="button"
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      {customer.firstName} {customer.lastName}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="appointments-field">
            <label htmlFor="appointment-pet">Pet</label>
            <select
              id="appointment-pet"
              name="pet_id"
              value={formData.pet_id}
              onChange={onChange}
              disabled={!formData.user_id || loadingPets}
              required
            >
              <option value="">
                {loadingPets ? "Loading pets..." : "Select a pet"}
              </option>
              {pets.map((pet) => (
                <option key={pet._id} value={pet._id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          <div className="appointments-field">
            <label htmlFor="appointment-service">Service</label>
            <select
              id="appointment-service"
              name="service_id"
              value={formData.service_id}
              onChange={onChange}
              required
            >
              <option value="">Select a service</option>
              {activeServices.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name} ({service.durationMinutes} min)
                </option>
              ))}
            </select>
          </div>

          <div className="appointments-field">
            <label htmlFor="appointment-date">Date</label>
            <input
              id="appointment-date"
              type="date"
              name="date"
              value={formData.date}
              onChange={onChange}
              required
            />
          </div>

          <div className="appointments-field">
            <label htmlFor="appointment-time">Time</label>
            <input
              id="appointment-time"
              type="time"
              name="time"
              value={formData.time}
              onChange={onChange}
              required
            />
          </div>

          {editingId && (
            <div className="appointments-field">
              <label htmlFor="appointment-status">Status</label>
              <select
                id="appointment-status"
                name="status"
                value={formData.status}
                onChange={onChange}
                required
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          <div className="appointments-field appointments-full-width">
            <label htmlFor="appointment-notes">Notes (Optional)</label>
            <textarea
              id="appointment-notes"
              name="notes"
              value={formData.notes}
              onChange={onChange}
              rows="3"
              placeholder="Additional appointment details"
            />
          </div>
        </div>

        {lookupError && (
          <p className="appointments-alert appointments-error" role="alert">
            {lookupError}
          </p>
        )}

        <div className="appointments-form-actions">
          <button
            className="appointments-btn appointments-btn-secondary"
            type="button"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className="appointments-btn appointments-btn-primary"
            type="submit"
            disabled={saving || !formData.user_id || !formData.pet_id}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Appointment"
                : "Create Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
}

BusinessAppointmentForm.propTypes = {
  editingId: PropTypes.string,
  customerName: PropTypes.string,
  formData: PropTypes.shape({
    user_id: PropTypes.string.isRequired,
    pet_id: PropTypes.string.isRequired,
    service_id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
  }).isRequired,
  services: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      durationMinutes: PropTypes.number.isRequired,
      isActive: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  saving: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default BusinessAppointmentForm;
