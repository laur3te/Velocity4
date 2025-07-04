const express = require("express");
const router = express.Router();
const db = require("../db");

// POST - cadastrar canteiro
router.post("/", (req, res) => {
  const {
    codigo,
    responsavel,
    cep,
    rua,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    status // ✅ Adicionado aqui
  } = req.body;

  const sql = `
    INSERT INTO canteiros 
    (codigo, responsavel, cep, rua, numero, complemento, bairro, cidade, estado, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    codigo,
    responsavel,
    cep,
    rua,
    numero,
    complemento || null,
    bairro,
    cidade,
    estado,
    status || "ativo" // ✅ Define "ativo" apenas se não vier do front
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar canteiro:", err);
      res.status(500).json({ error: "Erro ao cadastrar canteiro" });
    } else {
      res.status(201).json({ message: "Canteiro cadastrado com sucesso!" });
    }
  });
});

// GET - listar todos os canteiros
router.get("/", (req, res) => {
  db.query("SELECT * FROM canteiros", (err, results) => {
    if (err) {
      console.error("Erro ao buscar canteiros:", err);
      res.status(500).json({ error: "Erro ao buscar canteiros" });
    } else {
      res.status(200).json(results);
    }
  });
});

module.exports = router;
