const express = require("express");
const router = express.Router();
const {
  userWallets,
  nfts,
  fetchNfts,
} = require("../../controllers/wallet/wallet");

//routers
router.post("/userWallet", userWallets);

router.post("/nft", nfts);

router.post("/fetchNft", fetchNfts);

module.exports = router;
