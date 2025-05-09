
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { useReferralFromURL } from "@/utils/referral";
import { Wallet, Coins } from "lucide-react";

const Navbar = () => {
  const { walletAddress, user, connect, disconnect, isLoading } = useWallet();
  const location = useLocation();
  const referralCode = useReferralFromURL();
  
  const handleConnect = () => {
    connect(referralCode);
  };

  return (
    <header className="fixed z-50 w-full bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-2xl text-neon-green flex items-center">
          <span className="mr-2">WagChain</span>
          <img
            src="https://upload.wikimedia.org/wikipedia/en/5/58/Doge_meme_photo.jpg"
            alt="WagChain"
            className="h-8 w-8 rounded-full bg-neon-green/20 p-1"
          />
        </Link>
        
        <div className="hidden md:flex items-center gap-2">
          {[
            { path: "/", label: "Home" },
            { path: "/tasks", label: "Tasks" },
            { path: "/referrals", label: "Referrals" },
            { path: "/leaderboard", label: "Leaderboard" },
            { path: "/coinomics", label: "Coinomics" },
            { path: "/about", label: "About" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-md transition-colors ${
                location.pathname === item.path
                  ? "text-neon-green bg-neon-green/10"
                  : "text-gray-300 hover:text-neon-green hover:bg-black/20"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-900 border border-neon-green/20">
              <Coins className="text-neon-green h-4 w-4" />
              <span className="text-neon-green font-medium">{user.balance}</span>
            </div>
          )}
          
          {walletAddress ? (
            <Button
              variant="outline"
              className="border-neon-green/50 text-neon-green hover:bg-neon-green/10"
              onClick={disconnect}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </Button>
          ) : (
            <Button
              onClick={handleConnect}
              className="bg-neon-green hover:bg-neon-green/90 text-black"
              disabled={isLoading}
            >
              <Wallet className="mr-2 h-4 w-4" /> 
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
