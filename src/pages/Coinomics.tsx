
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Coins, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Coinomics: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">$WAGCoin Tokenomics</h1>
        <p className="text-xl text-gray-300">
          Learn how $WAGCoin works and how it's distributed
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-neon-green/20 bg-gray-900 h-full">
            <CardHeader>
              <CardTitle className="text-2xl">Token Details</CardTitle>
              <CardDescription>Basic information about $WAGCoin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <TokenDetail label="Name" value="WagCoin" />
                <TokenDetail label="Symbol" value="$WAG" />
                <TokenDetail label="Total Supply" value="100,000,000" />
                <TokenDetail label="Initial Value" value="To be determined" />
                <TokenDetail label="Blockchain" value="Ethereum Layer 2" />
                <TokenDetail label="Token Type" value="ERC-20" />
              </div>
              
              <div className="mt-6 p-4 bg-neon-green/5 rounded-lg border border-neon-green/20">
                <h3 className="text-neon-green font-medium mb-2">About $WAGCoin</h3>
                <p className="text-gray-300 text-sm">
                  $WAGCoin is the native token of the WagChain ecosystem. It's used as a reward 
                  for completing tasks, referring new users, and participating in community activities. 
                  In the future, $WAGCoin may be listed on exchanges and gain real-world value.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-neon-green/20 bg-gray-900 h-full">
            <CardHeader>
              <CardTitle className="text-2xl">Token Allocation</CardTitle>
              <CardDescription>How $WAGCoin is distributed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <AllocationBar
                  label="User Rewards"
                  percentage={40}
                  description="Reserved for task completion rewards"
                  color="from-neon-green to-green-400"
                />
                
                <AllocationBar
                  label="Referral System"
                  percentage={20}
                  description="Fuels the referral program"
                  color="from-blue-500 to-purple-500"
                />
                
                <AllocationBar
                  label="Community Treasury"
                  percentage={15}
                  description="Governed by community votes"
                  color="from-purple-500 to-pink-500"
                />
                
                <AllocationBar
                  label="Team & Development"
                  percentage={15}
                  description="For ongoing development and team"
                  color="from-amber-500 to-red-500"
                />
                
                <AllocationBar
                  label="Marketing & Partnerships"
                  percentage={10}
                  description="Growing the WagChain ecosystem"
                  color="from-teal-400 to-blue-400"
                />
              </div>

              <div className="mt-6 p-4 bg-neon-green/5 rounded-lg border border-neon-green/20">
                <h3 className="text-neon-green font-medium mb-2">Earning $WAGCoin</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li className="flex gap-2">
                    <ArrowRight className="h-4 w-4 text-neon-green flex-shrink-0 mt-0.5" />
                    <span>Complete daily and weekly tasks</span>
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight className="h-4 w-4 text-neon-green flex-shrink-0 mt-0.5" />
                    <span>Refer new users (50 $WAGCoin per referral)</span>
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight className="h-4 w-4 text-neon-green flex-shrink-0 mt-0.5" />
                    <span>Maintain daily login streaks</span>
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight className="h-4 w-4 text-neon-green flex-shrink-0 mt-0.5" />
                    <span>Participate in community events (coming soon)</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-neon-green/20 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-2xl">Reward Structure</CardTitle>
            <CardDescription>How tasks and activities are rewarded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RewardCard
                title="Task Completion"
                items={[
                  { label: "Easy Tasks", value: "10-25 $WAG" },
                  { label: "Medium Tasks", value: "25-50 $WAG" },
                  { label: "Hard Tasks", value: "50-100 $WAG" },
                ]}
              />
              
              <RewardCard
                title="Referral System"
                items={[
                  { label: "Per Referral", value: "50 $WAG" },
                  { label: "Milestone Bonuses", value: "Coming soon" },
                  { label: "Referral Contests", value: "Coming soon" },
                ]}
              />
              
              <RewardCard
                title="Daily Streaks"
                items={[
                  { label: "Daily Login", value: "10 $WAG" },
                  { label: "Weekly Streak (7 days)", value: "+50 $WAG" },
                  { label: "Monthly Streak (30 days)", value: "+200 $WAG" },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const TokenDetail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm text-gray-400">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const AllocationBar: React.FC<{ 
  label: string;
  percentage: number;
  description: string;
  color: string;
}> = ({ label, percentage, description, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <div className="font-medium">{label}</div>
      <div className="text-neon-green font-bold">{percentage}%</div>
    </div>
    
    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-gradient-to-r ${color} rounded-full`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
    
    <div className="text-sm text-gray-400">{description}</div>
  </div>
);

const RewardCard: React.FC<{ 
  title: string;
  items: Array<{ label: string; value: string }>;
}> = ({ title, items }) => (
  <Card className="bg-gray-800 border-gray-700">
    <CardHeader className="py-4">
      <CardTitle className="text-lg text-neon-green flex items-center gap-2">
        <Coins className="h-4 w-4" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between text-sm">
            <span className="text-gray-300">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default Coinomics;
