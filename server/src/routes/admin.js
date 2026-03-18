import express from "express";
import { getDb } from "../db.js";

const router = express.Router();

router.get("/admin/candidates", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim().toLowerCase();
    const db = await getDb();

    let candidates;
    if (search) {
      const pattern = `%${search}%`;
      candidates = await db.all(
        `
          SELECT *
          FROM candidates
          WHERE LOWER(first_name) LIKE ?
             OR LOWER(last_name) LIKE ?
             OR LOWER(phone) LIKE ?
             OR LOWER(city) LIKE ?
          ORDER BY datetime(created_at) DESC
        `,
        [pattern, pattern, pattern, pattern]
      );
    } else {
      candidates = await db.all(
        "SELECT * FROM candidates ORDER BY datetime(created_at) DESC"
      );
    }

    return res.json({ data: candidates });
  } catch (error) {
    console.error("Admin list error:", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
});

router.get("/admin/stats", async (_req, res) => {
  try {
    const db = await getDb();
    const total = await db.get("SELECT COUNT(*) as value FROM candidates");
    const today = await db.get(
      "SELECT COUNT(*) as value FROM candidates WHERE date(created_at) = date('now')"
    );
    const averageAge = await db.get(
      "SELECT AVG(age) as value FROM candidates"
    );
    const topCities = await db.all(
      `
        SELECT city, COUNT(*) as total
        FROM candidates
        GROUP BY city
        ORDER BY total DESC
        LIMIT 3
      `
    );

    return res.json({
      data: {
        total: total?.value || 0,
        today: today?.value || 0,
        average_age: averageAge?.value ? Number(averageAge.value).toFixed(1) : "0",
        top_cities: topCities,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
});

router.get("/admin/candidates.csv", async (req, res) => {
  try {
    const db = await getDb();
    const candidates = await db.all(
      "SELECT * FROM candidates ORDER BY datetime(created_at) DESC"
    );

    const headers = [
      "Photo",
      "Nom",
      "Telephone",
      "Ville",
      "Age",
      "Date",
    ];

    const rows = candidates.map((candidate) => [
      candidate.photo,
      `${candidate.first_name} ${candidate.last_name}`,
      candidate.phone,
      candidate.city,
      candidate.age,
      candidate.created_at,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value || "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="candidates.csv"'
    );
    return res.send(csv);
  } catch (error) {
    console.error("CSV export error:", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
});

export default router;
