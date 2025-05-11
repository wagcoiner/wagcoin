
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

// Configure chains & providers
const { chains, publicClient } = configureChains(
  [mainnet, sepolia], // Add the chains you want to support
  [publicProvider()]
);

// Set up wagmi config
const { connectors } = getDefaultWallets({
  appName: 'WagChain',
  projectId: 'wagchain', // This can be any string, but for WalletConnect you'd need a proper projectId from https://cloud.walletconnect.com
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { chains };
