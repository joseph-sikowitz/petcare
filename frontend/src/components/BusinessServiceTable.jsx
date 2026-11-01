function BusinessServiceTable({
  services,
  deletingId,
  onEdit,
  onDelete,
}) {
  return (
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
                  <span
                    className={
                      service.isActive
                        ? "services-status active"
                        : "services-status inactive"
                    }
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="services-row-actions">
                    <button
                      className="services-btn services-btn-edit"
                      type="button"
                      onClick={() => onEdit(service)}
                    >
                      Edit
                    </button>

                    <button
                      className="services-btn services-btn-delete"
                      type="button"
                      onClick={() => onDelete(service)}
                      disabled={deletingId === service._id}
                    >
                      {deletingId === service._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {services.length === 0 && (
        <p className="services-empty">
          No services found. Add your first service!
        </p>
      )}
    </div>
  );
}

export default BusinessServiceTable;
