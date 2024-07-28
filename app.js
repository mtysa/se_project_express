const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use((req, res, next) => {
  req.user = {
    _id: "66a12974657a7df219c99fd5",
  };
  next();
});

const routes = require("./routes");

app.use(express.json());
app.use(routes);

app.listen(PORT);
