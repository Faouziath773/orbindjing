import axios from "axios";

function getBaseUrl() {
  return process.env.FEDAPAY_ENV === "sandbox"
    ? "https://sandbox-api.fedapay.com/v1"
    : "https://api.fedapay.com/v1";
}

function getAuthHeaders() {
  const secretKey = process.env.FEDAPAY_SECRET_KEY;
  if (!secretKey) {
    throw new Error("FEDAPAY_SECRET_KEY is missing");
  }
  return {
    Authorization: `Bearer ${secretKey}`,
  };
}

function getPublicKey() {
  const publicKey = process.env.FEDAPAY_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error("FEDAPAY_PUBLIC_KEY is missing");
  }
  return publicKey;
}

function extractTransaction(payload) {
  return (
    payload?.transaction ??
    payload?.["v1/transaction"] ??
    payload?.data?.transaction ??
    payload
  );
}

export async function createTransaction({ description, amount, currency }) {
  const response = await axios.post(
    `${getBaseUrl()}/transactions`,
    {
      description,
      amount,
      currency: { iso: currency },
      callback_url: process.env.APP_BASE_URL
        ? `${process.env.APP_BASE_URL}/success`
        : undefined,
    },
    { headers: { ...getAuthHeaders() } }
  );

  const payload = response.data?.data ?? response.data;
  const transaction = extractTransaction(payload);

  if (!transaction?.id) {
    console.warn("FedaPay transaction response unexpected", response.data);
  }

  return transaction;
}

export async function createTransactionToken(transactionId) {
  const response = await axios.post(
    `${getBaseUrl()}/transactions/${transactionId}/token`,
    { public_key: getPublicKey() },
    { headers: { ...getAuthHeaders() } }
  );

  return response.data?.data;
}

export async function fetchTransaction(transactionId) {
  const response = await axios.get(
    `${getBaseUrl()}/transactions/${transactionId}`,
    { headers: { ...getAuthHeaders() } }
  );
  const payload = response.data?.data ?? response.data;
  const transaction = extractTransaction(payload);

  if (!transaction?.id) {
    console.warn("FedaPay fetch response unexpected", response.data);
  }

  return transaction;
}
