
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";
import { Award, Coins } from "lucide-react";
import { motion } from "framer-motion";

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("balance", { ascending: false })
          .limit(20);

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    // Set up real-time subscription for user balance changes
    const usersSubscription = supabase
      .channel('leaderboard-changes')
      .on('postgres_changes', 
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: 'balance=gt.0'
        }, 
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usersSubscription);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">$WAGCoin Leaderboard</h1>
        <p className="text-xl text-gray-300">
          Top earners in the WagChain community
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="border-neon-green/20 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Award className="h-5 w-5 text-neon-green" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center">
                <p className="text-gray-400">Loading leaderboard...</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                <div className="grid grid-cols-12 gap-4 py-3 px-4 font-medium text-gray-400">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">Wallet</div>
                  <div className="col-span-2 text-right">Tasks</div>
                  <div className="col-span-2 text-right">Streak</div>
                  <div className="col-span-2 text-right">Balance</div>
                </div>
                
                {users.map((user, index) => (
                  <UserRow key={user.id} user={user} position={index + 1} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const UserRow: React.FC<{ user: User; position: number }> = ({ user, position }) => {
  const getPositionStyle = (pos: number) => {
    if (pos === 1) return "text-amber-400 font-bold";
    if (pos === 2) return "text-gray-300 font-bold"; 
    if (pos === 3) return "text-amber-700 font-bold";
    return "text-gray-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: position * 0.05 }}
      className={`grid grid-cols-12 gap-4 py-3 px-4 hover:bg-gray-800/30 transition-colors items-center ${position <= 3 ? 'bg-gray-800/20' : ''}`}
    >
      <div className={`col-span-1 ${getPositionStyle(position)}`}>
        {position <= 3 ? (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-neon-green/20 to-transparent">
            {position}
          </div>
        ) : (
          position
        )}
      </div>
      
      <div className="col-span-5 font-mono">
        {user.wallet_address.substring(0, 6)}...{user.wallet_address.substring(user.wallet_address.length - 4)}
      </div>
      
      <div className="col-span-2 text-right">
        {user.total_tasks_completed}
      </div>
      
      <div className="col-span-2 text-right">
        <div className="flex items-center justify-end gap-1">
          <Award className="h-3 w-3 text-neon-green" />
          {user.daily_streak} days
        </div>
      </div>
      
      <div className="col-span-2 text-right font-bold">
        <div className="flex items-center justify-end gap-1 text-neon-green">
          <Coins className="h-4 w-4" />
          {user.balance}
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
