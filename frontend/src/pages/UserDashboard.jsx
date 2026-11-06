/*
  Author: Joseph Sikowitz
  November 2026

  User dashboard
*/

import "./UserDashboard.css";

import { useUser } from "../context/UserContext.jsx";

import UserProfileData from "../components/UserProfileData.jsx";
import PetTable from "../components/PetTable.jsx";

function UserProfile() {
  const user = useUser();

  return (
    <main className="petcare-page">
      <div className="dashboard-page">
        <h1>User Dashboard</h1>
        {user ? (<UserProfileData />) : (<p>Not logged in</p>)}
        {user ? (<PetTable />) : null}
      </div>
    </main>
  );
}

export default UserProfile;