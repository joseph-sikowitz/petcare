/*
  Author: Thai Ken Yong
  November 2026

  PetCare Homepage
*/

import { Link } from "react-router";
import "./HomePage.css";

export default function HomePage() {
  return (
    <main className="petcare-page home-page">
      <section className="home-hero">
        <div className="home-content">
          <h1>Caring for your pets, one appointment at a time.</h1>

          <p>
            Manage your pet profiles, explore pet care services, and keep
            your pet information organized in one place.
          </p>

          <div className="home-actions">
            <Link to="/login" className="petcare-button">
              Get Started
            </Link>

            <Link
              to="/services"
              className="petcare-button petcare-button--secondary"
            >
              Explore Services
            </Link>
          </div>
        </div>

        <div className="home-image">
          <img
            src="/pets-home.jpg"
            alt="A dog and cat sitting together"
            />
        </div>
      </section>
    </main>
  );
}
