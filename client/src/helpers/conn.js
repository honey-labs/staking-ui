import { Connection, clusterApiUrl } from "@solana/web3.js";

//create a connection of devnet
const createConnection = () => {
  return new Connection(clusterApiUrl("devnet"));
};

export default createConnection;
