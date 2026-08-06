import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Giriş yapmanız gerekiyor." });
  }

  const secret = process.env.JWT_SECRET || "SECRET_KEY";

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Geçersiz veya süresi dolmuş token." });
    }

    req.user = user;
    next();
  });
};
