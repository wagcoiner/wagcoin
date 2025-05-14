
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Menu, LogOut, LogIn } from "lucide-react";
import UserBalance from "./UserBalance";

interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const isAdmin = localStorage.getItem("wagcoin_admin") === "true";
  
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
          
          {/* Admin links - only shown if user is admin */}
          {isAdmin && (
            <>
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                  location.pathname === "/admin"
                    ? "text-neon-green bg-neon-green/10"
                    : "text-gray-300 hover:text-neon-green hover:bg-black/20"
                }`}
              >
                <Shield className="mr-1 h-4 w-4" />
                Tasks
              </Link>
              <Link
                to="/admin/users"
                className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                  location.pathname === "/admin/users"
                    ? "text-neon-green bg-neon-green/10"
                    : "text-gray-300 hover:text-neon-green hover:bg-black/20"
                }`}
              >
                <Shield className="mr-1 h-4 w-4" />
                Users
              </Link>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {profile && (
            <UserBalance size="small" showStreak={false} />
          )}

          {user ? (
            <Button 
              onClick={() => signOut()}
              variant="outline" 
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-950/30"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Button 
              asChild
              variant="default"
              size="sm"
              className="bg-neon-green hover:bg-neon-green/90 text-black"
            >
              <Link to="/auth">
                <LogIn className="mr-1 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
