/*
  Author: Joseph Sikowitz
  November 2026

  User edit modal
*/

import { useState } from "react";
import PropTypes from "prop-types";

import { useUser } from "../context/UserContext.jsx";
import "./PetAddModal.css";
import ErrorMessage from "./ErrorMessage.jsx";

const PETS_API_URL = "/api/pets";

export default function PetAddModal({ title, message, onCancel, setPets }) {
  const user = useUser();

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    medicines: "",
    birthdate: "",
    user_id: user._id,
  });
  const [showError, setShowError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setShowError("");

      if (!formData.user_id) throw new Error("User ID required to create pet.");

      const payload = {
        ...formData,
        medicines: formData.medicines
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean),
      };

      if (payload.birthdate === "Invalid Date") {
        payload.birthdate = new Date();
      }

      const res = await fetch(`${PETS_API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Could not create new pet.");
      }
      const createdPet = await res.json();
      setPets((prev) => [...prev, createdPet]);
      onCancel();
    } catch (error) {
      console.error(error.message);
      setShowError(error.message);
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
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="modal-field">
              <label htmlFor="species">Species</label>
              <input
                id="species"
                name="species"
                type="text"
                value={formData.species}
                onChange={handleChange}
                required
              />
            </div>

            <div className="modal-field">
              <label htmlFor="breed">Breed</label>
              <input
                id="breed"
                name="breed"
                type="text"
                value={formData.breed}
                onChange={handleChange}
                required
              />
            </div>

            <div className="modal-field">
              <label htmlFor="medicines">
                Medicines (comma separated list)
              </label>
              <input
                id="medicines"
                name="medicines"
                type="text"
                value={formData.medicines}
                onChange={handleChange}
              />
            </div>

            <div className="modal-field">
              <label htmlFor="birthdate">Birthdate</label>
              <input
                id="birthdate"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleChange}
              />
            </div>
          </div>
          {showError && <ErrorMessage msg={{ msg: showError }} />}
          <div className="modal-actions">
            <button type="submit">Confirm</button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

PetAddModal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  setPets: PropTypes.func.isRequired,
};
