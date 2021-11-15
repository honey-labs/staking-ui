require("../../db/connection");
const wallet = require("../../models/wallet");
const { v4: uuidv4 } = require("uuid");

module.exports.userWallets = async (req, res, next) => {
  try {
    const { balance, publicKey } = req.body;

    if (balance && publicKey) {
      const checkWallet = await wallet.findOne({ publicKey: publicKey });

      if (checkWallet) {
        await wallet.updateOne({ balance: balance });
        return res.status(201).json({ message: "wallet already registered" });
      } else {
        const setWalletData = new wallet({
          publicKey: publicKey,
          balance: balance,
          key: uuidv4(),
        });
        await setWalletData.save();
        return res.status(201).json({ message: "insert wallet details" });
      }
    }
  } catch (error) {
    return res.status(406).json({ error: "something went wrong" });
  }
};

module.exports.nfts = async (req, res) => {
  try {
    const { nft, walletAddress } = req.body;

    const checkWallet = await wallet.findOne({ publicKey: walletAddress });

    if (checkWallet) {
      const getNfts = checkWallet.nfts;

      // if (nft.length > getNfts.length) {
      if (getNfts.length > 0 && nft.length > 0) {
        const len = nft.length;

        for (var i = 0; i < len; i++) {
          const Data = nft[i];

          const str = "nfts.address";

          const findNfts = await wallet.findOne({
            [str]: Data.address,
          });

          if (findNfts) {
          } else {
            const findWallet = await wallet.findOne({
              publicKey: walletAddress,
            });
            await findWallet.newWalletNfts(Data);
          }
        }

        return res.status(201).json({ message: "nft has been saved" });
      } else {
        if (nft.length > 0) {
          const saveWalletNfts = await checkWallet.setWalletNfts(nft);

          if (saveWalletNfts) {
            return res.status(201).json({ message: "nft has been saved" });
          }
        }
      }
      // } else if (nft.length < getNfts.length) {

      // }
    } else {
      return res.status(206).json({ message: "wallet not found" });
    }
  } catch (error) {
    return res.status(406).json({ error: "something went wrong" });
  }
};

module.exports.fetchNfts = async (req, res) => {
  try {
    const { key } = req.body;

    const findWallet = await wallet.findOne({ publicKey: key });

    if (findWallet) {
      return res.status(201).json(findWallet);
    } else {
      return res.status(206).json({ message: "wallet not found" });
    }
  } catch (error) {
    return res.status(406).json({ error: "Enable to get NFTS" });
  }
};
