const express = require("express");
const router = express.Router();
const db = require("../db");

// Listar ordens de serviço
router.get("/", (req, res) => {
  const query = `
    SELECT os.id, os.data_criacao, 
           f.nome AS funcionario, f.matricula,
           s.funcao AS servico, s.id AS servico_id
    FROM ordens_servico os
    JOIN funcionarios f ON os.funcionario_id = f.id
    JOIN servicos s ON os.servico_id = s.id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao listar ordens:", err);
      return res.status(500).json({ error: "Erro ao buscar ordens de serviço" });
    }
    res.json(results);
  });
});

// Criar nova ordem de serviço
router.post("/", (req, res) => {
  const { funcionario_id, servico_id } = req.body;

  console.log("Dados recebidos para cadastro:", req.body);

  if (!funcionario_id || !servico_id) {
    return res.status(400).json({ error: "Campos obrigatórios: funcionario_id e servico_id" });
  }

  const query = `INSERT INTO ordens_servico (funcionario_id, servico_id) VALUES (?, ?)`;
  db.query(query, [funcionario_id, servico_id], (err, result) => {
    if (err) {
      console.error("Erro ao criar ordem:", err);
      return res.status(500).json({ error: "Erro ao criar ordem de serviço" });
    }

    res.status(201).json({ id: result.insertId, funcionario_id, servico_id });
  });
});

module.exports = router;
