/*
  Author: Joseph Sikowitz
  November 2026

  User profile data component
*/

import { useUser } from "../context/UserContext.jsx";
import { useState } from "react";

import "./UserProfileData.css";
import UserEditModal from "./UserEditModal.jsx";
import ErrorMessage from "./ErrorMessage.jsx";

const USERS_API_URL = "/api/users";
const PETS_API_URL = "/api/pets";
const LOGOUT_API_URL = "/api/auth/logout";

export default function UserProfileData() {
  const user = useUser();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showError, setShowError] = useState("");

  async function handleUserDelete() {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete your account?",
      )
    ) {
      return;
    }

    try {
      setShowError("");
      const petsResponse = await fetch (`${PETS_API_URL}?user_id=${user._id}`);
      const petsArray = await petsResponse.json();

      if (petsArray.length !== 0) {
        petsArray.forEach(async (pet) => {
          const res = await fetch(`${PETS_API_URL}/${pet._id}`, { method: "DELETE" });
          if (!res.ok) {
            throw new Error("Failed to delete pet associated with user");
          }
        });
      }

      const deleteResponse = await fetch(`${USERS_API_URL}/${user._id}`, { method: "DELETE" });

      if(!deleteResponse.ok) {
        throw new Error("Failed to delete user account");
      }

      window.location.href = LOGOUT_API_URL;
    } catch (error) {
      console.log(error.message);
      setShowError(error.message);
    }
  } 

  return (
    <div className="petcare-card profile-card">
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      <p>
        Name: {user.firstName} {user.lastName}
      </p>
      <p>Email: {user.email}</p>
      {user.phoneNumber ? <p>Phone Number: {user.phoneNumber}</p> : null}
      {user.businessName && user.owner ? (
        <p>Business: {user.businessName}</p>
      ) : (
        null
      )}
      {user.addressLine1 && user.city && user.state && user.zipCode ? (
        <p>
          Address: {user.addressLine1} {user.addressLine2} {user.city}{" "}
          {user.state} {user.zipCode}
        </p>
      ) : (
        null
      )}
      <div className="profile-btn-group">
          <button className="profile-btn profile-btn-primary" type="button" onClick={() => setShowEditModal(true)}>
            Edit
          </button>
          {showEditModal && (
            <UserEditModal
              title="Edit account"
              message="Make changes to your account here."
              onCancel={() => setShowEditModal(false)}
            />
          )}
          <button className="profile-btn profile-btn-primary" type="button" onClick={handleUserDelete}>
            Delete
          </button>
      </div>
      {showError && (<ErrorMessage msg={{ msg: showError }}/>)}
    </div>
  );
}

