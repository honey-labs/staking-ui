const initialState = {
  nft: "",
};

const SolanaNftsReducer = async (state = initialState, action) => {
  switch (action.type) {
    case "SOLANA_NFT":
      const { nfts } = action.payload;

      return {
        ...state,
        nft: nfts,
      };

    default:
      return state;
  }
};

export default SolanaNftsReducer;
