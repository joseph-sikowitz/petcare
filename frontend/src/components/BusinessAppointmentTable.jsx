/*
  Author: Thai Ken Yong
  November 2026

  Business Appointments - Appointment Table
*/

import PropTypes from "prop-types";

function BusinessAppointmentTable({
  appointments,
  deletingId,
  updatingId,
  onEdit,
  onCancelAppointment,
  onDelete,
}) {
  function formatDateTime(startTime) {
    return new Date(startTime).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="appointments-table-card">
      <div className="appointments-table-heading">
        <h2>Appointments</h2>
        <span>{appointments.length} appointments</span>
      </div>

      <div className="appointments-table-wrapper">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Date / Time</th>
              <th>Customer</th>
              <th>Pet</th>
              <th>Service</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="7" className="appointments-empty">
                  No appointments found for the selected filters.
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => {
                const isDeleting = deletingId === appointment._id;
                const isUpdating = updatingId === appointment._id;

                return (
                  <tr key={appointment._id}>
                    <td>{formatDateTime(appointment.startTime)}</td>

                    <td className="appointments-name">
                      {appointment.customerName || "Unknown customer"}
                    </td>

                    <td>{appointment.petName || "Unknown pet"}</td>

                    <td>{appointment.serviceName || "Unknown service"}</td>

                    <td>
                      {appointment.durationMinutes != null
                        ? `${appointment.durationMinutes} min`
                        : "—"}
                    </td>

                    <td>
                      <span
                        className={`appointments-status ${appointment.status}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </td>

                    <td>
                      <div className="appointments-row-actions">
                        <button
                          className="appointments-btn appointments-btn-edit"
                          type="button"
                          onClick={() => onEdit(appointment)}
                          disabled={isDeleting || isUpdating}
                        >
                          Edit
                        </button>

                        {appointment.status === "scheduled" && (
                          <button
                            className="appointments-btn appointments-btn-secondary"
                            type="button"
                            onClick={() => onCancelAppointment(appointment)}
                            disabled={isDeleting || isUpdating}
                          >
                            {isUpdating
                              ? "Cancelling..."
                              : "Cancel Appointment"}
                          </button>
                        )}

                        <button
                          className="appointments-btn appointments-btn-delete"
                          type="button"
                          onClick={() => onDelete(appointment)}
                          disabled={isDeleting || isUpdating}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

BusinessAppointmentTable.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      customerName: PropTypes.string,
      petName: PropTypes.string,
      serviceName: PropTypes.string,
      durationMinutes: PropTypes.number,
      status: PropTypes.oneOf(["scheduled", "completed", "cancelled"])
        .isRequired,
    }),
  ).isRequired,
  deletingId: PropTypes.string,
  updatingId: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onCancelAppointment: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BusinessAppointmentTable;
