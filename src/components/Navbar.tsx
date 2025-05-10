
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { useReferralFromURL } from "@/utils/referral";
import { Wallet, Coins, Loader2, Shield, Menu } from "lucide-react";

interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { walletAddress, user, connect, disconnect, isLoading, isConnecting } = useWallet();
  const location = useLocation();
  const referralCode = useReferralFromURL();
  const isAdmin = localStorage.getItem("wagcoin_admin") === "true";
  
  const handleConnect = () => {
    connect(referralCode);
  };

  return (
    <header className="fixed z-50 w-full bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="mr-3 md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={onOpenMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="font-bold text-2xl text-neon-green flex items-center">
            <img 
              src="/wagcoin-mascot.svg" 
              alt="WagChain"
              className="h-9 w-9 mr-2" 
            />
            <span>WagChain</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          {[
            { path: "/", label: "Home" },
            { path: "/tasks", label: "Tasks" },
            { path: "/referrals", label: "Referrals" },
            { path: "/leaderboard", label: "Leaderboard" },
            { path: "/airdrop", label: "Airdrop" },
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
          
          {/* Admin link - only shown if admin is logged in */}
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                location.pathname === "/admin"
                  ? "text-neon-green bg-neon-green/10"
                  : "text-gray-300 hover:text-neon-green hover:bg-black/20"
              }`}
            >
              <Shield className="mr-1 h-4 w-4" />
              Admin
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-900 border border-neon-green/20">
              <Coins className="text-neon-green h-4 w-4" />
              <span className="text-neon-green font-medium">{user.balance}</span>
            </div>
          )}

          {isLoading ? (
            <Button variant="outline" disabled className="border-neon-green/50 text-neon-green">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          ) : walletAddress ? (
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
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" /> 
                  Connect Wallet
                </>
              )}
            </Button>
          )}
          
          {/* Admin Login Button - only shown if not admin */}
          {!isAdmin && location.pathname !== "/admin-login" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-300"
              asChild
            >
              <Link to="/admin-login">
                <Shield className="h-4 w-4 mr-1" />
                Admin
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
