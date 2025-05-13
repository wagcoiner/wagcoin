
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Coins, CheckSquare, Award } from "lucide-react";
import { UserProfile } from "@/contexts/AuthContext";

interface BalanceCardsProps {
  profile: UserProfile;
}

const BalanceCards: React.FC<BalanceCardsProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-neon-green/20 bg-gray-900 p-6 hover:bg-gray-800 transition-all">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-neon-green/10 flex items-center justify-center mb-3">
              <Coins className="h-6 w-6 text-neon-green" />
            </div>
            <motion.h3 
              key={profile.balance}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-neon-green mb-1"
            >
              {profile.balance}
            </motion.h3>
            <p className="text-gray-400">Total $WAGCoin Earned</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-neon-green/20 bg-gray-900 p-6 hover:bg-gray-800 transition-all">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
              <CheckSquare className="h-6 w-6 text-blue-400" />
            </div>
            <motion.h3 
              key={profile.total_tasks_completed}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-blue-400 mb-1"
            >
              {profile.total_tasks_completed}
            </motion.h3>
            <p className="text-gray-400">Tasks Completed</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-neon-green/20 bg-gray-900 p-6 hover:bg-gray-800 transition-all">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-3">
              <Award className="h-6 w-6 text-yellow-400" />
            </div>
            <motion.h3 
              key={profile.daily_streak}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-yellow-400 mb-1"
            >
              {profile.daily_streak}
            </motion.h3>
            <p className="text-gray-400">Day Streak</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default BalanceCards;
