require("dotenv").config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "", // se não tiver senha
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

connection.connect(err => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("✅ Conectado ao banco de dados MySQL!");
});

module.exports = connection;

