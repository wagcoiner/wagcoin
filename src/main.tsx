
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig, chains } from './config/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

createRoot(document.getElementById("root")!).render(
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains}>
      <App />
    </RainbowKitProvider>
  </WagmiConfig>
);
