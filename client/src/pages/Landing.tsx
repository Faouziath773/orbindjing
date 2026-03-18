import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main>
      <section className="hero container">
        <div>
          <p className="eyebrow">Programme DJ 100% filles</p>
          <h1 className="hero-title">
            Discover DJing and Express Your Creativity
          </h1>
          <p className="hero-text">
            Un espace bienveillant pour apprendre les bases du mix, développer
            ta confiance et exprimer ton style musical avec des coaches
            passionnés.
          </p>
          <Link className="cta" to="/register">
            Register Now
          </Link>
          <div className="hero-badges">
            <span>Ateliers live</span>
            <span>Coaching scénique</span>
            <span>Showcase final</span>
          </div>
        </div>
        <div className="hero-media">
          <div className="media-card">
            <img
              src="https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?q=80&w=900&auto=format&fit=crop"
              alt="Jeune DJ en performance"
            />
            <span>Feel the beat</span>
          </div>
          <div className="media-card highlight">
            <img
              src="https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=900&auto=format&fit=crop"
              alt="DJ et platines"
            />
            <span>Glow & Mix</span>
          </div>
        </div>
      </section>

      <section className="container festival">
        <div className="festival-header">
          <h2 className="section-title">Un tremplin créatif et festif</h2>
          <p className="hero-text">
            12 places seulement pour vivre une expérience immersive : ateliers
            pratiques, sessions studio et showcase final.
          </p>
        </div>
        <div className="info-grid">
          <div className="info-card" id="learn">
            <h3>Why participate</h3>
            <p>
              Construis un réseau, gagne en assurance et découvre les métiers de
              la scène.
            </p>
          </div>
          <div className="info-card">
            <h3>What you will learn</h3>
            <p>
              Beatmatching, transitions, programmation musicale et présence
              scénique.
            </p>
          </div>
          <div className="info-card" id="places">
            <h3>Limited places</h3>
            <p>
              Petits groupes pour un suivi personnalisé. Réserve ta place dès
              maintenant.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
