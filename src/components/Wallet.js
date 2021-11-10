import React, { useEffect, useState } from "react";
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";

console.log(web3);

//check solana on window
const getProvider = () => {
  if ("solana" in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open("https://phantom.app/", "_blank");
};

const Wallet = () => {
  const [logs, setLogs] = useState([]);
  const [connectData, setConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const addLog = (log) => setLogs([...logs, log]);

  const [nftAddress, setNftAddress] = useState([]);

  //create a connection of devnet
  const createConnection = () => {
    return new Connection(clusterApiUrl("devnet"));
  };

  //call provider
  const provider = getProvider();

  const getInfo = async () => {
    try {
      const phantomProvider = await getProvider();
      const mintRequester = await phantomProvider.publicKey;
      console.log(
        "Public key of the mint Requester: ",
        mintRequester.toString()
      );

      //To connect to the mainnet, write mainnet-beta instead of devnet
      const connection = new web3.Connection(
        web3.clusterApiUrl("devnet"),
        "confirmed"
      );

      //This fromWallet is your minting wallet, that will actually mint the tokens
      var fromWallet = web3.Keypair.generate();

      // Associate the mintRequester with this wallet's publicKey and privateKey
      // This is basically the credentials that the mintRequester (creator) would require whenever they want to mint some more tokens
      // Testing the parameters of the minting wallet

      console.log(
        "Creator's Minting wallet public key: ",
        fromWallet.publicKey.toString()
      );
      console.log(fromWallet.secretKey.toString());

      // Airdrop 1 SOL to the minting wallet to handle the minting charges
      var fromAirDropSignature = await connection.requestAirdrop(
        fromWallet.publicKey,
        web3.LAMPORTS_PER_SOL
      );

      await connection.confirmTransaction(fromAirDropSignature);
      console.log(
        "Airdropped (transferred) 1 SOL to the fromWallet to carry out minting operations"
      );

      // This createMint function returns a Promise <Token>
      let mint = await splToken.Token.createMint(
        connection,
        fromWallet,
        fromWallet.publicKey,
        null,
        6, // Number of decimal places in your token
        splToken.TOKEN_PROGRAM_ID
      );

      // getting or creating (if doens't exist) the token address in the fromWallet address
      // fromTokenAccount is essentially the account *inside* the fromWallet that will be able to handle the              new token that we just minted
      let fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
        fromWallet.publicKey
      );

      // getting or creating (if doens't exist) the token address in the toWallet address
      // toWallet is the creator: the og mintRequester
      // toTokenAmount is essentially the account *inside* the mintRequester's (creator's) wallet that will be able to handle the new token that we just minted
      let toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
        mintRequester
      );

      // // Minting 1 token
      await mint.mintTo(
        fromTokenAccount.address,
        fromWallet.publicKey,
        [],
        1000000 // 1 followed by decimals number of 0s // You'll ask the creator ki how many decimals he wants in his token. If he says 4, then 1 token will be represented as 10000
      );

      console.log("Initial mint successful");

      // This transaction is sending of the creator tokens(tokens you just created) from their minting wallet to their Phantom Wallet
      var transaction = new web3.Transaction().add(
        splToken.Token.createTransferInstruction(
          splToken.TOKEN_PROGRAM_ID,
          fromTokenAccount.address,
          toTokenAccount.address,
          fromWallet.publicKey,
          [],
          1000000 // This is transferring 1 token, not 1000000 tokens
        )
      );

      var signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [fromWallet],
        { commitment: "confirmed" }
      );

      const creatorTokenAddress = mint.publicKey;
      const creatorTokenAddressString = mint.publicKey.toString();

      console.log("SIGNATURE: ", signature); //Signature is basically like the paying party signs a transaction with their key.
      console.log("Creator Token Address: ", creatorTokenAddressString);
      console.log(
        "Creator Minting Wallet Address: ",
        mint.payer.publicKey.toString()
      );

      let creatorTokenBalance = await toTokenAccount.amount;
      console.log("Creator's Token Balance: ", creatorTokenBalance);
    } catch (error) {
      console.log(error);
    }
  };

  //get Account Balance
  const Balance = async () => {
    const connection = createConnection();
    if (provider.publicKey) {
      connection
        .getBalance(provider.publicKey)
        .then((bal) => {
          let bala = bal / LAMPORTS_PER_SOL;
          setBalance(bala);
        })
        .catch((err) => {
          console.error(`Error: ${err}`);
        });
    }
  };

  const TokenAccountsByOwner = async () => {
    try {
      const connection = createConnection();
      let ownerToken = provider.publicKey;
      console.log(ownerToken);

      if (provider.publicKey) {
        const spl = await connection.getTokenAccountsByOwner(ownerToken, {
          programId: splToken.TOKEN_PROGRAM_ID,
        });
        console.log(spl);
        setNftAddress(spl.value);
        // console.log(spl.value[0].pubkey.toString());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (provider) {
      provider.on("connect", () => {
        setConnected(true);
        addLog("Connected to wallet " + provider.publicKey.toBase58());
      });
      provider.on("disconnect", () => {
        setConnected(false);
        addLog("Disconnected from wallet");
      });
      // try to eagerly connect

      provider.connect({ onlyIfTrusted: true });

      return () => {
        provider.disconnect();
      };
    }
  }, [provider]);

  useEffect(() => {
    Balance();
    TokenAccountsByOwner();
  });

  return (
    <>
      <section className="wallet">
        <div className="container-fluid">
          <div className="row mt-4 mr-4">
            <div className="col-12 create_mint d-flex justify-content-end">
              <button onClick={getInfo}>create MINT</button>
            </div>
          </div>
          <div className="row">
            <div className="col-12 title text-center mt-5">
              <h2>Phantom Wallet</h2>
            </div>
            <div className="col-12 btn_group text mt-5 text-center">
              <button onClick={() => provider.connect()}>
                Connect to wallet
              </button>
              <button onClick={() => provider.disconnect()} className="ml-3">
                Disconnect to wallet
              </button>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12 text-center">
              <p className="show">{logs[0]}</p>
              <p className="mt-3">
                {connectData === true ? `Balance is ${balance} SOL` : ""}
              </p>
            </div>
          </div>
          <h6 className="text-center mt-5">NFT Address</h6>
          <div className="row ">
            <div className="col-12 mt-3 text-center">
              {nftAddress.map((val) => {
                return <p>{val.pubkey.toString()}</p>;
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Wallet;
