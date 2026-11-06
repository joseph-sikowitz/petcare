/*
  Author: Joseph Sikowitz
  November 2026

  Pet edit modal
*/

import { useState } from "react";
//import PropTypes from "prop-types";

import "./PetEditModal.css";

const PETS_API_URL = "/api/pets";

export default function UserEditModal({ title, message, onCancel, pet, setPets }) {  
  const [formData, setFormData] = useState({
    name: pet.name || "",
    species: pet.species || "",
    breed: pet.breed || "",
    medicines: pet.medicines.join(", ") || "",
    birthdate: new Date(pet.birthdate).toISOString().split("T")[0] || "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value}));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const payload = {
        ...formData,
        medicines: formData.medicines
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean),
        birthdate: formData.birthdate || null
      }

      if (payload.birthdate === "Invalid Date") {
        payload.birthdate = new Date();
      }

      const res = await fetch(`${PETS_API_URL}/${pet._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error ("Could not update pet.");
      }

      const updatedPet = await res.json();
      
      setPets(prevPets => prevPets.map(p => p._id === pet._id ? { ...p, ...updatedPet } : p));
      onCancel();
    } catch (error) {
        console.error(error.message);
        //TODO: add error component
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
            <label htmlFor="medicines">Medicines (comma separated list)</label>
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
        <div className="modal-actions">
          <button type="submit">Confirm</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      </div>
    </div>
  );
}