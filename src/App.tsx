
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/contexts/WalletContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Tasks from "@/pages/Tasks";
import Referrals from "@/pages/Referrals";
import Leaderboard from "@/pages/Leaderboard";
import Coinomics from "@/pages/Coinomics";
import About from "@/pages/About";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import Airdrop from "@/pages/Airdrop";
import NotFound from "@/pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/coinomics" element={<Coinomics />} />
              <Route path="/airdrop" element={<Airdrop />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
