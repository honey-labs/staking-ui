import createConnection from "../helpers/conn";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { clusterApiUrl } from "@solana/web3.js";
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
  createConnectionConfig,
} from "@nfteyez/sol-rayz";

export const CheckProvider = () => {
  return {
    type: "CHECK_PROVIDER",
  };
};

export const SolanaConnect = (key) => {
  return {
    type: "CONNECT_SOLANA",
    payload: {
      key: key,
    },
  };
};

export const SolanaDisConnect = () => {
  return {
    type: "DISCONNECT_SOLANA",
  };
};

export const BalanceSolana = (connect, key) => {
  return async (dispatch) => {
    if (connect) {
      const connection = createConnection();
      const bal = await connection.getBalance(key);
      let balance = bal / LAMPORTS_PER_SOL;
      console.log(balance);

      dispatch({
        type: "SOLANA_Balance",
        payload: {
          balance: balance,
        },
      });
    }
  };
};

export const NftSolana = (connect, key) => {
  return async (dispatch) => {
    if (connect) {
      const connect = createConnectionConfig(clusterApiUrl("devnet"));
      let ownerToken = key;
      const result = isValidSolanaAddress(ownerToken);
      console.log("result", result);

      const nfts = await getParsedNftAccountsByOwner({
        publicAddress: ownerToken,
        connection: connect,
        serialization: true,
      });

      const allNfts = Object.keys(nfts).map((key) => nfts[key]);

      console.log(allNfts);

      dispatch({
        type: "SOLANA_NFT",
        payload: {
          nfts: allNfts,
        },
      });
    }
  };
};
