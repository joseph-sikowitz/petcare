import { useState } from "react";

import { useUser, useSetUser } from "../context/UserContext.jsx";
import "./UserEditModal.css";

const USERS_API_URL = "/api/users";

export default function UserEditModal({ title, message, onCancel }) {
  const user = useUser();
  const setUser = useSetUser();

  const [formData, setFormData] = useState({
    username: user.username || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    businessName: user.businessName || "",
    addressLine1: user.addressLine1 || "",
    addressLine2: user.addressLine2 || "",
    city: user.city || "",
    state: user.state || "",
    zipCode: user.zipCode || "",
    phoneNumber: user.phoneNumber || "",
    email: user.email || "",
    owner: user.owner || false,
  });
  const [isOwner, setIsOwner] = useState(Boolean(user.owner));

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value}));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const editResponse = await fetch(`${USERS_API_URL}/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(formData),
      })

      if (!editResponse.ok) {
        throw new Error ("Could not update profile");
      }
      
      const getUserResponse = await fetch(`${USERS_API_URL}/${user._id}`);
      const updatedUser = await getUserResponse.json()
      setUser(updatedUser);
      onCancel();
    } catch (error) {
        console.error(error.message);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{title}</h2>
        <p>{message}</p>
        <form onSubmit={handleSubmit}>
        <div className="modal-form-grid">
          <div className="modal-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-field">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              defaultValue={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

            <div className="modal-field">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              defaultValue={formData.lastName}
              onChange={handleChange}
              required
            />
            </div>

            <div className="modal-field">
            <label htmlFor="businessName">Business Name</label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              defaultValue={formData.businessName}
              onChange={handleChange}
            />
            </div>

            <div className="modal-field">
            <label htmlFor="addressLine1">Address Line 1</label>
            <input
              id="addressLine1"
              name="addressLine1"
              type="text"
              defaultValue={formData.addressLine1}
              onChange={handleChange}
            />
            </div>

            <div className="modal-field">
            <label htmlFor="addressLine2">Address Line 2</label>
            <input
              id="addressLine2"
              name="addressLine2"
              type="text"
              defaultValue={formData.addressLine2}
              onChange={handleChange}
            />
            </div>

            <div className="modal-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              defaultValue={formData.city}
              onChange={handleChange}
            />
            </div>

            <div className="modal-field">
            <label htmlFor="state">State</label>
            <input
              id="state"
              name="state"
              type="text"
              defaultValue={formData.state}
              onChange={handleChange}
            />
            </div>

            <div className="modal-field">
            <label htmlFor="zipCode">Zipcode</label>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{5}"
              maxLength={5}
              autoComplete="postal-code"
              defaultValue={formData.zipCode}
              onChange={handleChange}
            />
            </div>

            <div className="modal-field">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              defaultValue={formData.phoneNumber}
              onChange={handleChange}
            />
            </div>

            <div className="modal-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="text"
              defaultValue={formData.email}
              onChange={handleChange}
            />
            </div>

            <div className="modal-field">
            <label htmlFor="owner">Business owner</label>
            <input
              id="owner"
              name="owner"
              type="checkbox"
              checked={isOwner}
              onChange={(event) => setIsOwner(event.target.checked)}
            />
            </div>
        </div>
        <div className="modal-actions">
          <button type="submit">Confirm</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      </div>
    </div>
  );
}