
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Coins, Users, Award, Loader2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { ReferredUser } from "@/types";
import ReferralCards from "@/components/referrals/ReferralCards";
import ReferredUsersList from "@/components/referrals/ReferredUsersList";
import BalanceCards from "@/components/tasks/BalanceCards";

const Referrals: React.FC = () => {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);
  const { toast } = useToast();

  // First ensure user entry exists in users table
  useEffect(() => {
    const ensureUserExists = async () => {
      if (!user?.id) return;
      
      try {
        // Check if user exists
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
          
        // If user doesn't exist, create them
        if (userError || !userData) {
          console.log("User not found in users table. Creating entry...");
          
          // Generate a random referral code
          const { data: refCodeData } = await supabase.rpc("generate_random_referral_code");
          const referralCode = refCodeData || `USER${Math.floor(100000 + Math.random() * 900000)}`;
          
          await supabase
            .from("users")
            .insert({
              id: user.id,
              wallet_address: user?.email || "anonymous",
              referral_code: referralCode,
              balance: 0,
              daily_streak: 1,
              total_tasks_completed: 0,
              referral_count: 0
            });
            
          // Refresh profile
          await refreshProfile();
        }
      } catch (error) {
        console.error("Error ensuring user exists:", error);
      }
    };
    
    ensureUserExists();
  }, [user?.id, refreshProfile]);

  useEffect(() => {
    const fetchReferredUsers = async () => {
      if (!user?.id) {
        setIsLoadingReferrals(false);
        return;
      }

      try {
        setIsLoadingReferrals(true);
        
        const { data: referrals, error } = await supabase
          .from("referrals")
          .select("referee_id")
          .eq("referrer_id", user.id);

        if (error) {
          console.error("Error fetching referrals:", error);
          toast({
            title: "Error",
            description: `Failed to load referrals: ${error.message}`,
            variant: "destructive",
          });
          setIsLoadingReferrals(false);
          return;
        }

        if (referrals && referrals.length > 0) {
          const refereeIds = referrals.map(ref => ref.referee_id);
          
          const { data: users, error: usersError } = await supabase
            .from("users")
            .select("id, wallet_address, created_at")
            .in("id", refereeIds);

          if (usersError) {
            console.error("Error fetching referred users:", usersError);
            toast({
              title: "Error",
              description: `Failed to load referred users: ${usersError.message}`,
              variant: "destructive",
            });
            setIsLoadingReferrals(false);
            return;
          }
          
          // Convert users to ReferredUser type
          const formattedUsers: ReferredUser[] = users?.map(user => ({
            id: user.id,
            wallet_address: user.wallet_address,
            created_at: user.created_at,
            // Use wallet address as identifier if available
            username: user.wallet_address ? 
              `${user.wallet_address.substring(0, 6)}...${user.wallet_address.substring(user.wallet_address.length - 4)}` : 
              "User"
          })) || [];
          
          setReferredUsers(formattedUsers);
        } else {
          setReferredUsers([]);
        }
      } catch (error: any) {
        console.error("Error fetching referred users:", error);
        toast({
          title: "Error",
          description: `Failed to load referred users: ${error.message || "Unknown error"}`,
          variant: "destructive",
        });
      } finally {
        setIsLoadingReferrals(false);
      }
    };

    fetchReferredUsers();
  }, [user?.id, toast, refreshProfile]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Loader2 className="h-16 w-16 text-neon-green mb-4 animate-spin" />
        <h1 className="text-3xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Users className="h-16 w-16 text-neon-green mb-4" />
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-md">
          Sign in to access your referral program and start earning rewards
        </p>
        <Button asChild variant="default" className="bg-neon-green hover:bg-neon-green/90 text-black">
          <Link to="/auth">
            <LogIn className="h-5 w-5 mr-2" />
            Sign In
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Refer Friends & Earn $WAGCoin</h1>
        <p className="text-xl text-gray-300 mb-6">
          Share your referral code and earn 50 $WAGCoin for each new user that joins
        </p>
      </div>

      {profile && (
        <div className="mb-12">
          <BalanceCards profile={profile} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {profile && (
            <ReferralCards profile={profile} />
          )}

          <div className="mt-6 p-4 bg-neon-green/5 border border-neon-green/10 rounded-lg">
            <h3 className="font-semibold text-lg text-neon-green mb-2">How it works</h3>
            <ol className="space-y-2 text-gray-300 list-decimal pl-5">
              <li>Share your referral link with friends</li>
              <li>When they sign up through your link, you both earn rewards</li>
              <li>You get 50 $WAGCoin for each new user who joins</li>
              <li>There's no limit to how many friends you can refer!</li>
            </ol>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-neon-green/20 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="h-5 w-5 text-neon-green" />
                Referred Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReferredUsersList 
                referredUsers={referredUsers} 
                isLoading={isLoadingReferrals} 
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Referrals;
