import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import UserLogin from "./components/UserLogin.jsx";

import "./App.css";

function App() {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-main">
        <UserLogin />
      </main>

      <Footer />
    </div>
  );
}

export default App;