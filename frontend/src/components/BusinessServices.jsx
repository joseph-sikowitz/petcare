import { useEffect, useState } from "react";
import "./BusinessServices.css";

function BusinessServices() {
  const [services, setServices] = useState([]); // State to hold the list of services
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(""); // State to hold any error messages

  // Fetch services from the backend API when the component mounts
  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("/api/business/services");

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  if (loading) {
    return <p>Loading services...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>Manage Services</h1>
      <p>Total services: {services.length}</p>
    </section>
  );
}

export default BusinessServices;