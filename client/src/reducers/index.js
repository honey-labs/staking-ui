import { combineReducers } from "redux";
import ProviderReducer from "./SolanaProvider";
import SolanaConnectDisconnect from "./SolanaStart";
import SolanaNftsReducer from "./SolanaNfts";
import SolanaBalanceReducer from "./SolanaBalance";

const rootReducers = combineReducers({
  ProviderReducer,
  SolanaConnectDisconnect,
  SolanaNftsReducer,
  SolanaBalanceReducer,
});

export default rootReducers;
