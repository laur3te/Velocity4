const express = require("express");
const router = express.Router();
const db = require("../db");

// Listar serviços
router.get("/", (req, res) => {
  db.query("SELECT * FROM servicos", (err, results) => {
    if (err) {
      console.error("Erro ao buscar serviços:", err);
      return res.status(500).json({ error: "Erro ao buscar serviços" });
    }
    res.json(results);
  });
});

// Criar novo serviço
router.post("/", (req, res) => {
  const { funcao, canteiro_id, rua, numero, bairro, cidade, cep } = req.body;

  if (!funcao || !canteiro_id || !rua || !numero || !bairro || !cidade || !cep) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const query = `
    INSERT INTO servicos (funcao, canteiro_id, rua, numero, bairro, cidade, cep)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [funcao, canteiro_id, rua, numero, bairro, cidade, cep];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Erro ao criar serviço:", err);
      return res.status(500).json({ error: "Erro ao criar serviço" });
    }

    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

module.exports = router;
