import "./UserLoginForm.css";

export default function UserLoginForm({ onSubmit, onCancel, onChange }) {
  return (
    <div className="petcare-card userlogin-form-card">
      <h2>Enter login information</h2>

      <form onSubmit={onSubmit}>
        <div className="userlogin-form-grid">
          <div className="userlogin-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              onChange={onChange}
              required
            />
          </div>

          <div className="userlogin-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              onChange={onChange}
              required
            />
          </div>

          <div className="services-form-actions">
            <button
              className="services-btn services-btn-primary"
              type="submit"
            >
              Submit
            </button>

            <button
              className="services-btn services-btn-secondary"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
