
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Award, Users, CheckCircle, TrendingUp, CalendarDays, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import UserBalance from "@/components/UserBalance";
import Supporters from "@/components/Supporters";

const Home: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-neon-green">Earn $WAG</span> By Completing Tasks
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Join thousands of users already earning $WAG by participating in our growing ecosystem.
            Complete tasks, refer friends, and climb the leaderboard!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-neon-green hover:bg-neon-green/90 text-black">
              <Link to={user ? "/tasks" : "/auth"}>
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center"
          >
            <h3 className="text-neon-green text-4xl font-bold mb-2">25k+</h3>
            <p className="text-gray-400">Active Users</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center"
          >
            <h3 className="text-neon-green text-4xl font-bold mb-2">$2M+</h3>
            <p className="text-gray-400">Total Raised</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center"
          >
            <h3 className="text-neon-green text-4xl font-bold mb-2">500k+</h3>
            <p className="text-gray-400">Tasks Completed</p>
          </motion.div>
        </div>
      </section>

      {/* How To Earn $WAG Section */}
      <section className="py-16 border-t border-gray-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How To Earn $WAG</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Multiple ways to earn rewards while contributing to our growing ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-neon-green/20 bg-gray-900 hover:bg-gray-800 transition-colors h-full">
              <CardHeader>
                <Award className="h-10 w-10 text-neon-green mb-4" />
                <CardTitle className="text-2xl">Complete Daily Tasks</CardTitle>
                <CardDescription>Earn rewards for daily activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Check in daily, follow social accounts, join communities and complete other simple tasks to earn $WAG.
                </p>
                <Button asChild variant="secondary" className="bg-neon-green hover:bg-neon-green/90 text-black">
                  <Link to="/tasks" className="flex items-center">
                    <Coins className="mr-2 h-4 w-4" />
                    View Tasks
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-neon-green/20 bg-gray-900 hover:bg-gray-800 transition-colors h-full">
              <CardHeader>
                <Users className="h-10 w-10 text-neon-green mb-4" />
                <CardTitle className="text-2xl">Refer Friends</CardTitle>
                <CardDescription>Invite others to join WagChain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Share your unique referral code with friends. For every new user that signs up with your code, both of you earn bonus $WAG.
                </p>
                <Button asChild variant="secondary" className="bg-neon-green hover:bg-neon-green/90 text-black">
                  <Link to="/referrals" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Refer Friends
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-neon-green/20 bg-gray-900 hover:bg-gray-800 transition-colors h-full">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-neon-green mb-4" />
                <CardTitle className="text-2xl">Climb Leaderboard</CardTitle>
                <CardDescription>Compete with other users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  The most active users are featured on our weekly and monthly leaderboards. Top performers receive special rewards and recognition.
                </p>
                <Button asChild variant="secondary" className="bg-neon-green hover:bg-neon-green/90 text-black">
                  <Link to="/leaderboard" className="flex items-center">
                    <Award className="mr-2 h-4 w-4" />
                    View Leaderboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Coinomics Section */}
      <section className="py-16 border-t border-gray-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">$WAG Coinomics</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Understanding the tokenomics behind $WAGCoin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Token Distribution</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Community Rewards</span>
                  <span className="text-neon-green font-bold">40%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-neon-green h-2.5 rounded-full" style={{ width: "40%" }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Liquidity Pool</span>
                  <span className="text-neon-green font-bold">25%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-neon-green h-2.5 rounded-full" style={{ width: "25%" }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Team & Development</span>
                  <span className="text-neon-green font-bold">20%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-neon-green h-2.5 rounded-full" style={{ width: "20%" }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Marketing</span>
                  <span className="text-neon-green font-bold">10%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-neon-green h-2.5 rounded-full" style={{ width: "10%" }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Reserves</span>
                  <span className="text-neon-green font-bold">5%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-neon-green h-2.5 rounded-full" style={{ width: "5%" }}></div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h4 className="text-xl font-medium mb-2">Total Supply</h4>
                <p className="text-2xl text-neon-green font-bold">1,000,000,000 $WAG</p>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h4 className="text-xl font-medium mb-2">Circulating Supply</h4>
                <p className="text-2xl text-neon-green font-bold">250,000,000 $WAG</p>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h4 className="text-xl font-medium mb-2">Current Price</h4>
                <p className="text-2xl text-neon-green font-bold">$0.008 USD</p>
              </div>
              
              <div className="text-center">
                <Button asChild variant="secondary" size="lg" className="bg-neon-green hover:bg-neon-green/90 text-black">
                  <Link to="/coinomics">
                    View Full Coinomics <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-16 border-t border-gray-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Roadmap</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our planned milestones for WagChain development
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-neon-green/20"></div>
          
          {/* Timeline items */}
          <div className="space-y-12">
            {/* Q2 2025 */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col md:flex-row items-start relative"
            >
              <div className="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1 mt-6 md:mt-0">
                <h3 className="text-xl text-neon-green font-bold mb-2">Q2 2025</h3>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h4 className="font-bold mb-2">Expansion & Growth</h4>
                  <ul className="text-gray-400 list-disc list-inside text-left ml-2 space-y-2">
                    <li>Major exchange listings</li>
                    <li>Mobile app launch</li>
                    <li>WagChain DAO implementation</li>
                    <li>Cross-chain bridge deployment</li>
                  </ul>
                </div>
              </div>
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full bg-neon-green flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-black" />
              </div>
              <div className="md:w-1/2 order-1 md:order-2"></div>
            </motion.div>
            
            {/* Q1 2025 */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col md:flex-row items-start relative"
            >
              <div className="md:w-1/2 order-2 md:order-1"></div>
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full bg-neon-green flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-black" />
              </div>
              <div className="md:w-1/2 md:pl-12 order-1 md:order-2 mt-6 md:mt-0">
                <h3 className="text-xl text-neon-green font-bold mb-2">Q1 2025</h3>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h4 className="font-bold mb-2">Platform Enhancement</h4>
                  <ul className="text-gray-400 list-disc list-inside text-left ml-2 space-y-2">
                    <li>Task marketplace launch</li>
                    <li>NFT rewards integration</li>
                    <li>Advanced referral tiers</li>
                    <li>Strategic partnerships</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* Q4 2024 */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col md:flex-row items-start relative"
            >
              <div className="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1 mt-6 md:mt-0">
                <h3 className="text-xl text-neon-green font-bold mb-2">Q4 2024</h3>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h4 className="font-bold mb-2">Ecosystem Building</h4>
                  <ul className="text-gray-400 list-disc list-inside text-left ml-2 space-y-2">
                    <li>$WAG staking program</li>
                    <li>Community governance launch</li>
                    <li>Developer APIs and SDK</li>
                    <li>Initial exchange listings</li>
                  </ul>
                </div>
              </div>
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full bg-neon-green flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-black" />
              </div>
              <div className="md:w-1/2 order-1 md:order-2"></div>
            </motion.div>
            
            {/* Q3 2024 */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col md:flex-row items-start relative"
            >
              <div className="md:w-1/2 order-2 md:order-1"></div>
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full bg-neon-green flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-black" />
              </div>
              <div className="md:w-1/2 md:pl-12 order-1 md:order-2 mt-6 md:mt-0">
                <h3 className="text-xl text-neon-green font-bold mb-2">Q3 2024</h3>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 bg-opacity-70">
                  <h4 className="font-bold mb-2">Foundation Building</h4>
                  <ul className="text-gray-400 list-disc list-inside text-left ml-2 space-y-2">
                    <li>WagChain platform launch</li>
                    <li>$WAG token TGE</li>
                    <li>Initial task ecosystem</li>
                    <li>Referral program launch</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Total Raised Section */}
      <section className="py-16 border-t border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Total Raised</h2>
          <div className="flex items-center justify-center">
            <Coins className="h-12 w-12 text-neon-green mr-4" />
            <p className="text-5xl md:text-6xl font-bold text-neon-green">$2,000,000</p>
          </div>
          <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
            With the support of our community and investors, WagChain has successfully raised $2 million to accelerate our mission of building the leading earn-to-participate ecosystem.
          </p>
        </div>
      </section>

      {/* Partners & Supporters Section */}
      <section className="py-16 border-t border-gray-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted By</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform is supported by leading exchanges and industry partners
          </p>
        </div>
        
        <Supporters />
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-center border border-neon-green/30"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start earning?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of users already earning $WAG by completing tasks, referring friends, and participating in our ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-neon-green hover:bg-neon-green/90 text-black">
              <Link to={user ? "/tasks" : "/auth"}>
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
          
          {/* User account section */}
          {user && profile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md mx-auto">
                <h3 className="text-xl font-bold mb-4">Your Account</h3>
                <UserBalance showStreak />
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-500">
          © {new Date().getFullYear()} WagChain. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Home;
