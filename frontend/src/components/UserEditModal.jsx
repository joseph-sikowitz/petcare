import { useState } from "react";

import { useUser } from "../context/UserContext.jsx";
import "./UserEditModal.css";

const USERS_API_URL = "/api/users";

export default function UserEditModal({ title, message, onCancel }) {
  const user = useUser();

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    businessName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
    owner: false,
  })

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()} // clicks inside don't close it
      >
        <h2>{title}</h2>
        <p>{message}</p>
        <form method="POST" action="/api/auth/register">
        <div className="userregister-form-grid">
          <div className="userregister-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="userregister-field">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter first name"
              required
            />
          </div>

            <div className="userregister-field">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter last name"
              required
            />
            </div>

            <div className="userregister-field">
            <label htmlFor="businessName">Business Name</label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              placeholder="Enter business name"
            />
            </div>

            <div className="userregister-field">
            <label htmlFor="addressLine1">Address Line 1</label>
            <input
              id="addressLine1"
              name="addressLine1"
              type="text"
              placeholder="Enter address line 1"
            />
            </div>

            <div className="userregister-field">
            <label htmlFor="addressLine2">Address Line 2</label>
            <input
              id="addressLine2"
              name="addressLine2"
              type="text"
              placeholder="Enter address line 2"
            />
            </div>

            <div className="userregister-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Enter city"
            />
            </div>

            <div className="userregister-field">
            <label htmlFor="state">State</label>
            <input
              id="state"
              name="state"
              type="text"
              placeholder="Enter state"
            />
            </div>

            <div className="userregister-field">
            <label htmlFor="zipCode">Zipcode</label>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{5}"
              maxLength={5}
              autoComplete="postal-code"
              placeholder="Enter zipcode"
            />
            </div>

            <div className="userregister-field">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="Enter phone number"
            />
            </div>

            <div className="userregister-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="text"
              placeholder="Enter email"
              required
            />
            </div>

            <div className="userregister-field">
            <label htmlFor="owner">Business owner</label>
            <input
              id="owner"
              name="owner"
              type="checkbox"
            />
            </div>

          <div className="userregister-form-actions">
            <button
              className="userregister-btn userregister-btn-primary"
              type="submit"
            >
              Register
            </button>
          </div>
        </div>
      </form>
        <div className="modal-actions">
          <button type="button">Confirm</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}