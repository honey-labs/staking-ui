const initialState = {
  provider: "",
  loading: true,
  error: null,
};

const ProviderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_PROVIDER_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "CHECK_PROVIDER":
      return {
        ...state,
        provider: action.payload,
        loading: false,
        error: null,
      };

    case "CHECK_PROVIDER_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default ProviderReducer;
