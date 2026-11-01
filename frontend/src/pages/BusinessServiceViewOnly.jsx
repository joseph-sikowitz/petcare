/*
  Author: Thai Ken Yong
  November 2026

  Business Service View Only - Client Services Page
*/

import { useEffect, useState } from "react";
import "./BusinessServiceViewOnly.css";

function BusinessServiceViewOnly() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("/api/business/services");

        if (!response.ok) {
          throw new Error("Failed to load services.");
        }

        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchServices();
  }, []);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="petcare-page service-view-page">
      <h1>Our Pet Care Services</h1>
      <p>Explore the services we offer for your pets.</p>

      <input
        type="search"
        placeholder="Search services..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        aria-label="Search services"
      />

      {error && <p className="petcare-error">{error}</p>}
      <div className="service-view-grid">
        {filteredServices.map((service) => (
          <article className="petcare-card" key={service._id}>
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <p>Duration: {service.durationMinutes} minutes</p>
            <p>Price: ${Number(service.price).toFixed(2)}</p>
          </article>
        ))}
      </div>

      {!error && filteredServices.length === 0 && (
        <p>No services found.</p>
      )}
    </main>
  );
}

export default BusinessServiceViewOnly;
