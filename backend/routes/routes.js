const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.get("/teste", (req, res) => {
  return res.json(200);
});

const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado" });
  }

  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    next();
  } catch (error) {
    return res.status(400).json({ msg: "Token inválido ou inexistente" });
  }
};

router.get("/user/:id", authToken, async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id, "-password");
  if (!user) {
    return res.status(404).json({
      msg: "usuario não encontrado",
    });
  }
  return res.status(201).json(user);
});

router.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  if (!name) {
    return res.status(422).json({ erro: "nome vazio" });
  }
  if (!email) {
    return res.status(422).json({ erro: "email vazio" });
  }
  if (!password) {
    return res.status(422).json({ erro: "password vazio" });
  }

  if (password !== confirmpassword) {
    return res.status(422).json({ erro: "senhas nao conferem" });
  }

  //check if user exist
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ erro: "este email ja existe" });
  }

  const salt = await bcrypt.genSalt(12); // gerando cadeia de caracteres
  const passwordHash = await bcrypt.hash(password, salt);
  // criando uma senha baseada no bcrypt.genSalt(12)

  const user = new User({
    name,
    email,
    password: passwordHash,
  });
  console.log(passwordHash);
  try {
    await user.save();
    res.status(201).json({ msg: "usuario criado" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ erro: "Digite o email" });
  }
  if (!password) {
    return res.status(422).json({ erro: "Digite a senha" });
  }

  //check if user exist
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(422).json({ error: "Este email nao esta cadastrado" });
  }

  //check if password macth

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(404).json({ error: "Senha incorreta" });
  }

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        id: user.id,
      },
      secret
    );

    console.log(token);
    res.status(200).json({
      status: "autenticado",
      token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Aconteceu um erro, tente novamente mais tarde" });
  }
});

router.post("/update/user/:id", async (req, res) => {
  const id_params = req.params.id;

  try {
    const profile = await User.findOne({ _id: id_params });
    console.log(profile);
  } catch (error) {
    return res.status(200).json({ msg: "id não encontrado" });
  }
});

router.post("/verifytoken", async (req, res) => {
  const id_params = req.params.id;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  try {
    const secret = process.env.SECRET;
    const decode = jwt.verify(token, secret);
    console.log(decode.id);
  } catch (error) {
    return res.status(200).json({ msg: "id não encontrado" });
  }
});

module.exports = router;
