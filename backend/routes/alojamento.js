const express = require("express");
const router = express.Router();
const db = require("../db");

// ROTA DE CADASTRO
router.post("/", (req, res) => {
  const { street, number, neighborhood, city, postalCode, residents } = req.body;

  if (!street || !number || !neighborhood || !city || !postalCode || !residents) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  const sql = `
    INSERT INTO alojamento (cep, rua, numero, bairro, cidade, moradores, ativa)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `;

  const values = [postalCode, street, number, neighborhood, city, parseInt(residents)];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar alojamento:", err);
      return res.status(500).json({ message: "Erro ao cadastrar alojamento" });
    }

    res.status(201).json({
      message: "Alojamento cadastrado com sucesso!",
      id: result.insertId,
    });
  });
});

// NOVA ROTA DE LISTAGEM
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      id, rua AS street, numero AS number, bairro AS neighborhood, cidade AS city, 
      cep AS postalCode, moradores AS residents
    FROM alojamento
    WHERE ativa = 1
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar alojamentos:", err);
      return res.status(500).json({ message: "Erro ao buscar alojamentos" });
    }

    res.json(results);
  });
});

module.exports = router;
