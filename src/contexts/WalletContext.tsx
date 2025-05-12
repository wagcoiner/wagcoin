import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useReferralFromURL, processReferral } from "@/utils/referral";
import { useAccount, useDisconnect } from "wagmi";
import { checkAndCreateUser } from "@/utils/wallet";

// Define interface for the wallet context
interface WalletContextProps {
  walletAddress: string | null;
  userProfile: User | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
}

// Create context
const WalletContext = createContext<WalletContextProps | undefined>(undefined);

// Provider component
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Get referral code from URL
  const referralCode = useReferralFromURL();

  // Handle wallet connection
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      
      // Check if already connected by wagmi
      if (address && isConnected) {
        setWalletAddress(address);
        
        // Check if user exists or create new one
        await checkAndCreateUser(address);
        
        // If there's a referral code, process it
        if (referralCode) {
          await processReferral(referralCode, address);
        }
        
        // Load user data
        await fetchUserData(address);

        toast({
          title: "Wallet Connected",
          description: `Connected: ${shortenAddress(address)}`,
        });
        
        return;
      }
      
      // If not connected, show error
      toast({
        title: "Connection Error",
        description: "Please connect wallet using the button above",
        variant: "destructive",
      });
      
    } catch (error: any) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    try {
      disconnect();
      setWalletAddress(null);
      setUserProfile(null);
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error: any) {
      console.error("Error disconnecting:", error);
    }
  };

  // Fetch user data from database
  const fetchUserData = async (walletAddress: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", walletAddress)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    }
  };

  // Keep wallet connection state in sync with wagmi
  useEffect(() => {
    const init = async () => {
      if (address && isConnected) {
        setWalletAddress(address);
        await fetchUserData(address);
      } else {
        setWalletAddress(null);
      }
    };
    
    init();
  }, [address, isConnected]);

  // Helper to shorten address for UI
  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        userProfile,
        connectWallet,
        disconnectWallet,
        isLoading
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Hook to use wallet context
export const useWallet = (): WalletContextProps => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
