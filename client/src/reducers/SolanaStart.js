const initialState = {
  publicKey: "",
  balance: "",
  connect: false,
  message: "",
  error: null,
  loading: false,
};

const SolanaConnectDisconnect = (state = initialState, action) => {
  switch (action.type) {
    case "CONNECT_SOLANA_REQUEST":
      return {
        ...state,
        connect: false,
        loading: true,
        error: null,
      };

    case "CONNECT_SOLANA":
      const { balance, key } = action.payload;
      return {
        ...state,
        publicKey: key,
        balance: balance,
        connect: true,
        loading: false,
        message: "Connected to wallet " + key,
      };

    case "CONNECT_SOLANA_FAILURE":
      return {
        ...state,
        connect: false,
        loading: false,
        error: action.payload,
      };

    case "DISCONNECT_SOLANA":
      return {
        ...state,
        publicKey: "",
        connect: false,
        message: "Disconnected from wallet",
      };

    default:
      return state;
  }
};

export default SolanaConnectDisconnect;
