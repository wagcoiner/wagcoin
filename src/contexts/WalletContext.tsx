
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
  isConnecting: boolean;
  error: string | null;
  connect: (referralCode?: string | null) => Promise<void>;
  disconnect: () => void;
}

const WALLET_STORAGE_KEY = "wagcoin_wallet_address";

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for stored wallet on initial load
  useEffect(() => {
    const checkStoredWallet = async () => {
      try {
        const storedWallet = localStorage.getItem(WALLET_STORAGE_KEY);
        
        if (storedWallet) {
          setWalletAddress(storedWallet);
          
          // Verify the wallet is still connected via window.ethereum
          if (window.ethereum) {
            const accounts = await window.ethereum.request({
              method: "eth_accounts",
            });
            
            if (accounts.length > 0 && accounts[0].toLowerCase() === storedWallet.toLowerCase()) {
              // Wallet is still connected, fetch user data
              await fetchUserData(storedWallet);
            } else {
              // Wallet is no longer connected or has changed
              localStorage.removeItem(WALLET_STORAGE_KEY);
              setWalletAddress(null);
            }
          } else {
            // No ethereum object
            localStorage.removeItem(WALLET_STORAGE_KEY);
            setWalletAddress(null);
          }
        }
      } catch (error) {
        console.error("Error checking stored wallet:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkStoredWallet();
  }, []);

  const fetchUserData = async (address: string) => {
    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", address)
        .single();
      
      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }
      
      setUser(userData as User);
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    }
  };

  const connect = async (referralCode?: string | null) => {
    try {
      setError(null);
      setIsConnecting(true);
      
      // Check if MetaMask is installed
      if (!window.ethereum) {
        setError("Please install MetaMask to use this app");
        toast({
          title: "MetaMask Required",
          description: "Please install MetaMask to connect your wallet.",
          variant: "destructive",
        });
        return;
      }
      
      const address = await connectWallet();
      
      if (!address) {
        setError("Failed to connect wallet");
        return;
      }
      
      setWalletAddress(address);
      
      // Store wallet address in local storage
      localStorage.setItem(WALLET_STORAGE_KEY, address);
      
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

  const disconnect = () => {
    disconnectWallet();
    setWalletAddress(null);
    setUser(null);
    localStorage.removeItem(WALLET_STORAGE_KEY);
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
          localStorage.setItem(WALLET_STORAGE_KEY, accounts[0]);
          await checkAndCreateUser(accounts[0]);
          
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("wallet_address", accounts[0])
            .single();
          
          setUser(userData as User);
          
          toast({
            title: "Account Changed",
            description: `Switched to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
          });
        }
      };

      const handleChainChanged = () => {
        // Reload the page when the chain changes
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
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
