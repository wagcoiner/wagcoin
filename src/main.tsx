
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WagmiConfig } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { wagmiConfig } from './config/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a QueryClient instance
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider>
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </QueryClientProvider>
);
