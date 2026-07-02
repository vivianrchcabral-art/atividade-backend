const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  console.log(req.headers);


  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      mensagem: "Token não informado"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "senha_super_secreta"
    );

    req.usuario = decoded;

    next();

  } catch (erro) {
    return res.status(401).json({
      mensagem: "Token não autorizado"
    });
  }
}

module.exports = authMiddleware;