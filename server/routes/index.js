const Router = require("express").Router;
const router = Router();

router.use("/wallet", require("./wallet"));

module.exports = router;
