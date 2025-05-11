
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { processReferral } from "@/utils/referral";
import { useAccount, useDisconnect } from "wagmi";
import { checkAndCreateUser } from "@/utils/wallet";

interface WalletContextProps {
  walletAddress: string | null;
  user: User | null;
  isLoading: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: (referralCode?: string | null) => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Use wagmi hooks
  const { address, isConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  // Use the address as walletAddress
  const walletAddress = address ? address.toLowerCase() : null;

  // Fetch user data when wallet is connected
  useEffect(() => {
    const fetchUserData = async () => {
      if (!walletAddress) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null); // Clear any previous errors
        
        // Check if user exists and create if not
        await checkAndCreateUser(walletAddress);
        
        // Fetch user data
        const { data: userData, error } = await supabase
          .from("users")
          .select("*")
          .eq("wallet_address", walletAddress)
          .single();
        
        if (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to load user data");
          setUser(null);
        } else {
          setUser(userData as User);
          setError(null); // Ensure error is cleared on success
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchUserData();
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, [walletAddress, isConnected]);

  // Set up real-time subscription to user data
  useEffect(() => {
    if (!user?.id) return;

    const userSubscription = supabase
      .channel(`user-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          setUser(payload.new as User);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userSubscription);
    };
  }, [user?.id]);

  // Connect wallet function
  const connect = async (referralCode?: string | null): Promise<void> => {
    try {
      setError(null);
      setIsConnecting(true);
      
      // Just display a toast if we're already connected
      if (isConnected && walletAddress) {
        toast({
          title: "Wallet Already Connected",
          description: `Already connected to ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`,
        });
        return;
      }
      
      // ConnectKit will handle the actual connection through its UI
      // We'll just show a toast with instructions
      toast({
        title: "Connect Wallet",
        description: "Please use the connect wallet button to connect",
      });
      
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setError(error instanceof Error ? error.message : "Failed to connect wallet");
      toast({
        title: "Connection Failed",
        description: "Failed to connect your wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Process referral when a new user connects
  useEffect(() => {
    const processUserReferral = async () => {
      if (walletAddress && user) {
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get("ref");
        
        if (refCode) {
          // Check if this is a new user (if total_tasks_completed is 0)
          if (user.total_tasks_completed === 0) {
            const success = await processReferral(refCode, user.id);
            if (success) {
              toast({
                title: "Referral Bonus",
                description: "You joined using a referral link! Bonus rewards applied.",
              });
            }
          }
        }
      }
    };
    
    processUserReferral();
  }, [walletAddress, user, toast]);

  // Disconnect function
  const disconnect = () => {
    wagmiDisconnect();
    setUser(null);
    setError(null); // Clear any errors on disconnect
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  // Log connection status to help with debugging
  useEffect(() => {
    console.log("WalletContext - Connection Status:", {
      isConnected,
      walletAddress,
      hasUser: !!user,
      isLoading,
      error
    });
  }, [isConnected, walletAddress, user, isLoading, error]);

  return (
    <WalletContext.Provider value={{ 
      walletAddress, 
      user, 
      isLoading, 
      isConnecting, 
      error, 
      connect, 
      disconnect 
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextProps => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
