import React, { useEffect, useState, createContext } from "react";
import Wallet from "./components/Wallet";

//  crate a createContext for passing state data in every component
export const checkWalletDetails = createContext();

const App = () => {
  const [isSolana, setIsSolana] = useState();
  const [walletAddress, setWalletAddress] = useState({
    publicKey: "",
    loading: true,
    error: null,
    message: "",
  });

  //solana check in window
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          setIsSolana(solana);
          const response = await solana.connect({ onlyIfTrusted: true });

          // set values in state
          setWalletAddress({
            ...walletAddress,
            publicKey: response.publicKey.toString(),
            loading: false,
            message: "Phantom wallet is found",
          });
        }
      }
    } catch (error) {
      // set values in state
      setWalletAddress({
        ...walletAddress,
        loading: true,
        message: "Phantom wallet is not found",
        error: error.message,
      });
    }
  };

  useEffect(() => {
    // calling checkIfWalletIsConnected() function for checking solana in window or not
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <>
      {/* Provider the state data in wallet component  */}
      <checkWalletDetails.Provider
        value={{ ...walletAddress, setWalletAddress, isSolana }}
      >
        <Wallet />
      </checkWalletDetails.Provider>
    </>
  );
};

export default App;
