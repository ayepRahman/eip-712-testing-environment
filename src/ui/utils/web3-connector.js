import { Connectors } from 'web3-react';
const {
  MetaMaskConnector,
  //  WalletConnectConnector,
  //  NetworkOnlyConnector
} = Connectors;

// const metaMask = new MetaMaskConnector({ supportedNetworks: 1 });
const metaMask = new MetaMaskConnector();

// const walletConnect = new WalletConnectConnector({
//   bridge: 'https://bridge.walletconnect.org',
//   supportedNetworkURLs: { 1: 'https://mainnet.infura.io/v3/...' },
//   defaultNetwork: 1,
// });

// const infura = new NetworkOnlyConnector({
//   providerURL: 'https://mainnet.infura.io/v3/...',
// });

export const connectors = {
  metaMask,
  //  walletConnect,
  // infura
};
