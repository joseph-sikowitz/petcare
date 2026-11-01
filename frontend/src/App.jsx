import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css";

function App({ children }) {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-main">{children}</main>

      <Footer />
    </div>
  );
}

export default App;
