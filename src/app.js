const express = require("express");
const produtoRoutes = require("./routes/produtoRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const pedidosRoutes = require('./routes/pedidosRoutes');
const pagamentosRoutes = require('./routes/pagamentosRoutes');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

console.log("APP NOVO CARREGADO");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "Sistema backend da lanchonete funcionando!"
  });
});

app.use("/produtos", produtoRoutes);
app.use("/auth", authRoutes);

app.get("/perfil", authMiddleware, (req, res) => {
  res.json({
    mensagem: "Rota protegida acessada com sucesso",
    usuario: req.usuario
  });
});

app.use('/pedidos', pedidosRoutes);

app.use('/pagamentos', pagamentosRoutes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

console.log(JSON.stringify(swaggerSpec.paths["/pedidos/{id}"], null, 2));



app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});