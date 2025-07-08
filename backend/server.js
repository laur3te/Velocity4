const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const canteirosRoutes = require("./routes/canteiros");
app.use("/canteiros", canteirosRoutes);

const alojamentoRoutes = require("./routes/alojamento");
app.use("/alojamento", alojamentoRoutes);

const veiculosRouter = require("./routes/veiculos");
app.use("/veiculos", veiculosRouter);

const funcionariosRoutes = require("./routes/funcionarios")
app.use("/funcionarios", funcionariosRoutes)

const servicosRoutes = require("./routes/servicos");
app.use("/servicos", servicosRoutes);

const ordensRoutes = require("./routes/ordens");
app.use("/ordens", ordensRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
