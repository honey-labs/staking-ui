const mongoose = require("mongoose");

const DB = process.env.DB;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })

  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
    console.log("Failed to connected MongoDB");
  });
