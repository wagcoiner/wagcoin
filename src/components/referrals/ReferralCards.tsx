
import React, { useState } from "react";
import { UserProfile } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ReferralCardsProps {
  profile: UserProfile;
}

const ReferralCards: React.FC<ReferralCardsProps> = ({ profile }) => {
  const [copyingLink, setCopyingLink] = useState(false);
  const [copyingCode, setCopyingCode] = useState(false);
  const { toast } = useToast();

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-neon-green/20 bg-gray-900 overflow-hidden">
        <CardContent className="space-y-6 p-6">
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReferralCards;
