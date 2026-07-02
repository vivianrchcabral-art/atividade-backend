const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const prisma = require('../prismaClient');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Criar um novo pedido
 *     description: Cria um pedido informando o canal e o valor total.
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               canalPedido:
 *                 type: string
 *                 example: APP
 *               total:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Pedido inválido
 */
router.post(
    '/',
    authMiddleware,
    roleMiddleware('CLIENTE'),
    async (req, res) => {

    try {

        const { canalPedido, total } = req.body;

        const canaisPermitidos = [
            'APP',
            'TOTEM',
            'BALCAO',
            'PICKUP',
            'WEB'
        ];

        if (!canalPedido) {
            return res.status(400).json({
                mensagem: 'O campo canalPedido é obrigatório'
            });
        }

        if (!canaisPermitidos.includes(canalPedido)) {
            return res.status(400).json({
                mensagem: 'Canal inválido'
            });
        }

        const pedidoCriado = await prisma.pedido.create({
            data: {
                canalPedido,
                total: total || 0,
                status: 'AGUARDANDO_PAGAMENTO'
            }
        });

        res.status(201).json(pedidoCriado);

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            mensagem: 'Erro ao criar pedido'
        });
    }

});

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Listar pedidos
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authMiddleware, async (req, res) => {

    try {

        const { canalPedido } = req.query;

        if (canalPedido) {

            const pedidos = await prisma.pedido.findMany({
                where: {
                    canalPedido
                }
            });

            return res.json(pedidos);
        }

        const pedidos = await prisma.pedido.findMany();

        res.json(pedidos);

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            mensagem: 'Erro ao listar pedidos'
        });
    }

});

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', authMiddleware, async (req, res) => {

    try {

        const pedido = await prisma.pedido.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if (!pedido) {
            return res.status(404).json({
                mensagem: 'Pedido não encontrado'
            });
        }

        res.json(pedido);

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            mensagem: 'Erro ao buscar pedido'
        });
    }

});

/**
 * @swagger
 * /pedidos/{id}/status:
 *   put:
 *     summary: Atualizar status do pedido
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: EM_PREPARO
 *     responses:
 *       200:
 *         description: Atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.put(
    '/:id/status',
    authMiddleware,
    roleMiddleware('ADMIN'),
    async (req, res) => {

    try {

        const { status } = req.body;

        const statusPermitidos = [
            'AGUARDANDO_PAGAMENTO',
            'EM_PREPARO',
            'PRONTO',
            'ENTREGUE',
            'CANCELADO'
        ];

        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({
                mensagem: 'Status inválido'
            });
        }

        const pedido = await prisma.pedido.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if (!pedido) {
            return res.status(404).json({
                mensagem: 'Pedido não encontrado'
            });
        }

        const pedidoAtualizado = await prisma.pedido.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                status
            }
        });

        res.json(pedidoAtualizado);

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            mensagem: 'Erro ao atualizar status'
        });
    }

});

module.exports = router;