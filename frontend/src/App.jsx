import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import { useState, useEffect } from "react";

import { UserContext } from "./context/UserContext.jsx";

import "./App.css";


function App({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user: ", error);
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={user}>
    <div className="app-layout">
      <Navbar />

      <main className="app-main">{children}</main>

      <Footer />
    </div>
    </UserContext.Provider>
  );
}

export default App;
