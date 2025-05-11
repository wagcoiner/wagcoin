
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

// This should be a proper project ID from WalletConnect Cloud
const projectId = 'YOUR_PROJECT_ID'; 

const chains = [mainnet, sepolia];

// Configure connectors for wallets
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ projectId }),
      metaMaskWallet({ projectId }),
      coinbaseWallet({ appName: 'WagChain', projectId }),
      walletConnectWallet({ projectId }),
      braveWallet({ projectId })
    ],
  }
]);

// Create wagmi config
export const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors,
});

