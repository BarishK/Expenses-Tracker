import db from "../config/db.js";

export const getDashboardCharts = (req, res) => {
  const userId = req.user.id;

  const expenseQuery = `
    SELECT category, SUM(amount) AS total 
    FROM transactions 
    WHERE user_id = ? AND type = 'expense'
    GROUP BY category
    ORDER BY total DESC;
  `;

  const incomeQuery = `
    SELECT category, SUM(amount) AS total 
    FROM transactions 
    WHERE user_id = ? AND type = 'income'
    GROUP BY category
    ORDER BY total DESC;
  `;

  db.query(expenseQuery, [userId], (err, expenseResults) => {
    if (err) {
      console.error("Gider SQL Hatası:", err);
      return res.status(500).json({ error: "Gider verisi alınamadı." });
    }

    db.query(incomeQuery, [userId], (err, incomeResults) => {
      if (err) {
        console.error("Gelir SQL Hatası:", err);
        return res.status(500).json({ error: "Gelir verisi alınamadı." });
      }

      res.json({
        expensesByCategory: expenseResults || [],
        incomesByCategory: incomeResults || [],
      });
    });
  });
};
