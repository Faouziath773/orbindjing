import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Success() {
  const [status, setStatus] = useState<
    "loading" | "confirmed" | "pending" | "missing" | "error"
  >("loading");

  useEffect(() => {
    const transactionId = localStorage.getItem("pending_transaction_id");
    if (!transactionId) {
      setStatus("missing");
      return;
    }

    const confirm = async () => {
      try {
        const response = await api.get("/api/confirm", {
          params: { transaction_id: transactionId },
        });
        const resultStatus = response.data?.data?.status;
        if (resultStatus === "moved") {
          localStorage.removeItem("pending_transaction_id");
          setStatus("confirmed");
          return;
        }
        if (resultStatus === "ignored") {
          setStatus("pending");
          return;
        }
        setStatus("error");
      } catch (err) {
        setStatus("error");
      }
    };

    confirm();
  }, []);

  return (
    <main className="container">
      <div className="success-card">
        <h1 className="section-title">
          {status === "confirmed"
            ? "Inscription confirmée."
            : "Confirmation du paiement."}
        </h1>
        <p className="hero-text">
          {status === "loading" &&
            "Nous finalisons la validation de ton paiement..."}
          {status === "confirmed" &&
            "Merci pour ta confiance ! Nous te contactons très vite pour la suite du programme."}
          {status === "pending" &&
            "Le paiement est enregistré, la confirmation peut prendre quelques minutes. Tu peux rafraîchir cette page."}
          {status === "missing" &&
            "Impossible de retrouver la transaction. Contacte l'équipe si tu as déjà payé."}
          {status === "error" &&
            "Une erreur est survenue lors de la confirmation. Réessaie dans quelques instants."}
        </p>
        <Link className="cta" to="/">
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
