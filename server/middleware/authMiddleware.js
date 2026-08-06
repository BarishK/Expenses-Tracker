import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Giriş yapmanız gerekiyor." });
  }

  jwt.verify(token, "SECRET_KEY", (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Geçersiz veya süresi dolmuş token." });
    }

    req.user = user;
    next();
  });
};
