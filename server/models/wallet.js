const mongoose = require("mongoose");

const wallet = new mongoose.Schema({
  publicKey: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  balance: {
    type: Number,
    required: true,
    trim: true,
  },
  key: {
    type: String,
    required: true,
    trim: true,
  },
  nfts: [
    {
      name: {
        type: String,
        require: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      image: {
        type: String,
        required: true,
        trim: true,
      },
      creatorsAddress: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      uri: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

wallet.methods.setWalletNfts = async function (nft) {
  try {
    if (nft.length > 0) {
      this.nfts = this.nfts.concat(nft);
      await this.save();
    }
  } catch (error) {
    return error;
  }
};

const wallets = new mongoose.model("Wallet", wallet);
module.exports = wallets;
