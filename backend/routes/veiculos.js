// routes/veiculos.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Rota POST para cadastrar veículos (EXISTENTE)
router.post("/", (req, res) => {
  console.log("📩 Requisição recebida em /veiculos");
  console.log("📦 Dados recebidos:", req.body);

  const { frota, tipo_veiculo, placa, capacidade } = req.body;

  if (!frota?.trim() || !tipo_veiculo?.trim() || !placa?.trim() || isNaN(capacidade)) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  const sql = `
    INSERT INTO veiculos (frota, tipo_veiculo, placa, capacidade)
    VALUES (?, ?, ?, ?)
  `;

  const values = [frota, tipo_veiculo, placa, capacidade];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Erro ao cadastrar veículo:", err);
      return res.status(500).json({ message: "Erro ao cadastrar veículo" });
    }

    console.log("✅ Veículo cadastrado com sucesso. ID:", result.insertId);

    res.status(201).json({
      message: "Veículo cadastrado com sucesso!",
      id: result.insertId,
    });
  });
});

// ✅ NOVO: Rota GET para listar todos os veículos
router.get("/", (req, res) => {
  // Selecione todos os campos relevantes que você pode precisar
  db.query("SELECT id, frota, tipo_veiculo, placa, capacidade FROM veiculos", (err, results) => {
    if (err) {
      console.error("❌ Erro ao buscar veículos:", err);
      return res.status(500).json({ message: "Erro ao buscar veículos" });
    }
    res.json(results);
  });
});


module.exports = router;