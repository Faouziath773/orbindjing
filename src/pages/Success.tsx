import { Link } from "react-router-dom";

export default function Success() {
  return (
    <main className="container">
      <div className="success-card">
        <h1 className="section-title">
          Your registration has been successfully confirmed.
        </h1>
        <p className="hero-text">
          Merci pour ta confiance ! Nous te contactons très vite pour la suite
          du programme.
        </p>
        <Link className="cta" to="/">
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
