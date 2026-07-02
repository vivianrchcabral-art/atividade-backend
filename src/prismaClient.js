const { PrismaClient } = require("@prisma/client");

console.log("Criando Prisma Client...");

const prisma = new PrismaClient();

console.log("Prisma Client criado!");

module.exports = prisma;