const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../prismaClient");
const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastro de usuário
 *     description: Permite o registro de um novo usuário.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso.
 */
router.post("/register", async (req, res) => {

  try {

    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: "Nome, email e senha são obrigatórios"
      });
    }

    const usuarioExiste = await prisma.usuario.findUnique({
      where: {
        email
      }
    });

    if (usuarioExiste) {
      return res.status(409).json({
        mensagem: "E-mail já cadastrado"
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        role: "CLIENTE"
      }
    });

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      mensagem: "Erro ao cadastrar usuário"
    });

  }

});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login do usuário
 *     description: Gera um token JWT para acesso às rotas protegidas.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 */
router.post("/login", async (req, res) => {

  try {

    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "Email e senha são obrigatórios"
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        email
      }
    });

    if (!usuario) {
      return res.status(401).json({
        mensagem: "Email ou senha inválidos"
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: "Email ou senha inválidos"
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role
      },
      process.env.JWT_SECRET || "senha_super_secreta",
      {
        expiresIn: "1h"
      }
    );

    res.json({
      mensagem: "Login realizado com sucesso",
      token
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      mensagem: "Erro ao realizar login"
    });

  }

});
module.exports = router;