
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useReferralFromURL } from "@/utils/referral";

const Home: React.FC = () => {
  const { walletAddress, connect, isLoading } = useWallet();
  const referralCode = useReferralFromURL();

  // Handle wallet connection with referral
  const handleConnect = () => {
    connect(referralCode);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-b from-black via-black to-neon-green/20"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-center bg-no-repeat bg-contain opacity-10"></div>
        </div>
        
        <div className="container mx-auto z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Earn <span className="text-neon-green">$WAGCoin</span> While You Play
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-xl md:text-2xl text-gray-300 mb-10">
                Complete tasks, refer friends, and climb the leaderboard in the ultimate meme coin reward platform
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {!walletAddress ? (
                <Button
                  onClick={handleConnect}
                  disabled={isLoading}
                  size="lg"
                  className="bg-neon-green hover:bg-neon-green/90 text-black text-lg px-8 py-6 h-auto"
                >
                  {isLoading ? "Connecting..." : "Connect Wallet & Start Earning"}
                </Button>
              ) : (
                <Button
                  as={Link}
                  to="/tasks"
                  size="lg"
                  className="bg-neon-green hover:bg-neon-green/90 text-black text-lg px-8 py-6 h-auto"
                >
                  View Tasks
                </Button>
              )}
              <Button
                as={Link}
                to="/about"
                variant="outline"
                size="lg"
                className="border-neon-green text-neon-green hover:bg-neon-green/10 text-lg px-8 py-6 h-auto"
              >
                Learn More
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How <span className="text-neon-green">WagChain</span> Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Complete Tasks"
              description="Earn $WAGCoin by completing simple daily and weekly tasks"
              number="1"
            />
            <FeatureCard 
              title="Refer Friends"
              description="Share your referral code and earn 50 $WAGCoin for each new user"
              number="2"
            />
            <FeatureCard 
              title="Climb The Ranks"
              description="Compete with other users to reach the top of the leaderboard"
              number="3"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; description: string; number: string }> = ({ 
  title, 
  description, 
  number 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-gray-900 p-6 rounded-lg border border-neon-green/20 relative overflow-hidden group"
  >
    <div className="absolute -right-4 -top-4 w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center text-3xl font-bold text-neon-green opacity-30">
      {number}
    </div>
    <h3 className="text-xl font-bold mb-3 text-neon-green">{title}</h3>
    <p className="text-gray-300">{description}</p>
    
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
  </motion.div>
);

export default Home;
