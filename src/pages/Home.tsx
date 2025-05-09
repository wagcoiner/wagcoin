
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { useReferralFromURL } from "@/utils/referral";
import { motion } from "framer-motion";

const Home = () => {
  const { walletAddress, user, connect } = useWallet();
  const referralCode = useReferralFromURL();
  
  const handleConnectWallet = () => {
    connect(referralCode);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
        <motion.div 
          className="text-center max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-emerald-400">
            Earn $WAGCoin<br />by Completing Tasks
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Connect your wallet and start earning rewards on the WagChain platform. Complete tasks, refer friends, and climb the leaderboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!walletAddress ? (
              <Button 
                onClick={handleConnectWallet}
                size="lg" 
                className="bg-neon-green hover:bg-neon-green/90 text-black text-lg px-8"
              >
                Connect Wallet
              </Button>
            ) : (
              <>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-neon-green hover:bg-neon-green/90 text-black text-lg px-8"
                >
                  <Link to="/tasks">Start Earning</Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-neon-green/50 text-neon-green hover:bg-neon-green/10"
                >
                  <Link to="/referrals">Invite Friends</Link>
                </Button>
              </>
            )}
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div 
              className="bg-gray-900 p-6 rounded-xl border border-neon-green/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-neon-green font-bold text-xl mb-2">Complete Tasks</div>
              <p className="text-gray-300">Earn $WAGCoin by completing daily and weekly tasks on our platform.</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900 p-6 rounded-xl border border-neon-green/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-neon-green font-bold text-xl mb-2">Refer Friends</div>
              <p className="text-gray-300">Share your referral link with friends to earn extra $WAGCoin when they join.</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900 p-6 rounded-xl border border-neon-green/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-neon-green font-bold text-xl mb-2">Climb the Ranks</div>
              <p className="text-gray-300">Compete with other users to reach the top of our $WAGCoin leaderboard.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
