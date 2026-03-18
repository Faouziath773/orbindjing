# Orbin DJing

Application full-stack pour l'inscription au programme DJ (filles).

## Structure

- `client/` : Frontend React + Vite
- `server/` : API Express + SQLite + intégration FedaPay

## Démarrer

### Backend

```
cd server
npm install
npm run dev
```

Créer un fichier `.env` dans `server/` :

```
PORT=4000
APP_BASE_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
DB_PATH=./data.db
FEDAPAY_PUBLIC_KEY=pk_test_your_public_key
FEDAPAY_SECRET_KEY=sk_test_your_secret_key
FEDAPAY_ENV=sandbox
FEDAPAY_WEBHOOK_SECRET=your_webhook_secret_optional
```

### Frontend

```
cd client
npm install
npm run dev
```

Optionnel :

```
VITE_API_BASE_URL=http://localhost:4000
```
