const validationBody = (req, res, next) => {
  const { name, email, password, confirmpassword } = req.body;
  let errorMessage = [];
  if (!name) {
    errorMessage.push("Digite o nome de usuario");
  }
  if (!email) {
    errorMessage.push("Digite o email");
  }
  if (!password) {
    errorMessage.push("Digite a senha");
  }
  if (!confirmpassword) {
    errorMessage.push("confirme a senha");
  }
  if (password != confirmpassword) {
    errorMessage.push("Senhas nao coincide");
  }
  if(errorMessage.length > 0){
    return res.status(400).json({ errocode: errorMessage });
  }
  next()
};

module.exports = validationBody;
