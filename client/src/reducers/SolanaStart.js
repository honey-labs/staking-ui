const initialState = {
  publicKey: "",
  connect: "",
  message: "",
};

const SolanaConnectDisconnect = (state = initialState, action) => {
  switch (action.type) {
    case "CONNECT_SOLANA":
      const { key } = action.payload;

      return {
        publicKey: key,
        connect: true,
        message: "Connected to wallet " + key,
      };

    case "DISCONNECT_SOLANA":
      return {
        publicKey: "",
        connect: false,
        message: "Disconnected from wallet",
      };

    default:
      return state;
  }
};

export default SolanaConnectDisconnect;
