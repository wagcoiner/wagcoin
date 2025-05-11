
import { getDefaultConfig } from 'connectkit';
import { createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// Set up the chains we want to support
// Using 'as const' to ensure TypeScript recognizes this as a readonly array
const chains = [mainnet, sepolia] as const;

// Create the wagmi config with ConnectKit
export const wagmiConfig = createConfig(
  getDefaultConfig({
    // Your app info
    appName: 'WagChain',
    
    // WalletConnect project ID
    // This is a proper WalletConnect project ID from WalletConnect Cloud
    walletConnectProjectId: 'b5886b9b1e0e76bb2e6a8f2f4387c6e8',
    
    // Define the chains to support
    chains,
  }),
);
