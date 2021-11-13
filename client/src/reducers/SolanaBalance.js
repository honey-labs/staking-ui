const initialState = {
  balance: "",
};

const SolanaBalanceReducer = async (state = initialState, action) => {
  switch (action.type) {
    case "SOLANA_Balance":
      const { balance } = action.payload;
      return {
        ...state,
        balance,
      };

    default:
      return state;
  }
};

export default SolanaBalanceReducer;
