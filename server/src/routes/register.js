import express from "express";
import { getDb } from "../db.js";
import {
  createTransaction,
  createTransactionToken,
  fetchTransaction,
} from "../fedapay.js";
import { finalizeRegistration } from "../registration.js";

const router = express.Router();

function normalizeString(value) {
  return String(value || "").trim();
}

function normalizePhone(value) {
  const raw = normalizeString(value);
  if (!raw) return "";
  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

router.post("/register", async (req, res) => {
  try {
    console.info("Register request received");
    const {
      photo,
      first_name,
      last_name,
      phone,
      email,
      age,
      city,
      motivation,
    } = req.body || {};

    const cleaned = {
      photo: normalizeString(photo),
      first_name: normalizeString(first_name),
      last_name: normalizeString(last_name),
      phone: normalizePhone(phone),
      email: normalizeString(email),
      age: Number(age),
      city: normalizeString(city),
      motivation: normalizeString(motivation),
    };

    console.info("Register payload summary", {
      hasPhoto: Boolean(cleaned.photo),
      hasFirstName: Boolean(cleaned.first_name),
      hasLastName: Boolean(cleaned.last_name),
      hasPhone: Boolean(cleaned.phone),
      hasEmail: Boolean(cleaned.email),
      age: cleaned.age,
      cityLength: cleaned.city.length,
    });

    if (
      !cleaned.photo ||
      !cleaned.first_name ||
      !cleaned.last_name ||
      !cleaned.phone ||
      !Number.isFinite(cleaned.age) ||
      !cleaned.city
    ) {
      return res.status(400).json({ error: "Champs obligatoires manquants." });
    }

    const db = await getDb();

    const existingCandidate = await db.get(
      "SELECT id FROM candidates WHERE phone = ?",
      cleaned.phone
    );
    const existingPending = await db.get(
      "SELECT id FROM pending_registrations WHERE phone = ?",
      cleaned.phone
    );

    if (existingCandidate || existingPending) {
      return res
        .status(409)
        .json({ error: "Une inscription existe déjà pour ce numéro." });
    }

    console.info("Creating FedaPay transaction");
    const transaction = await createTransaction({
      description: "Inscription au programme DJ",
      amount: 1000,
      currency: "XOF",
    });

    if (!transaction?.id) {
      console.warn("FedaPay transaction missing id", transaction);
      return res
        .status(502)
        .json({ error: "Impossible de créer la transaction." });
    }

    const paymentUrl = transaction.payment_url;
    if (!paymentUrl) {
      console.info("Creating FedaPay token", { transactionId: transaction.id });
      const token = await createTransactionToken(transaction.id);
      if (!token?.url) {
        console.warn("FedaPay token missing url", token);
        return res
          .status(502)
          .json({ error: "Impossible de générer le lien de paiement." });
      }
      transaction.payment_url = token.url;
    }

    await db.run(
      `
        INSERT INTO pending_registrations
          (photo, first_name, last_name, phone, email, age, city, motivation, transaction_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        cleaned.photo,
        cleaned.first_name,
        cleaned.last_name,
        cleaned.phone,
        cleaned.email || null,
        cleaned.age,
        cleaned.city,
        cleaned.motivation || null,
        transaction.id,
        new Date().toISOString(),
      ]
    );

    return res.status(201).json({
      payment_url: transaction.payment_url,
      transaction_id: transaction.id,
    });
  } catch (error) {
    if (error?.response) {
      const requestId = error.response?.headers?.["x-request-id"];
      console.error("Register error:", error.response?.data || error.response);
      return res.status(502).json({
        error: "Erreur FedaPay.",
        details: error.response?.data || null,
        request_id: requestId || null,
      });
    }
    console.error("Register error:", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
});

router.get("/confirm", async (req, res) => {
  try {
    const transactionId = String(req.query.transaction_id || "").trim();
    if (!transactionId) {
      return res.status(400).json({ error: "Transaction manquante." });
    }

    const transaction = await fetchTransaction(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction introuvable." });
    }

    const result = await finalizeRegistration(transaction);
    return res.json({
      data: {
        status: result.status,
        transaction_status: transaction.status,
      },
    });
  } catch (error) {
    console.error("Confirm error:", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
});

export default router;
