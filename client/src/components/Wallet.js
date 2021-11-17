import React, { useContext } from "react";
import { checkWalletDetails } from "../App";
import WalletNft from "./WalletNft";

const Wallet = () => {
  // use the useContext for get the all state value from App.js Component
  const { publicKey, loading, setWalletAddress, isSolana } =
    useContext(checkWalletDetails);

  // function for connect Phantom wallet
  const connectWallet = async () => {
    try {
      if (loading) {
        const connect = await isSolana.connect();

        // set values in state
        return setWalletAddress({
          publicKey: connect.publicKey.toString(),
          loading: false,
          message: "Phantom wallet is found",
        });
      }
    } catch (error) {
      // set values in state
      return setWalletAddress({
        loading: true,
        message: "Phantom wallet is not found",
        error: error.message,
      });
    }
  };

  return (
    <>
      <section className="wallet mb-5">
        <div className="container-fluid">
          <div className="row mt-4 pl-5 pr-5">
            <div className="col-6 create_mint_left d-flex align-items-center justify-content-start">
              <div className="title">
                <h4>Staking-ui</h4>
              </div>
            </div>
            <div className="col-6 create_mint_right d-flex justify-content-end">
              {!publicKey && (
                <button onClick={connectWallet}>Connect wallet</button>
              )}
              {publicKey && <button>{publicKey}</button>}
            </div>
          </div>
        </div>
        <WalletNft />
      </section>
    </>
  );
};

export default Wallet;
