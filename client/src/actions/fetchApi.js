import axios from "axios";
import Api from "../api/api";

export const fetchWalletNft = (key) => {
  return async (dispatch) => {
    dispatch({
      type: "FETCH_WALLET_NFT_REQUEST",
    });

    try {
      const res = await axios.post(Api.fetchNft, {
        key: `${key}`,
      });

      if (res.status === 201) {
        dispatch({
          type: "FETCH_WALLET_NFT",
          payload: res.data.nfts,
        });
      } else if (res.status === 206) {
        dispatch({
          type: "FETCH_WALLET_NFT_MESSAGE",
          payload: res.data.message,
        });
      }
    } catch (error) {
      dispatch({
        type: "FETCH_WALLET_NFT_FAILURE",
        payload: error,
      });
    }
  };
};
