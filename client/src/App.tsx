import { Link, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Success from "./pages/Success";
import Admin from "./pages/Admin";

function App() {
  const location = useLocation();
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
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/dashboard" element={<Admin />} />
      </Routes>

      {!location.pathname.startsWith("/dashboard") &&
        !location.pathname.startsWith("/register") && (
        <Link to="/register" className="floating-cta" aria-label="S'inscrire">
          S'inscrire
        </Link>
      )}

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h3 className="footer-brand">Xwénusu Fondament'Art</h3>
            <p>
              Association culturelle basée à Cotonou, dédiée à l'art urbain, la
              jeunesse et l'impact social.
            </p>
          </div>
          <div>
            <h4>Navigation</h4>
            <a href="#">À propos</a>
            <a href="#">Projets</a>
            <a href="#">Galerie</a>
            <a href="#">Partenaires</a>
            <a href="#">Contact</a>
          </div>
          <div>
            <h4>Réseaux sociaux</h4>
            <div className="socials">
              <a href="#" aria-label="Facebook">
                f
              </a>
              <a href="#" aria-label="Instagram">
                ⬤
              </a>
              <a href="#" aria-label="YouTube">
                ▶
              </a>
              <a href="#" aria-label="TikTok">
                ♫
              </a>
            </div>
          </div>
          <div>
            <h4>Légal</h4>
            <a href="#">Légal</a>
            <a href="#">Règlement du vote</a>
            <a href="#">Politique de confidentialité</a>
            <a href="#">Conditions d'utilisation</a>
            <a href="#">Mentions légales</a>
          </div>
          <div>
            <h4>Contact</h4>
            <p>Cotonou, Bénin</p>
            <p>contact@xwenusu.org</p>
            <p>+229 96 00 00 00</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
