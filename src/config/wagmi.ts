
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// Set up wagmi config
const { wallets } = getDefaultWallets({
  appName: 'WagChain',
  projectId: 'wagchain', // This can be any string, but for WalletConnect you'd need a proper projectId from https://cloud.walletconnect.com
  chains: [mainnet, sepolia],
});

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: wallets,
});

