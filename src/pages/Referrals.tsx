import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Coins, Users, Copy, Award, Loader2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

interface ReferredUser {
  id: string;
  username: string;
  created_at: string;
}

const Referrals: React.FC = () => {
  const { user, profile, isLoading } = useAuth();
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);
  const [copyingLink, setCopyingLink] = useState(false);
  const [copyingCode, setCopyingCode] = useState(false);
  const { toast } = useToast();

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

        if (error) throw error;

        if (referrals && referrals.length > 0) {
          const refereeIds = referrals.map(ref => ref.referee_id);
          
          const { data: users, error: usersError } = await supabase
            .from("users")
            .select("id, username, created_at")
            .in("id", refereeIds);

          if (usersError) throw usersError;
          setReferredUsers(users || []);
        } else {
          setReferredUsers([]);
        }
      } catch (error) {
        console.error("Error fetching referred users:", error);
        toast({
          title: "Error",
          description: "Failed to load referred users",
          variant: "destructive",
        });
      } finally {
        setIsLoadingReferrals(false);
      }
    };

    fetchReferredUsers();
  }, [user?.id, toast]);

  const handleCopyReferralLink = () => {
    if (!profile?.referral_code) return;

    setCopyingLink(true);
    const baseUrl = window.location.origin;
    const referralLink = `${baseUrl}/auth?ref=${profile.referral_code}`;
    
    navigator.clipboard.writeText(referralLink).then(
      () => {
        toast({
          title: "Copied!",
          description: "Referral link copied to clipboard",
        });
        setCopyingLink(false);
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Error",
          description: "Failed to copy referral link",
          variant: "destructive",
        });
        setCopyingLink(false);
      }
    );
  };

  const handleCopyReferralCode = () => {
    if (!profile?.referral_code) return;
    
    setCopyingCode(true);
    navigator.clipboard.writeText(profile.referral_code).then(
      () => {
        toast({
          title: "Copied!",
          description: "Referral code copied to clipboard",
        });
        setCopyingCode(false);
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Error",
          description: "Failed to copy referral code",
          variant: "destructive",
        });
        setCopyingCode(false);
      }
    );
  };

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
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Refer Friends & Earn $WAGCoin</h1>
        <p className="text-xl text-gray-300">
          Share your referral code and earn 50 $WAGCoin for each new user that joins
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-neon-green/20 bg-gray-900 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl">Your Referral Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile && (
                  <>
                    <div className="relative">
                      <div className="bg-black/50 rounded-lg border border-neon-green/30 p-4 pr-12 break-all">
                        {window.location.origin}/auth?ref={profile.referral_code}
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neon-green hover:text-white hover:bg-neon-green/20"
                        onClick={handleCopyReferralLink}
                        disabled={copyingLink}
                      >
                        {copyingLink ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="bg-black/50 rounded-lg border border-neon-green/30 p-3 flex-1 text-center">
                        <p className="text-sm text-gray-400 mb-1">Your Referral Code</p>
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-xl font-mono font-bold text-neon-green tracking-wider">
                            {profile.referral_code}
                          </p>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-neon-green hover:text-white hover:bg-neon-green/20"
                            onClick={handleCopyReferralCode}
                            disabled={copyingCode}
                          >
                            {copyingCode ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="bg-black/50 rounded-lg border border-neon-green/30 p-3 flex-1 text-center">
                        <p className="text-sm text-gray-400 mb-1">Total Referrals</p>
                        <p className="text-xl font-bold text-neon-green">
                          {profile.referral_count}
                        </p>
                      </div>

                      <div className="bg-black/50 rounded-lg border border-neon-green/30 p-3 flex-1 text-center">
                        <p className="text-sm text-gray-400 mb-1">Total Earned</p>
                        <p className="text-xl font-bold text-neon-green flex items-center justify-center">
                          <Coins className="h-4 w-4 mr-1" />
                          {profile.referral_count * 50}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-neon-green/5 border border-neon-green/10 rounded-lg">
                      <h3 className="font-semibold text-lg text-neon-green mb-2">How it works</h3>
                      <ol className="space-y-2 text-gray-300 list-decimal pl-5">
                        <li>Share your referral link with friends</li>
                        <li>When they sign up through your link, you both earn rewards</li>
                        <li>You get 50 $WAGCoin for each new user who joins</li>
                        <li>There's no limit to how many friends you can refer!</li>
                      </ol>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
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
              {isLoadingReferrals ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 text-neon-green animate-spin" />
                </div>
              ) : referredUsers.length > 0 ? (
                <div className="space-y-3">
                  {referredUsers.map((referredUser) => (
                    <div 
                      key={referredUser.id} 
                      className="p-3 bg-black/50 border border-neon-green/20 rounded-lg flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center">
                          <Users className="h-4 w-4 text-neon-green" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {referredUser.username || "User"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(referredUser.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-neon-green font-medium">
                        <Coins className="h-4 w-4 mr-1" /> +50
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Award className="h-12 w-12 text-neon-green/30 mx-auto mb-2" />
                  <p className="text-gray-400">No referred users yet</p>
                  <p className="text-sm text-gray-500 mt-1">Share your link to start earning!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Referrals;
