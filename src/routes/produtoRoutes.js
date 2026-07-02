const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     description: Retorna a lista de produtos disponíveis.
 *     tags:
 *       - Produtos
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso.
 */
router.get("/", (req, res) => {
  res.json([
    {
      id: 1,
      nome: "Hambúrguer Artesanal",
      preco: 37.90
    },
    {
      id: 2,
      nome: "Batata Rústica",
      preco: 17.50
    }
  ]);
});

module.exports = router;