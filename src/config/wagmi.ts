
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  braveWallet
} from '@rainbow-me/rainbowkit/wallets';
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// This is a proper WalletConnect project ID from WalletConnect Cloud
// You can get one at https://cloud.walletconnect.com/
const projectId = 'b5886b9b1e0e76bb2e6a8f2f4387c6e8';

// Define the chains
const chains = [mainnet, sepolia];

// Configure connectors for wallets
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet,
      metaMaskWallet,
      coinbaseWallet({
        appName: 'WagChain',
      }),
      walletConnectWallet,
      braveWallet
    ],
  }
], { projectId });

// Create wagmi config
export const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors,
});
