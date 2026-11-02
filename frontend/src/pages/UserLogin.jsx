import "./UserLogin.css";

import UserLoginForm from "../components/UserLoginForm.jsx";

export default function UserLogin() {
  return (
    <main className="petcare-page">
      <div className="login-page">
        <h1>User Login</h1>
        <UserLoginForm />
      </div>
    </main>
  );
}
