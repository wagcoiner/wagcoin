
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

const projectId = 'wagchain'; // This should be a proper project ID from WalletConnect Cloud

// Configure connectors for wallets
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains: [mainnet, sepolia] }),
      metaMaskWallet({ projectId, chains: [mainnet, sepolia] }),
      coinbaseWallet({ appName: 'WagChain', chains: [mainnet, sepolia] }),
      walletConnectWallet({ projectId, chains: [mainnet, sepolia] }),
      braveWallet({ chains: [mainnet, sepolia] })
    ],
  }
]);

// Create wagmi config
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors,
});
