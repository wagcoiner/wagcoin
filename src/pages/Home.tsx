import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Award, Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import UserBalance from "@/components/UserBalance";

const Home: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-neon-green mb-4">
          Welcome to WagChain
        </h1>
        <p className="text-xl text-gray-300">
          Complete tasks, earn rewards, and build the future.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-neon-green/20 bg-gray-900 hover:bg-gray-800 transition-colors">
            <CardHeader>
              <CardTitle className="text-2xl">Your Account</CardTitle>
              <CardDescription>Manage your profile and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-neon-green h-5 w-5" />
                    <p className="text-gray-300">
                      Logged in as {user.email}
                    </p>
                  </div>
                  {profile && (
                    <UserBalance showStreak />
                  )}
                </>
              ) : (
                <p className="text-gray-400">
                  Not logged in. <Link to="/auth" className="text-blue-400 hover:underline">Sign In</Link> or <Link to="/auth?mode=signup" className="text-blue-400 hover:underline">Sign Up</Link>
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-neon-green/20 bg-gray-900 hover:bg-gray-800 transition-colors">
            <CardHeader>
              <CardTitle className="text-2xl">Earn Rewards</CardTitle>
              <CardDescription>Complete tasks and earn $WAGCoin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Ready to start earning? Head over to the tasks page to see available opportunities.
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
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-neon-green/20 bg-gray-900 hover:bg-gray-800 transition-colors">
            <CardHeader>
              <CardTitle className="text-2xl">Refer Friends</CardTitle>
              <CardDescription>Share the wealth and earn together</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Invite your friends to join WagChain and earn bonus rewards when they sign up.
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
      </div>

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
