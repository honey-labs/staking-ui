const initialState = {
  validate: "",
};

const ProviderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_PROVIDER":
      const getProvider = () => {
        if ("solana" in window) {
          const provider = window.solana;
          if (provider.isPhantom) {
            return provider;
          }
        }
        window.open("https://phantom.app/", "_blank");
      };
      const provider = getProvider();
      return {
        ...state,
        validate: provider,
      };

    default:
      return state;
  }
};

export default ProviderReducer;
