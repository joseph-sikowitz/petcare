/*
  Author: Joseph Sikowitz
  November 2026

  PetTable component
*/

import { useState, useEffect } from "react";

import { useUser } from "../context/UserContext.jsx";
import PetRow from "./PetRow.jsx";
import PetAddModal from "./PetAddModal.jsx";

import "./PetTable.css";

const PETS_API_URL = "/api/pets";

export default function PetTable() {
  const user = useUser();
  const [pets, setPets] = useState(undefined);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!user?._id) return;
    let ignore = false;

    const fetchPets = async () => {
      try {
        const res = await fetch(`${PETS_API_URL}?user_id=${user._id}`);
        if (!res.ok) throw new Error("Bad response");
        const data = await res.json();
        if (!ignore) setPets(data);
      } catch (error) {
        console.error("Failed to fetch pets: ", error);
        if (!ignore) setPets(null);
      }
    };
    fetchPets();
    return () => { ignore = true; }
  }, [user?._id]);

  const onEdit = () => {}

  async function onDelete (petId) {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this pet?",
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`${PETS_API_URL}/${petId}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Could not delete pet.");
      }
      setPets(prevPets => prevPets.filter(p => p._id !== petId));
    } catch (error) {
      console.error(error);
      //TODO: error handling component here
    }
  }

  if (pets === undefined) return <p>Loading pets...</p>;
  if (pets === null) return <p>Could not load pets.</p>;

  return (
    <div className="pets-table-card">
      <div className="pets-table-heading">
        <h2>Pets</h2>
        <span>
          <button
            className="pets-btn pets-btn-primary"
            type="button"
            onClick={() => setShowAddModal(true)}
          >
            + Add Pet
          </button>
          {showAddModal && (
                      <PetAddModal
                        title="Add pet"
                        message="Add a new pet here."
                        onCancel={() => setShowAddModal(false)}
                        setPets={setPets}
                      />
          )}
        </span>
      </div>

      <div className="pets-table-wrapper">
        <table className="pets-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Species</th>
              <th>Breed</th>
              <th>Medicines</th>
              <th>Birthdate</th>
              <th>Options</th>
            </tr>
          </thead>

          <tbody>
            {pets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="pets-empty">
                    No pets found for your account.
                  </td>  
                </tr>
              ) : (
                pets.map((pet) => (
                     <PetRow key={pet._id} pet={pet} onEdit={onEdit} onDelete={onDelete} />
                ))
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}