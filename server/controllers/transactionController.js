import db from "../config/db.js";

export const getTransactions = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Veri alınamadı" });
      res.json(results);
    },
  );
};

export const addTransaction = (req, res) => {
  const { amount, type, category, description } = req.body;
  const userId = req.user.id;

  db.query(
    "INSERT INTO transactions (user_id, amount, type, category, description) VALUES (?, ?, ?, ?, ?)",
    [userId, amount, type, category, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Harcama eklenemedi" });
      res.json({ message: "İşlem başarıyla eklendi", id: result.insertId });
    },
  );
};

export const deleteTransaction = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM transactions WHERE id = ?", [id]);
  res.json({ message: "Transaction deleted." });
};
