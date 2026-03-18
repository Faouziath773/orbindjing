import { getDb } from "./db.js";

function normalizeCurrency(transaction) {
  if (!transaction) return null;
  if (typeof transaction.currency === "string") {
    return transaction.currency;
  }
  if (transaction.currency && typeof transaction.currency.iso === "string") {
    return transaction.currency.iso;
  }
  if (transaction.currency_id === 1) {
    return "XOF";
  }
  return null;
}

export async function finalizeRegistration(transaction) {
  const transactionId = transaction?.id;
  if (!transactionId) {
    return { status: "missing_transaction" };
  }

  const verifiedStatus = transaction.status;
  const verifiedAmount = Number(transaction.amount);
  const verifiedCurrency = normalizeCurrency(transaction);

  if (
    verifiedStatus !== "approved" ||
    verifiedAmount !== 1000 ||
    verifiedCurrency !== "XOF"
  ) {
    return {
      status: "ignored",
      details: {
        status: verifiedStatus,
        amount: verifiedAmount,
        currency: verifiedCurrency,
      },
    };
  }

  const db = await getDb();
  const pending = await db.get(
    "SELECT * FROM pending_registrations WHERE transaction_id = ?",
    transactionId
  );

  if (!pending) {
    return { status: "no_pending" };
  }

  const existingCandidate = await db.get(
    "SELECT id FROM candidates WHERE phone = ? OR transaction_id = ?",
    [pending.phone, transactionId]
  );

  if (!existingCandidate) {
    await db.run(
      `
        INSERT INTO candidates
          (photo, first_name, last_name, phone, email, age, city, motivation, transaction_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        pending.photo,
        pending.first_name,
        pending.last_name,
        pending.phone,
        pending.email,
        pending.age,
        pending.city,
        pending.motivation,
        transactionId,
        new Date().toISOString(),
      ]
    );
  }

  await db.run(
    "DELETE FROM pending_registrations WHERE transaction_id = ?",
    transactionId
  );

  return { status: "moved" };
}
