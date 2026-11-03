import "./UserProfile.css";

import UserProfileData from "../components/UserProfileData.jsx";

export default function UserProfile() {
  return (
    <main className="petcare-page">
      <div className="profile-page">
        <h1>User Login</h1>
        <UserProfileData />
      </div>
    </main>
  );
}