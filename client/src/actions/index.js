import createConnection from "../helpers/conn";
import axios from "axios";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { clusterApiUrl } from "@solana/web3.js";
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
  createConnectionConfig,
} from "@nfteyez/sol-rayz";
import Api from "../api/api";

//check provider in window
export const CheckProvider = () => {
  return async (dispatch) => {
    dispatch({
      type: "CHECK_PROVIDER_REQUEST",
    });

    try {
      if ("solana" in window) {
        const provider = window.solana;
        if (provider.isPhantom) {
          dispatch({
            type: "CHECK_PROVIDER",
            payload: provider,
          });
        }
      } else {
        window.open("https://phantom.app/", "_blank");
      }
    } catch (error) {
      dispatch({
        type: "CHECK_PROVIDER_FAILURE",
        payload: error,
      });
    }
  };
};

//solana connect
export const SolanaConnect = (key) => {
  return async (dispatch) => {
    dispatch({
      type: "CONNECT_SOLANA_REQUEST",
    });
    try {
      const connection = createConnection();
      const bal = await connection.getBalance(key);
      let balance = bal / LAMPORTS_PER_SOL;

      await axios.post(Api.userWallet, {
        balance: balance,
        publicKey: `${key}`,
      });

      dispatch({
        type: "CONNECT_SOLANA",
        payload: {
          balance: balance,
          key: key,
        },
      });
    } catch (error) {
      dispatch({
        type: "CONNECT_SOLANA_FAILURE",
        payload: error,
      });
    }
  };
};

//solana disconnect
export const SolanaDisConnect = () => {
  return {
    type: "DISCONNECT_SOLANA",
  };
};

//check wallet NFT
export const NftSolana = (connect, key) => {
  return async (dispatch) => {
    dispatch({
      type: "SOLANA_NFT_REQUEST",
    });

    try {
      if (connect) {
        const connect = createConnectionConfig(clusterApiUrl(process.env.REACT_APP_NETWORK));
        let ownerToken = key;
        const result = isValidSolanaAddress(ownerToken);

        if (result) {
          const nfts = await getParsedNftAccountsByOwner({
            publicAddress: ownerToken,
            connection: connect,
            serialization: true,
          });

          const allNfts = Object.keys(nfts).map((key) => nfts[key]);

          if (allNfts.length > 0) {
            const fun = async (x) => {
              try {
                let arr = [];
                let n = x.length;

                for (let i = 0; i < n; i++) {
                  let val = await axios.get(x[i].data.uri);
                  arr.push(val);
                }
                return arr;
              } catch (error) {
                console.log(error);
              }
            };

            const URI_DATA = await fun(allNfts);

            const nft_api = [];

            for (let i = 0; i < allNfts.length; i++) {
              const nft = allNfts[i];
              const uri = URI_DATA[i];

              let object = {
                name: uri.data.name,
                description: uri.data.description,
                image: uri.data.image,
                creatorsAddress: uri.data.properties.creators[0].address,
                address: nft.mint.toString(),
                uri: nft.data.uri,
              };

              nft_api.push(object);
            }

            await axios.post(Api.nft, {
              nft: nft_api,
              walletAddress: `${ownerToken}`,
            });

            dispatch({
              type: "SOLANA_NFT",
              payload: {
                nfts: nft_api,
              },
            });
          }
        }
      }
    } catch (error) {
      dispatch({
        type: "SOLANA_NFT_FAILURE",
        payload: error,
      });
    }
  };
};
