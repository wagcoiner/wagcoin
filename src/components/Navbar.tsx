
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

const Navbar: React.FC = () => {
  const { walletAddress, user, isLoading, connect, disconnect } = useWallet();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/tasks", label: "Tasks" },
    { path: "/referrals", label: "Referrals" },
    { path: "/leaderboard", label: "Leaderboard" },
    { path: "/coinomics", label: "Coinomics" },
    { path: "/about", label: "About" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-neon-green/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-neon-green to-green-400 text-transparent bg-clip-text">
            WagChain
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  location.pathname === item.path
                    ? "text-neon-green"
                    : "text-gray-300 hover:text-neon-green"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {walletAddress && user ? (
            <>
              <div className="hidden md:flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-neon-green/30">
                <Coins className="h-4 w-4 text-neon-green" />
                <span className="text-neon-green font-bold">{user.balance}</span>
              </div>
              <Button
                onClick={disconnect}
                variant="outline"
                className="border-neon-green text-neon-green hover:bg-neon-green/10"
                size="sm"
              >
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)} | Disconnect
              </Button>
            </>
          ) : (
            <Button
              onClick={connect}
              disabled={isLoading}
              className="bg-neon-green hover:bg-neon-green/90 text-black"
              size="sm"
            >
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
