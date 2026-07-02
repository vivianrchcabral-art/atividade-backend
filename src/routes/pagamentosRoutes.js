const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const prisma = require('../prismaClient');

/**
 * @swagger
 * /pagamentos:
 *   post:
 *     summary: Processar pagamento
 *     description: Simula o processamento de pagamento de um pedido.
 *     tags:
 *       - Pagamentos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedidoId:
 *                 type: integer
 *                 example: 1
 *               valor:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Pagamento aprovado
 *       400:
 *         description: Pagamento recusado
*/
router.post('/', authMiddleware, async (req, res) => {

    try {

        const { pedidoId, valor } = req.body;

        if (!pedidoId || !valor) {
            return res.status(400).json({
                mensagem: 'Pedido e valor são obrigatórios'
            });
        }

        const pedido = await prisma.pedido.findUnique({
            where: {
                id: parseInt(pedidoId)
            }
        });

        if (!pedido) {
            return res.status(404).json({
                mensagem: 'Pedido não encontrado'
            });
        }

        const aprovado = Math.random() > 0.3;

        if (aprovado) {

            const pedidoAtualizado = await prisma.pedido.update({
                where: {
                    id: parseInt(pedidoId)
                },
                data: {
                    status: 'EM_PREPARO'
                }
            });

            return res.json({
                pedidoId,
                valor,
                statusPagamento: 'APROVADO',
                statusPedido: pedidoAtualizado.status,
                mensagem: 'Pagamento aprovado com sucesso'
            });
        }

        const pedidoAtualizado = await prisma.pedido.update({
            where: {
                id: parseInt(pedidoId)
            },
            data: {
                status: 'CANCELADO'
            }
        });

        return res.status(400).json({
            pedidoId,
            valor,
            statusPagamento: 'RECUSADO',
            statusPedido: pedidoAtualizado.status,
            mensagem: 'Pagamento recusado'
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            mensagem: 'Erro ao processar pagamento'
        });
    }

});

module.exports = router;