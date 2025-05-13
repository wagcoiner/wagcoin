
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReferredUser } from "@/types";
import { Coins, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

interface ReferredUsersListProps {
  referredUsers: ReferredUser[];
  isLoading: boolean;
}

const ReferredUsersList: React.FC<ReferredUsersListProps> = ({ 
  referredUsers, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-neon-green border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (referredUsers.length === 0) {
    return (
      <div className="text-center py-10">
        <Award className="h-12 w-12 text-neon-green/30 mx-auto mb-2" />
        <p className="text-gray-400">No referred users yet</p>
        <p className="text-sm text-gray-500 mt-1">Share your link to start earning!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {referredUsers.map((referredUser, index) => (
        <motion.div
          key={referredUser.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <div 
            className="p-3 bg-black/50 border border-neon-green/20 rounded-lg flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center">
                <Users className="h-4 w-4 text-neon-green" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {referredUser.username || "User"}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(referredUser.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center text-neon-green font-medium">
              <Coins className="h-4 w-4 mr-1" /> +50
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ReferredUsersList;
