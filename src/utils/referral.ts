
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const processReferral = async (referralCode: string, newUserId: string): Promise<boolean> => {
  try {
    if (!referralCode || !newUserId) return false;

    // Get the referrer from the referral code
    const { data: referrer, error: referrerError } = await supabase
      .from("users")
      .select("id, balance, referral_count")
      .eq("referral_code", referralCode)
      .single();

    if (referrerError || !referrer) {
      console.error("Error finding referrer:", referrerError);
      return false;
    }

    // Check if this is a self-referral (should be impossible but checking anyway)
    if (referrer.id === newUserId) {
      console.error("Self-referral not allowed");
      return false;
    }

    // Check if this referral already exists
    const { data: existingReferral, error: checkError } = await supabase
      .from("referrals")
      .select("id")
      .eq("referrer_id", referrer.id)
      .eq("referee_id", newUserId)
      .single();

    if (existingReferral) {
      console.log("Referral already exists");
      return false;
    }

    // Create the referral record
    const { error: insertError } = await supabase
      .from("referrals")
      .insert({
        referrer_id: referrer.id,
        referee_id: newUserId,
        reward: 50 // Standard referral reward
      });

    if (insertError) {
      console.error("Error creating referral:", insertError);
      return false;
    }

    // Update referrer's balance and referral count
    const { error: updateError } = await supabase
      .from("users")
      .update({
        balance: referrer.balance + 50, // Add the referral reward
        referral_count: referrer.referral_count + 1
      })
      .eq("id", referrer.id);

    if (updateError) {
      console.error("Error updating referrer stats:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error processing referral:", error);
    return false;
  }
};

export const useReferralFromURL = (): string | null => {
  const { toast } = useToast();
  
  // Check for referral code in URL params
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get("ref");
  
  if (refCode) {
    // Show toast notification if referral code is present
    toast({
      title: "Referral Code Detected",
      description: `Using referral code: ${refCode}`,
    });
  }
  
  return refCode;
};
