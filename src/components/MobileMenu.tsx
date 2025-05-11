
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { 
  Home, 
  CalendarDays, 
  Users, 
  Award, 
  Gift, 
  Coins, 
  FileText, 
  Shield,
  X
} from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface MobileMenuProps {
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose }) => {
  const location = useLocation();
  const { user } = useWallet();
  const isAdmin = localStorage.getItem("wagcoin_admin") === "true";

  const menuItems = [
    { path: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { path: "/tasks", label: "Tasks", icon: <CalendarDays className="h-5 w-5" /> },
    { path: "/referrals", label: "Referrals", icon: <Users className="h-5 w-5" /> },
    { path: "/leaderboard", label: "Leaderboard", icon: <Award className="h-5 w-5" /> },
    { path: "/airdrop", label: "Airdrop", icon: <Gift className="h-5 w-5" /> },
    { path: "/coinomics", label: "Coinomics", icon: <Coins className="h-5 w-5" /> },
    { path: "/about", label: "About", icon: <FileText className="h-5 w-5" /> },
  ];

  if (isAdmin) {
    menuItems.push({ path: "/admin", label: "Admin", icon: <Shield className="h-5 w-5" /> });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <Link to="/" className="font-bold text-2xl text-neon-green flex items-center" onClick={onClose}>
          <img 
            src="/wagcoin-mascot.svg" 
            alt="WagChain"
            className="h-9 w-9 mr-2" 
          />
          <span>WagChain</span>
        </Link>
        <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-800">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                location.pathname === item.path
                  ? "bg-neon-green/10 text-neon-green"
                  : "text-gray-300 hover:bg-gray-800 hover:text-neon-green"
              }`}
            >
              <div className="mr-3">{item.icon}</div>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      {user && (
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded-md p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Balance:</span>
              <span className="font-medium text-neon-green flex items-center">
                <Coins className="mr-1 h-4 w-4" />
                {user.balance} $WAG
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Streak:</span>
              <span className="font-medium text-neon-green">{user.daily_streak} days</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4 border-t border-gray-800">
        {/* RainbowKit Connect Button */}
        <div className="flex justify-center">
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus="address"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
