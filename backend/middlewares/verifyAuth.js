const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ errorcode: "acesso negado" });
  }
  try {
    const SECRET_ENV = process.env.SECRET;
    const decode = jwt.verify(token, SECRET_ENV);
    req.userId = decode.id;
  } catch (error) {
    console.log(error);
    return res.status(400).json({ errorcode: "token invalido ou inexistente" });
  }

  next();
};

module.exports = verifyAuth;
