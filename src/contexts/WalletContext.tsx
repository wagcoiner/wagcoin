
import React, { createContext, useContext, useState, useEffect } from "react";
import { connectWallet, checkAndCreateUser, disconnectWallet } from "@/utils/wallet";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { processReferral } from "@/utils/referral";

interface WalletContextProps {
  walletAddress: string | null;
  user: User | null;
  isLoading: boolean;
  connect: (referralCode?: string | null) => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const connect = async (referralCode?: string | null) => {
    try {
      setIsLoading(true);
      const address = await connectWallet();
      
      if (address) {
        setWalletAddress(address);
        
        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("wallet_address", address)
          .single();

        const isNewUser = fetchError && fetchError.code === "PGRST116";

        // Create user if they don't exist
        await checkAndCreateUser(address);
        
        // Fetch the user data
        const { data: userData, error } = await supabase
          .from("users")
          .select("*")
          .eq("wallet_address", address)
          .single();
        
        if (error) {
          throw error;
        }
        
        setUser(userData as User);

        // Process referral if this is a new user
        if (isNewUser && referralCode && userData) {
          const success = await processReferral(referralCode, userData.id);
          if (success) {
            toast({
              title: "Referral Bonus",
              description: "You joined using a referral link! Bonus rewards applied.",
            });
          }
        }
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        });
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect your wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    disconnectWallet();
    setWalletAddress(null);
    setUser(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  // Set up account change listener
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else if (accounts[0] !== walletAddress) {
          // User switched accounts
          setWalletAddress(accounts[0]);
          await checkAndCreateUser(accounts[0]);
          
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("wallet_address", accounts[0])
            .single();
          
          setUser(userData as User);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, [walletAddress]);

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

  return (
    <WalletContext.Provider value={{ walletAddress, user, isLoading, connect, disconnect }}>
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
