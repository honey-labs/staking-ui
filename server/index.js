const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookiesParser = require("cookie-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(cookiesParser());

app.use(function (res, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access.Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access.Control-Allow-Headers",
    "Origin, X-Requested-With, Control-Type, Accept"
  );
  next();
});

const PORT = process.env.PORT;

app.use("/api", require("./routes"));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
