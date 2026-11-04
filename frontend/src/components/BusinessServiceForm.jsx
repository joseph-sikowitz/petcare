/*
  Author: Thai Ken Yong
  November 2026

  Business Service Form
*/

import PropTypes from "prop-types";

function BusinessServiceForm({
  editingId,
  formData,
  saving,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="services-form-card">
      <h2>{editingId ? "Edit Service" : "Add New Service"}</h2>

      <form onSubmit={onSubmit}>
        <div className="services-form-grid">
          <div className="services-field">
            <label htmlFor="service-name">Service Name</label>
            <input
              id="service-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={onChange}
              required
            />
          </div>

          <div className="services-field">
            <label htmlFor="service-price">Price ($)</label>
            <input
              id="service-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={onChange}
              required
            />
          </div>

          <div className="services-field">
            <label htmlFor="service-duration">Duration (Minutes)</label>
            <input
              id="service-duration"
              name="durationMinutes"
              type="number"
              min="1"
              step="1"
              value={formData.durationMinutes}
              onChange={onChange}
              required
            />
          </div>

          <div className="services-field services-checkbox-field">
            <label htmlFor="service-active">
              <input
                id="service-active"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={onChange}
              />
              Active Service
            </label>
          </div>

          <div className="services-field services-full-width">
            <label htmlFor="service-description">Description</label>
            <textarea
              id="service-description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className="services-form-actions">
          <button
            className="services-btn services-btn-secondary"
            type="button"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className="services-btn services-btn-primary"
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Service"
                : "Create Service"}
          </button>
        </div>
      </form>
    </div>
  );
}

BusinessServiceForm.propTypes = {
  editingId: PropTypes.string,
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    durationMinutes: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    isActive: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  saving: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default BusinessServiceForm;
