import { combineReducers } from "redux";
import ProviderReducer from "./SolanaProvider";
import SolanaConnectDisconnect from "./SolanaStart";
import SolanaNftsReducer from "./SolanaNfts";
import fetchNfts from "./SolanaNfts";

const rootReducers = combineReducers({
  ProviderReducer,
  SolanaConnectDisconnect,
  SolanaNftsReducer,
  fetchNfts,
});

export default rootReducers;
