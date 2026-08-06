import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    path: "/",
    httpOnly: false, // login'de false yaptığımız için silerken de false olmalı
    secure: true, // Cross-site çalıştığı için her zaman true
    sameSite: "none",
  });

  res.json({ message: "Çıkış başarılı" });
});

export default router;
