import React, { useState, useEffect, useContext } from "react";
import { checkWalletDetails } from "../App";
import { clusterApiUrl } from "@solana/web3.js";
import axios from "axios";
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
  createConnectionConfig,
} from "@nfteyez/sol-rayz";

const WalletNft = () => {
  // use the useContext for get the all state value from App.js Component
  const { publicKey } = useContext(checkWalletDetails);

  // make state for storing all nft and validation
  const [WalletNft, setWallletNft] = useState({
    nft: [],
    loading: false,
    error: null,
  });

  // fetch all the nft from Phantom wallet
  const parseWalletNfts = async () => {
    try {
      if (publicKey) {
        // make connect for devnet and you can switch in mainnet
        // const connect = createConnectionConfig(clusterApiUrl("mainnet"));

        const connect = createConnectionConfig(clusterApiUrl("devnet"));

        // use isValidSolanaAddress for checking publicKey is valid or not
        const result = isValidSolanaAddress(publicKey);

        if (result) {
          // use getParsedNftAccountsByOwner for parse nft
          const nfts = await getParsedNftAccountsByOwner({
            publicAddress: publicKey,
            connection: connect,
            serialization: true,
          });

          //set values in state
          setWallletNft({ ...WalletNft, loading: true });

          // i got the object type but i need the array type for using map method
          // then i am changing object type in array
          const allNfts = Object.keys(nfts).map((key) => nfts[key]);

          // i got all nfts and metadata
          // console.log(allNfts);

          // then i am fetching all uri data and storing in array

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

            // then i am making the API for nft and i am storing all details in let object = {};
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

            //set values in state
            setWallletNft({ ...WalletNft, nft: nft_api, loading: false });
          }
        }
      }
    } catch (error) {
      //set values in state
      setWallletNft({ ...WalletNft, loading: false, error: error });
    }
  };

  // check publicKey is available using useEffect then calling a  parseWalletNfts() for parse NFT
  useEffect(() => {
    parseWalletNfts();
  }, [publicKey]);

  return (
    <>
      {publicKey ? (
        <>
          <section className="walletNft mt-5 pt-5 ">
            <div className="container">
              <div className="row">
                <div className="col-12 text-center">
                  <div className="nft_title">
                    <h3>Wallet Nft</h3>
                  </div>
                </div>
                <div className="col-12 mt-2 text-center">
                  <div className="row d-flex justify-content-center">
                    {WalletNft.loading ? (
                      <h4 className="mt-5 pt-4" style={{ color: "white" }}>
                        loading...
                      </h4>
                    ) : (
                      <>
                        {WalletNft.nft.map((val) => {
                          return (
                            <div className="col-4 mt-5">
                              <div className="nft_cart">
                                <div className="nft_img pt-4">
                                  <img src={val.image} alt="Loading..." />
                                </div>
                                <div className="nft_details mt-2">
                                  <p className="mt-1">{val.name}</p>
                                </div>
                                <button className="mb-3 mt-3">Stake</button>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default WalletNft;
