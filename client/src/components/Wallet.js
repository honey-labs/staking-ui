import React, { useEffect, useState } from "react";
import NFT from "./NFT";
import { useSelector, useDispatch } from "react-redux";
import { SolanaConnect, SolanaDisConnect, NftSolana } from "../actions/index";
import { fetchWalletNft } from "../actions/fetchApi";

const Wallet = () => {
  const dispatch = useDispatch();
  const SolanaProvider = useSelector((state) => state.ProviderReducer);
  const SolanaStart = useSelector((state) => state.SolanaConnectDisconnect);
  const SolanaNfts = useSelector((state) => state.SolanaNftsReducer);
  const NftState = useSelector((state) => state.fetchNfts);
  const [nfts, setNfts] = useState([]);

  NftState.then((nft) => {
    setNfts(nft);
  });

  useEffect(() => {
    if (SolanaProvider.provider && SolanaProvider.loading === false) {
      SolanaProvider.provider.on("connect", () => {
        let key = SolanaProvider.provider.publicKey;

        dispatch(SolanaConnect(key));
      });
      SolanaProvider.provider.on("disconnect", () => {
        dispatch(SolanaDisConnect());
      });

      SolanaProvider.provider.connect({ onlyIfTrusted: true });

      return () => {
        SolanaProvider.provider.disconnect();
      };
    }
  }, [SolanaProvider.provider]);

  useEffect(() => {
    dispatch(NftSolana(SolanaStart.connect, SolanaProvider.provider.publicKey));
  }, [SolanaStart.connect === true]);

  useEffect(() => {
    dispatch(fetchWalletNft(SolanaProvider.provider.publicKey));
  }, [SolanaStart.loading === false]);

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
              <div className="row">
                <div className="col-6 lg-text-right">
                  <button onClick={() => SolanaProvider.provider.connect()} className="btn btn-primary">
                    Connect to wallet
                  </button>
                </div>
                <div className="col-6 lg-text-left">
                  <button onClick={() => SolanaProvider.provider.disconnect()} className="btn btn-secondary">
                    Disconnect to wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12 text-center">
              <p className="show">{SolanaStart.message}</p>

              <p className="mt-3">
                {SolanaStart.connect
                  ? `Balance is ${SolanaStart.balance} SOL`
                  : ""}
              </p>
            </div>
          </div>

          <NFT nft={nfts} connect={SolanaStart.connect} />
        </div>
      </section>
    </>
  );
};

export default Wallet;
