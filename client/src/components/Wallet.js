import React, { useEffect, useState } from "react";
import NFT from "./NFT";
import { useSelector, useDispatch } from "react-redux";
import {
  SolanaConnect,
  SolanaDisConnect,
  BalanceSolana,
  NftSolana,
} from "../actions/index";

const Wallet = () => {
  const dispatch = useDispatch();
  const SolanaProvider = useSelector((state) => state.ProviderReducer.validate);
  const SolanaStart = useSelector((state) => state.SolanaConnectDisconnect);
  const SolanaBalance = useSelector((state) => state.SolanaBalanceReducer);
  const SolanaNfts = useSelector((state) => state.SolanaNftsReducer);
  const [nfts, setNfts] = useState([]);
  const [balance, setBalance] = useState();

  SolanaBalance.then((bal) => {
    setBalance(bal.balance);
  });

  SolanaNfts.then((nft) => {
    setNfts(nft.nft);
  });

  useEffect(() => {
    if (SolanaProvider) {
      SolanaProvider.on("connect", () => {
        let key = SolanaProvider.publicKey;
        dispatch(SolanaConnect(key));
      });
      SolanaProvider.on("disconnect", () => {
        dispatch(SolanaDisConnect());
      });

      SolanaProvider.connect({ onlyIfTrusted: true });

      return () => {
        SolanaProvider.disconnect();
      };
    }
  }, [SolanaProvider]);

  useEffect(() => {
    dispatch(BalanceSolana(SolanaStart.connect, SolanaProvider.publicKey));
    dispatch(NftSolana(SolanaStart.connect, SolanaProvider.publicKey));
  }, [SolanaStart.connect === true]);

  return (
    <>
      <section className="wallet">
        <div className="container-fluid">
          <div className="row mt-4 mr-4">
            <div className="col-12 create_mint d-flex justify-content-end">
              {/* <button onClick={getInfo}>create MINT</button> */}
            </div>
          </div>
          <div className="row">
            <div className="col-12 title text-center mt-5">
              <h2>Phantom Wallet</h2>
            </div>
            <div className="col-12 btn_group text mt-5 text-center">
              <button onClick={() => SolanaProvider.connect()}>
                Connect to wallet
              </button>
              <button
                onClick={() => SolanaProvider.disconnect()}
                className="ml-3"
              >
                Disconnect to wallet
              </button>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12 text-center">
              <p className="show">{SolanaStart.message}</p>

              <p className="mt-3">
                {SolanaStart.connect === true
                  ? `Balance is ${balance} SOL`
                  : ""}
              </p>
            </div>
          </div>

          <NFT nft={nfts} valid={SolanaStart.connect} />
        </div>
      </section>
    </>
  );
};

export default Wallet;
