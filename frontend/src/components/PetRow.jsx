/*
  Author: Joseph Sikowitz
  November 2026

  PetRow component for PetTable
*/

import PropTypes from "prop-types";

import "./PetRow.css";

export default function PetRow({ pet, onEdit, onDelete }) {
  const {
    _id = null,
    name = null,
    species = null,
    breed = null,
    medicines = [],
    birthdate = null,
  } = pet;

  return (
    <tr className="petcare-card">
        <td>{name || "None"}</td>
        <td>{species || "None"}</td>
        <td>{breed || "None"}</td>
        <td>{medicines.length > 0 ? medicines.join(", ") : "None"}</td>
        <td>{birthdate ? new Date(birthdate).toLocaleDateString() : "None"}</td>
        <td>
          <div className="pets-row-actions">
            <button
              className="pets-btn pets-btn-edit"
              type="button"
              onClick={() => onEdit(_id)}
            >
              Edit
            </button>

            <button
              className="pets-btn pets-btn-delete"
              type="button"
              onClick={() => onDelete(_id)}
            >
              Delete
            </button>
          </div>
        </td>
    </tr>
  );
}

PetRow.propTypes = {
  pet: PropTypes.shape({
    name: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    breed: PropTypes.string.isRequired,
    medicines: PropTypes.arrayOf(
      PropTypes.string
    ),
    birthdate: PropTypes.string,
    user_id: PropTypes.string
  }),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};