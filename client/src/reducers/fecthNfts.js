const initialState = {
  loading: false,
  error: null,
  message: "",
  nfts: "",
};

const fetchNfts = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_WALLET_NFT_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "FETCH_WALLET_NFT":
      return {
        ...state,
        loading: false,
        nfts: action.payload,
      };

    case "FETCH_WALLET_NFT_MESSAGE":
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case "FETCH_WALLET_NFT_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default fetchNfts;
