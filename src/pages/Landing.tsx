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
        </div>
        <div className="hero-card">
          <h2 className="section-title">Un tremplin créatif</h2>
          <p className="hero-text">
            12 places seulement pour vivre une expérience immersive : ateliers
            pratiques, sessions studio et showcase final.
          </p>
          <div className="info-grid">
            <div className="info-card">
              <h3>Why participate</h3>
              <p>
                Construis un réseau, gagne en assurance et découvre les métiers
                de la scène.
              </p>
            </div>
            <div className="info-card">
              <h3>What you will learn</h3>
              <p>
                Beatmatching, transitions, programmation musicale et présence
                scénique.
              </p>
            </div>
            <div className="info-card">
              <h3>Limited places</h3>
              <p>
                Petits groupes pour un suivi personnalisé. Réserve ta place dès
                maintenant.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
