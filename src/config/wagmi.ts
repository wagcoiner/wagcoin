
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
      injectedWallet(),
      metaMaskWallet({ projectId }),
      coinbaseWallet({ appName: 'WagChain' }),
      walletConnectWallet({ projectId }),
      braveWallet()
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
