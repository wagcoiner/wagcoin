
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

// Get referral code from URL params
export const useReferralFromURL = (): string | null => {
  const { toast } = useToast();
  const location = useLocation();
  
  // Check for referral code in URL params
  const urlParams = new URLSearchParams(location.search);
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

// Process a referral using the Supabase function
export const processReferral = async (referralCode: string, userId: string): Promise<boolean> => {
  try {
    // Call the Supabase function to process the referral
    const { data, error } = await supabase.functions.invoke('process_referral', {
      body: { 
        ref_code: referralCode,
        new_user_id: userId
      }
    });

    if (error) {
      console.error("Error processing referral:", error);
      return false;
    }

    return data || false;
  } catch (error) {
    console.error("Error in processReferral:", error);
    return false;
  }
};
