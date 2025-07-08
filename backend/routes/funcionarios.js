// routes/funcionarios.js
const express = require("express")
const router = express.Router()
const db = require("../db")

// POST - Cadastrar funcionário
router.post("/", (req, res) => {
  const { nome, perfil, matricula, cpf, funcao, status, alojamento_id } = req.body

  if (!nome || !perfil || !matricula || !cpf || !funcao || !status || !alojamento_id) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" })
  }

  const sql = `
    INSERT INTO funcionarios 
    (nome, perfil, matricula, cpf, funcao, status, alojamento_id, data_cadastro) 
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `

  const values = [nome, perfil, matricula, cpf, funcao, status, alojamento_id]

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar funcionário:", err)
      return res.status(500).json({ message: "Erro ao cadastrar funcionário" })
    }

    res.status(201).json({ message: "Funcionário cadastrado com sucesso", id: result.insertId })
  })
})

// ✅ NOVO: GET - Listar todos os funcionários
router.get("/", (req, res) => {
  db.query("SELECT id, nome, matricula, alojamento_id FROM funcionarios", (err, results) => {
    if (err) {
      console.error("Erro ao buscar funcionários:", err)
      return res.status(500).json({ message: "Erro ao buscar funcionários" })
    }
    res.json(results)
  })
})


// Rota auxiliar para listar alojamentos (manter, se usada)
router.get("/alojamentos", (req, res) => {
  db.query("SELECT id, rua, numero, bairro, cidade, cep FROM alojamento", (err, results) => { // Incluí campos de endereço
    if (err) {
      console.error("Erro ao buscar alojamentos:", err)
      return res.status(500).json({ message: "Erro ao buscar alojamentos" })
    }
    res.json(results)
  })
})

module.exports = router