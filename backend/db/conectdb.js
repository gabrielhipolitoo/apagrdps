const mongoose = require("mongoose");
const chalk = require("chalk");
require("dotenv").config();
const User =  require('../models/User')

const dbUSer = process.env.DB_USER
const dbPass = process.env.DB_PASSWORD



const dbconect = () => {
  mongoose
    .connect(
      `mongodb+srv://${dbUSer}:${dbPass}@cluster0.is52lfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";`
    )
    .then(() => {
      console.log(chalk.greenBright("Banco conectado"));
    })
    .catch((err) => console.log(err));
};


module.exports=dbconect
