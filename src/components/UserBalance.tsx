
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Coins, Award } from "lucide-react";
import { motion } from "framer-motion";

interface UserBalanceProps {
  showStreak?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
}

const UserBalance: React.FC<UserBalanceProps> = ({ 
  showStreak = true, 
  size = "medium", 
  className = "" 
}) => {
  const { profile } = useAuth();
  
  if (!profile) return null;

  const sizeStyles = {
    small: {
      container: "p-2 rounded-md",
      iconSize: "h-3 w-3",
      textSize: "text-sm",
    },
    medium: {
      container: "px-3 py-2 rounded-md",
      iconSize: "h-4 w-4",
      textSize: "text-base",
    },
    large: {
      container: "px-4 py-3 rounded-lg",
      iconSize: "h-5 w-5",
      textSize: "text-lg",
    },
  };
  
  return (
    <div className={`bg-gray-900 border border-neon-green/20 ${sizeStyles[size].container} ${className}`}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center gap-1.5">
          <Coins className={`text-neon-green ${sizeStyles[size].iconSize}`} />
          <motion.span
            key={profile.balance}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`font-medium text-neon-green ${sizeStyles[size].textSize}`}
          >
            {profile.balance} $WAG
          </motion.span>
        </div>
        
        {showStreak && (
          <>
            <div className="h-4 w-px bg-gray-700"></div>
            <div className="flex items-center gap-1.5">
              <Award className={`text-neon-green ${sizeStyles[size].iconSize}`} />
              <span className={`font-medium text-neon-green ${sizeStyles[size].textSize}`}>
                {profile.daily_streak} days
              </span>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default UserBalance;
