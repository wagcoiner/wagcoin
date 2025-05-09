
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">About WagChain</h1>
        <p className="text-xl text-gray-300">
          The ultimate meme coin reward platform
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-neon-green/20 bg-gray-900 h-full">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-green">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert">
              <p>
                WagChain is more than just another memecoin platform. Our mission is to create a fun, 
                engaging community where anyone can participate and earn rewards for completing simple tasks 
                and engaging with the ecosystem.
              </p>
              <p>
                While traditional memecoins rely solely on speculation, WagChain focuses on building real 
                utility and a thriving community. By combining the viral nature of meme culture with actual 
                utility, we're creating something truly unique in the cryptocurrency space.
              </p>
              <p>
                Our vision is to become the leading task-based reward platform in the cryptocurrency space, 
                offering genuine utility, community governance, and a fair distribution model.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-neon-green/20 bg-gray-900 h-full">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-green">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-6">
                <FeatureStep 
                  number="1" 
                  title="Connect Your Wallet" 
                  description="Start by connecting your MetaMask wallet to the WagChain platform. This creates your account and gives you access to all features."
                />
                <FeatureStep 
                  number="2" 
                  title="Complete Tasks" 
                  description="Browse through available tasks and complete them to earn $WAGCoin rewards. Tasks can range from daily social media interactions to weekly challenges."
                />
                <FeatureStep 
                  number="3" 
                  title="Refer Friends" 
                  description="Share your unique referral link with friends. When they join WagChain through your link, you both earn rewards."
                />
                <FeatureStep 
                  number="4" 
                  title="Climb the Leaderboard" 
                  description="Compete with other users to reach the top of the leaderboard. The more tasks you complete and friends you refer, the higher you'll rank."
                />
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8"
      >
        <Card className="border-neon-green/20 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-2xl text-neon-green">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FaqItem 
                question="What is $WAGCoin?" 
                answer="$WAGCoin is the native token of the WagChain ecosystem. It's earned through completing tasks, referring friends, and maintaining daily login streaks."
              />
              <FaqItem 
                question="How do I get started?" 
                answer="Simply connect your MetaMask wallet, and you'll be ready to start completing tasks and earning $WAGCoin."
              />
              <FaqItem 
                question="Are there any fees?" 
                answer="WagChain itself doesn't charge any fees for using the platform. However, standard blockchain transaction fees may apply when transferring tokens."
              />
              <FaqItem 
                question="What can I do with $WAGCoin?" 
                answer="Currently, $WAGCoin is used for tracking rewards on our platform. In the future, it may gain additional utility and potentially be listed on exchanges."
              />
              <FaqItem 
                question="How do referrals work?" 
                answer="Each user gets a unique referral code. When new users sign up using your code, both you and the new user receive bonus $WAGCoin."
              />
              <FaqItem 
                question="Is WagChain secure?" 
                answer="Yes, WagChain uses blockchain technology for security and transparency. We never have access to your private keys or wallet funds."
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const FeatureStep: React.FC<{ 
  number: string; 
  title: string; 
  description: string 
}> = ({ number, title, description }) => (
  <li className="flex gap-4">
    <div className="flex-shrink-0">
      <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center border border-neon-green/30 text-neon-green font-bold">
        {number}
      </div>
    </div>
    <div>
      <h3 className="font-bold text-neon-green mb-1">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  </li>
);

const FaqItem: React.FC<{ 
  question: string; 
  answer: string 
}> = ({ question, answer }) => (
  <div className="space-y-2">
    <h3 className="font-bold text-white flex items-center gap-2">
      <ArrowRight className="h-4 w-4 text-neon-green" />
      {question}
    </h3>
    <p className="text-gray-300 pl-6">{answer}</p>
  </div>
);

export default About;
