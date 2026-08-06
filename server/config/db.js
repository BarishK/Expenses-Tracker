import mysql from "mysql2";

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "baris123",
  database: process.env.DB_NAME || "finans_db",
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false,
});

connection.connect((err) => {
  if (err) {
    console.error("Veritabanına bağlanılamadı: " + err.stack);
    return;
  }
  console.log("MySQL veritabanına başarıyla bağlandı!");
});

export default connection;
