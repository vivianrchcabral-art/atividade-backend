const { PrismaClient } = require("@prisma/client");

console.log(require("@prisma/client"));

try {
    const prisma = new PrismaClient({});
    console.log("Cliente criado com sucesso!");
} catch (erro) {
    console.error("Erro:", erro);
}