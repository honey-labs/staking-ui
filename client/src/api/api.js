const homepage = process.env.REACT_APP_API_URI;

const Api = {
  userWallet: `${homepage}/api/wallet/userWallet`,
  nft: `${homepage}/api/wallet/nft`,
  fetchNft: `${homepage}/api/wallet/fetchNft`,
};
export default Api;
