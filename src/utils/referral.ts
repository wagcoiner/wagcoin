
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
