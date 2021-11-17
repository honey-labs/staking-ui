import { useState, useEffect, useCallback } from "react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
// import axios from "axios";
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
  createConnectionConfig,
} from "@nfteyez/sol-rayz";
import "./styles.css";

type PhantomEvent = "disconnect" | "connect";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  autoApprove: boolean | null;
  connect: (
    opts?: Partial<ConnectOpts>
  ) => Promise<{ publicKey: PublicKey; autoApprove: boolean }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

type Cluster = 'devnet' | 'testnet' | 'mainnet-beta';

const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open("https://phantom.app/", "_blank");
};

const NETWORK = clusterApiUrl(process.env.REACT_APP_NETWORK as Cluster);

export default function App() {
  const provider = getProvider();
  const [, setConnected] = useState<boolean>(false);
  const [NftList, setNftList] = useState(Array);
  const [loading, setLoading] = useState(true);

  // get NFT info callback to use async for useEffect  
  const useListProvider = () => {
    const callback = useCallback(async (ownerToken, connect) => {
      const nfts = await getParsedNftAccountsByOwner({
        publicAddress: ownerToken,
        connection: connect,
        sanitize: true,
      });

      const allNfts = Object.keys(nfts).map((key) => nfts[key]);
      return allNfts;
    }, []);

    return { callback };
  }

  const { callback } = useListProvider();

  useEffect(() => {
    if (provider) {
      provider.on("connect", () => {
        setConnected(true);
        try {
          const connect = createConnectionConfig(NETWORK);
          let ownerToken: any = provider.publicKey;
          const result = isValidSolanaAddress(ownerToken);
  
          if (result) {
            setLoading(true);
            callback(ownerToken, connect).then((NFTs: any) => {
              setNftList(NFTs);
              setLoading(false);
            });
          }
        } catch (error) {
          console.log("err");
        }
      });
      provider.on("disconnect", () => {
        setConnected(false);
        setLoading(true)
        setNftList([]);
      });
      // try to eagerly connect
      provider.connect({ onlyIfTrusted: true });
      return () => {
        provider.disconnect();
      };
    }
  }, [provider]);
  if (!provider) {
    return <h2>Could not find a provider</h2>;
  }
  
  return (
    <div className="App">
      <h1>Solana NFT</h1>
      <main>
        {provider && provider.publicKey ? (
          <>
            <div>{provider.publicKey?.toBase58()}.</div>
            <button
              onClick={async () => {
                try {
                  const res = await provider.disconnect();
                } catch (err) {
                  console.warn(err);
                }
              }}
            >
              Disconnect
            </button>
          </>
        ) : (
          <>
            <button
              onClick={async () => {
                try {
                  const res = await provider.connect();
                } catch (err) {
                  console.warn(err);
                }
              }}
            >
              Connect to Phantom
            </button>
          </>
        )}
        {!provider.isConnected? (
          <></>
        ) : (
          !loading ? (
          <div className="row">
            {NftList && NftList.length > 0 ? (
              NftList.map((val: any, ind) => {
                return (
                  <div className="col-lg-6 col-sm-12 mt-3" key={ind}>
                    <div className="cart text-center">
                      <div className="img mt-4 pt-3">
                        <p className="mt-1">Name: {val.data.name}</p>
                        <h6 className=" mt-2">MetaData URI: <br /> {val.data.uri}</h6>
                      </div>
                      <div className="group mb-4 mt-4 text-center">
                        <button className="m-auto pl-4 pr-4">Stake</button>
                      </div>
                    </div>
                  </div>
                );
            })) : (
              <>
                <p className="text-center">No NFT</p>
              </>
            )
            }
          </div>
          ) : (
            <>
              <p className="text-center">loading...</p>
            </>
          )
        )}
      </main>
    </div>
  );
}
