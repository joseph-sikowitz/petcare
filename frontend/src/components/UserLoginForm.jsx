/*
  Author: Joseph Sikowitz
  November 2026

  User login form component
*/

import { useSearchParams } from "react-router";

import "./UserLoginForm.css";

//TODO: style registration link

export default function UserLoginForm() {
  const [msgParams] = useSearchParams();
  const msg = msgParams.get('msg');

  return (
    <div className="petcare-card userlogin-form-card">
      <h2>Enter login information</h2>

      <form method="POST" action="/api/auth/login">
        <div className="userlogin-form-grid">
          <div className="userlogin-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="userlogin-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="userlogin-form-actions">
            <button
              className="userlogin-btn userlogin-btn-primary"
              type="submit"
            >
              Login
            </button>
          </div>
        </div>
      </form>
      <p>No account? <a href="/register">Register here</a></p>
      {msg ? (<div className="alert warning">{msg.replace(/'/g, '')}</div>) : (<div></div>)}
    </div>
  );
}
