
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Gift, Zap, Clock, CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AirdropPage = () => {
  const { user } = useAuth();
  
  // Airdrop date: October 15, 2025 00:00 UTC
  const airdropDate = new Date('2025-10-15T00:00:00Z');
  
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = airdropDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        // Airdrop time has arrived
        clearInterval(timer);
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gray-800 text-neon-green text-3xl font-bold py-3 px-4 rounded-lg min-w-[70px] text-center">
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-sm mt-2 text-gray-400">{label}</span>
    </div>
  );
  
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
        <motion.div 
          className="text-center max-w-4xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-4">
            <div className="bg-neon-green/20 p-3 rounded-full">
              <Gift className="h-12 w-12 text-neon-green" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-emerald-400">
            $WAGCoin Airdrop
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            The WagCoin airdrop is around the corner! Keep earning and spreading the word. 
            Claiming begins October 15.
          </p>
        </motion.div>
        
        <motion.div
          className="w-full max-w-4xl mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-black border border-neon-green/30 overflow-hidden">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-8 text-center">Airdrop Countdown</h2>
              <div className="flex justify-center gap-4 md:gap-8 mb-8">
                <CountdownUnit value={countdown.days} label="Days" />
                <CountdownUnit value={countdown.hours} label="Hours" />
                <CountdownUnit value={countdown.minutes} label="Minutes" />
                <CountdownUnit value={countdown.seconds} label="Seconds" />
              </div>
              
              <div className="text-center">
                {user ? (
                  <p className="text-neon-green mb-4">Your account is connected and ready for the airdrop!</p>
                ) : (
                  <p className="text-yellow-400 mb-4">Sign up or log in to be eligible for the airdrop</p>
                )}
                
                <div className="mt-4 flex justify-center">
                  {!user ? (
                    <Button asChild className="bg-neon-green hover:bg-neon-green/90 text-black">
                      <Link to="/auth">Sign In / Sign Up</Link>
                    </Button>
                  ) : (
                    <Button asChild className="bg-neon-green hover:bg-neon-green/90 text-black">
                      <Link to="/tasks">Complete Tasks</Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          className="w-full max-w-4xl mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">How to Maximize Your Airdrop</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border border-neon-green/20 hover:border-neon-green/50 transition-all">
              <CardContent className="p-6">
                <div className="bg-neon-green/20 p-3 rounded-full w-fit mb-4">
                  <CalendarDays className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Complete Tasks</h3>
                <p className="text-gray-400">
                  Finish daily and weekly tasks to earn more $WAGCoin and boost your airdrop eligibility.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border border-neon-green/20 hover:border-neon-green/50 transition-all">
              <CardContent className="p-6">
                <div className="bg-neon-green/20 p-3 rounded-full w-fit mb-4">
                  <Users className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Refer Friends</h3>
                <p className="text-gray-400">
                  Invite friends to join WagChain and earn additional rewards for each referral.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border border-neon-green/20 hover:border-neon-green/50 transition-all">
              <CardContent className="p-6">
                <div className="bg-neon-green/20 p-3 rounded-full w-fit mb-4">
                  <Zap className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Stay Active</h3>
                <p className="text-gray-400">
                  Remain active on the platform to improve your airdrop allocation and ranking.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AirdropPage;
