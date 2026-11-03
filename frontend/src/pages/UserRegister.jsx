import "./UserRegister.css";

import UserRegisterForm from "../components/UserRegisterForm.jsx";

export default function UserRegister() {
    return (
      <main className="petcare-page">
        <div className="register-page">
          <h1>User Registration</h1>
          <UserRegisterForm />
        </div>
      </main>
    );
}