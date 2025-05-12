import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { useReferralFromURL } from "@/utils/referral";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Route, Map, TrendingUp, DollarSign } from "lucide-react";
import Supporters from "@/components/Supporters";

const Home = () => {
  const { walletAddress, userProfile, connectWallet } = useWallet();
  const referralCode = useReferralFromURL();
  
  const handleConnectWallet = () => {
    connectWallet();
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
          
          {/* Total Funds Raised Card */}
          <motion.div 
            className="mt-12 max-w-sm mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-gray-900 to-black border-neon-green/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Funds Raised</p>
                    <h3 className="text-3xl font-bold text-white mt-1">$214,500</h3>
                    <p className="text-gray-400 text-sm mt-1">USDT</p>
                  </div>
                  <div className="bg-neon-green/20 p-3 rounded-full">
                    <DollarSign className="text-neon-green h-7 w-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
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

      {/* Future Coinomics Section */}
      <motion.div 
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-emerald-400 mb-4">
            Future Coinomics
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our vision for $WAGCoin goes beyond simple rewards - we're building an entire ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gray-900 border-neon-green/20 overflow-hidden hover:border-neon-green/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-neon-green/20 p-2.5 rounded-full">
                  <TrendingUp className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-semibold text-white">Exchange Listings</h3>
              </div>
              <p className="text-gray-300">
                $WAGCoin will be listed on decentralized exchanges, allowing users to trade their earned tokens for other cryptocurrencies.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-neon-green/20 overflow-hidden hover:border-neon-green/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-neon-green/20 p-2.5 rounded-full">
                  <Map className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-semibold text-white">Governance</h3>
              </div>
              <p className="text-gray-300">
                $WAGCoin holders will be able to vote on platform proposals, allowing the community to shape the future of WagChain.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-neon-green/20 overflow-hidden hover:border-neon-green/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-neon-green/20 p-2.5 rounded-full">
                  <Route className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-semibold text-white">NFT Integration</h3>
              </div>
              <p className="text-gray-300">
                Unlock exclusive NFTs by accumulating $WAGCoin, enhancing the utility and value of your rewards.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <Button
            asChild
            variant="outline"
            className="border-neon-green/50 text-neon-green hover:bg-neon-green/10"
          >
            <Link to="/coinomics">Learn More About $WAGCoin</Link>
          </Button>
        </div>
      </motion.div>

      <Separator className="max-w-4xl mx-auto my-12 bg-gray-800" />

      {/* Roadmap Section */}
      <motion.div 
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-emerald-400 mb-4">
            WagChain Roadmap
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our journey to revolutionize Web3 rewards and community building
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Roadmap Timeline */}
          <div className="space-y-20">
            {/* Phase 1 */}
            <motion.div 
              className="flex flex-col md:flex-row gap-8 items-center" 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="bg-neon-green/10 border border-neon-green/30 rounded-full p-6 md:min-w-[120px] flex items-center justify-center aspect-square">
                <Calendar className="h-10 w-10 text-neon-green" />
              </div>
              <div className="flex-1 md:ml-8">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 relative hover:border-neon-green/20 transition-colors duration-300">
                  <h3 className="text-neon-green text-xl font-bold mb-2">Phase 1: Launch (Current)</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-neon-green mr-2">✓</span>
                      <span>Platform launch with wallet connection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-neon-green mr-2">✓</span>
                      <span>Task-based reward system implementation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-neon-green mr-2">✓</span>
                      <span>Referral program activation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-neon-green mr-2">•</span>
                      <span>Community building and user acquisition</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Phase 2 */}
            <motion.div 
              className="flex flex-col md:flex-row gap-8 items-center" 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="md:order-2 bg-neon-green/10 border border-neon-green/30 rounded-full p-6 md:min-w-[120px] flex items-center justify-center aspect-square">
                <Calendar className="h-10 w-10 text-neon-green" />
              </div>
              <div className="flex-1 md:mr-8 md:order-1">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 relative hover:border-neon-green/20 transition-colors duration-300">
                  <h3 className="text-neon-green text-xl font-bold mb-2">Phase 2: Growth (Q3 2023)</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>Integration with DEXs for $WAGCoin trading</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>Advanced task system with personalized challenges</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>Mobile app development</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>Strategic partnerships with other Web3 projects</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Phase 3 */}
            <motion.div 
              className="flex flex-col md:flex-row gap-8 items-center" 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="bg-neon-green/10 border border-neon-green/30 rounded-full p-6 md:min-w-[120px] flex items-center justify-center aspect-square">
                <Calendar className="h-10 w-10 text-neon-green" />
              </div>
              <div className="flex-1 md:ml-8">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 relative hover:border-neon-green/20 transition-colors duration-300">
                  <h3 className="text-neon-green text-xl font-bold mb-2">Phase 3: Expansion (Q1 2024)</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>Governance system launch for community decision-making</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>NFT marketplace for $WAGCoin holders</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>Cross-chain bridge implementation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>Real-world utility partnerships</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* Phase 4 - New CEX Listing milestone */}
            <motion.div 
              className="flex flex-col md:flex-row gap-8 items-center" 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="md:order-2 bg-neon-green/10 border border-neon-green/30 rounded-full p-6 md:min-w-[120px] flex items-center justify-center aspect-square">
                <Calendar className="h-10 w-10 text-neon-green" />
              </div>
              <div className="flex-1 md:mr-8 md:order-1">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 relative hover:border-neon-green/20 transition-colors duration-300">
                  <h3 className="text-neon-green text-xl font-bold mb-2">Phase 4: CEX Listing (Q4 2025)</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-neon-green mr-2">✓</span>
                      <span>Major centralized exchange listings for $WAGCoin</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>Expanded ecosystem integrations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>Global marketing campaigns</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>Enterprise partnerships for wider adoption</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-16 text-center">
            <Button
              asChild
              size="lg" 
              className="bg-neon-green hover:bg-neon-green/90 text-black text-lg px-8"
            >
              <Link to="/tasks">Start Earning Now</Link>
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Our Supporters Section */}
      <Supporters />
    </div>
  );
};

export default Home;
