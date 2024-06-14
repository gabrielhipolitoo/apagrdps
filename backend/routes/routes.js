const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//middlewares
const validationBody = require("../middlewares/validationBody");
const verifyAuth = require("../middlewares/verifyAuth");

//routes
router.get("/user/:id", verifyAuth, async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id, "-password");
  if (!user) {
    return res.status(404).json({
      msg: "usuario não encontrado",
    });
  }
  return res.status(201).json(user);
});

router.post("/auth/register", validationBody, async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return res.status(400).json({ errocode: "este email ja esta em uso" });
  }
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();
    res.status(201).json({ msg: "usuário criado" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ erro: "Digite o email" });
  }
  if (!password) {
    return res.status(400).json({ erro: "Digite a senha" });
  }

  //check if user exist
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ error: "Este email nao esta cadastrado" });
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

router.post("/update/user/:id", verifyAuth, async (req, res) => {
  const id_profile = req.params.id;
  const userIdToken = req.userId;
  const truphy = userIdToken === id_profile;

  try {
    if (!truphy) {
      return res.status(401).json({
        msg: "Você não tem permissao para alterar dados deste usuário",
      });
    }
    const profile = await User.findByIdAndUpdate(
      userIdToken,
      req.body,
      { new: true, runValidators: true, context: "query" }
    );
    return res.status(400).json({ msg: profile });
  } catch (error) {
    return res
      .status(401)
      .json({ errocode: "houve algum erro, tente novamente mais tarde" });
  }
});

router.post("/verifytoken", verifyAuth, async (req, res) => {
  const id_params = req.params.id;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  try {
    const secret = process.env.SECRET;
    const decode = jwt.verify(token, secret);
    return res.status(200).json({ msg: decode.id });
  } catch (error) {
    return res.status(400).json({ msg: "id não encontrado" });
  }
});

module.exports = router;
