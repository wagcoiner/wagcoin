import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserBalance from "@/components/UserBalance";
import { motion } from "framer-motion";

const Home: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Welcome to WagChain!</h1>
          <p className="text-xl text-gray-300">
            Earn $WAGCoin by completing tasks and participating in our community.
          </p>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gray-900 border-neon-green/20 h-full">
            <CardHeader>
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription>Explore the WagChain ecosystem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                New to WagChain? Here's how to get started:
              </p>
              <ul className="list-none space-y-2">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-neon-green" />
                  <Link to="/about" className="text-neon-green hover:underline">
                    Learn about WagChain
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-neon-green" />
                  <Link to="/tasks" className="text-neon-green hover:underline">
                    Complete your first task
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-neon-green" />
                  <Link to="/referrals" className="text-neon-green hover:underline">
                    Invite your friends
                  </Link>
                </li>
              </ul>
              {!user && (
                <Button asChild className="w-full bg-neon-green hover:bg-neon-green/90 text-black">
                  <Link to="/auth">Create an Account</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gray-900 border-neon-green/20 h-full">
            <CardHeader>
              <CardTitle className="text-2xl">Your Stats</CardTitle>
              <CardDescription>Track your progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile ? (
                <UserBalance size="large" showStreak={true} />
              ) : (
                <p className="text-gray-300">
                  Sign in to view your stats and track your progress.
                </p>
              )}
              {!user && (
                <Button asChild className="w-full bg-neon-green hover:bg-neon-green/90 text-black">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-gray-900 border-neon-green/20 h-full">
            <CardHeader>
              <CardTitle className="text-2xl">$WAG Coinomics</CardTitle>
              <CardDescription>Learn about our token</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-300">Circulating Supply</h3>
                  <p className="text-neon-green font-bold">TBA</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-300">Current Price</h3>
                  <p className="text-neon-green font-bold">TBA</p>
                </div>
              </div>
              <Link to="/coinomics">
                <Button variant="secondary" className="w-full">
                  Learn More
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-gray-300">
            Join our community and help us build the future of WagChain!
          </p>
          <div className="mt-6">
            <Button asChild variant="ghost" className="text-neon-green hover:bg-neon-green/10">
              <Link to="/about">About Us</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
