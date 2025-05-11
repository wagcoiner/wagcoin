
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WagmiConfig } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { wagmiConfig } from './config/wagmi';

createRoot(document.getElementById("root")!).render(
  <WagmiConfig config={wagmiConfig}>
    <ConnectKitProvider>
      <App />
    </ConnectKitProvider>
  </WagmiConfig>
);
