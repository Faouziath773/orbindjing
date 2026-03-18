import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Success from "./pages/Success";
import Admin from "./pages/Admin";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            Orbin DJing
          </Link>
          <nav className="nav">
            <Link to="/">Accueil</Link>
            <Link to="/register">Inscription</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <footer className="footer">
        Programme DJing - Créativité, confiance et sororité.
      </footer>
    </div>
  );
}

export default App;
