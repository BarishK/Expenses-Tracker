import db from "../config/db.js";
import bcrypt from "bcrypt";

export const getUser = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT id, email, username, currency, created_at FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Veri alınamadı" });
      if (results.length === 0)
        return res.status(404).json({ error: "Kullanıcı bulunamadı" });

      res.json(results[0]);
    },
  );
};

export const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { username, email, currency } = req.body;

  db.query(
    "UPDATE users SET username = ?, email = ?, currency = ? WHERE id = ?",
    [username, email, currency, userId],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Güncelleme başarısız oldu" });
      res.json({ message: "Kullanıcı başarıyla güncellendi" });
    },
  );
};

export const updatePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Tüm alanları doldurun." });
  }

  try {
    db.query(
      "SELECT password_hash FROM users WHERE id = ?",
      [userId],
      async (err, results) => {
        if (err || results.length === 0) {
          return res.status(500).json({ error: "Sunucu hatası." });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(
          currentPassword,
          user.password_hash,
        );
        if (!isMatch) {
          return res.status(400).json({ error: "Mevcut şifre yanlış." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.query(
          "UPDATE users SET password_hash = ? WHERE id = ?",
          [hashedPassword, userId],
          (err) => {
            if (err)
              return res.status(500).json({ error: "Güncelleme başarısız." });
            return res.json({ message: "Şifre başarıyla güncellendi." });
          },
        );
      },
    );
  } catch (err) {
    return res.status(500).json({ error: "İşlem sırasında hata oluştu." });
  }
};

export const deleteAccount = (req, res) => {
  const userId = req.user.id;

  db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) {
      console.error("Hesap silme hatası:", err);
      return res
        .status(500)
        .json({ error: "Hesap silinirken bir hata oluştu." });
    }

    res.clearCookie("token");
    res.json({ message: "Hesap başarıyla silindi." });
  });
};
