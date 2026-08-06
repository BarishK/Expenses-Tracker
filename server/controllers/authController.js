import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, name, email, password } = req.body;
  const userValue = username || name;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql =
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";

    db.query(sql, [userValue, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "Bu email veya kullanıcı adı zaten kayıtlı!" });
        }
        return res
          .status(500)
          .json({ message: "Veritabanı hatası", error: err });
      }
      res.status(201).json({ message: "Kullanıcı başarıyla kaydedildi!" });
    });
  } catch (error) {
    res.status(500).json({ message: "Bir hata oluştu" });
  }
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Veritabanı hatası" });
    if (result.length === 0)
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Hatalı şifre" });

    const token = jwt.sign({ id: user.id, email: user.email }, "SECRET_KEY", {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });

    res.json({ message: "Giriş başarılı" });
  });
};
