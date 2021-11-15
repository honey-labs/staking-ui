const initialState = {
  nft: "",
  loading: true,
  error: null,
};

const SolanaNftsReducer = async (state = initialState, action) => {
  switch (action.type) {
    case "SOLANA_NFT_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "SOLANA_NFT":
      const { nfts } = action.payload;

      return {
        ...state,
        nft: nfts,
        loading: false,
        error: null,
      };

    case "SOLANA_NFT_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default SolanaNftsReducer;
