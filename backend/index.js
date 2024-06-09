const express = require("express");
const router = require("./routes/routes");
const dbconect = require("./db/conectdb");

//middlewares
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(router);

// conecting

const port = 3000;
app.listen(port, () => {
  dbconect();
  console.log("servidor aivo", port);
});
