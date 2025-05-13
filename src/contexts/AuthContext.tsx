
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { User } from "@/types";

export interface UserProfile {
  id: string;
  username?: string;
  balance: number;
  referral_code: string;
  referral_count: number;
  daily_streak: number;
  total_tasks_completed: number;
  role?: 'user' | 'admin';
  last_login: string;
  created_at: string;
  wallet_address?: string;
}

interface AuthContextProps {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, referralCode?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user ID:", userId);
      
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      console.log("Fetched profile:", data);
      return data as UserProfile;
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      return null;
    }
  };

  // Ensure user exists in the users table
  const ensureUserExists = async (userId: string, email?: string) => {
    try {
      // Check if user exists first
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
        
      if (checkError || !existingUser) {
        console.log("User not in users table, creating entry...");
        
        // Generate a random referral code
        const { data: refCodeData } = await supabase.rpc("generate_random_referral_code");
        const referralCode = refCodeData || `USER${Math.floor(100000 + Math.random() * 900000)}`;
        
        // Create the user
        const { error: createError } = await supabase
          .from("users")
          .insert({
            id: userId,
            wallet_address: email || "anonymous",
            referral_code: referralCode,
            balance: 0,
            daily_streak: 1,
            total_tasks_completed: 0,
            referral_count: 0
          });
          
        if (createError) {
          console.error("Error creating user:", createError);
          return false;
        }
        
        return true;
      }
      
      return true; // User already exists
    } catch (error) {
      console.error("Error in ensureUserExists:", error);
      return false;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (!user?.id) return;
    
    // First ensure user exists in the users table
    await ensureUserExists(user.id, user.email);
    
    const profileData = await fetchProfile(user.id);
    
    if (profileData) {
      setProfile(profileData);
      setIsAdmin(profileData.role === 'admin');
    } else {
      // If we still couldn't get profile after ensuring user exists, something is wrong
      console.error("Failed to fetch user profile even after ensuring user exists");
      toast({
        title: "Error",
        description: "Could not load your profile. Please try signing in again.",
        variant: "destructive",
      });
    }
  };

  // Set up auth state listener
  useEffect(() => {
    // First set up the auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        const newUser = newSession?.user ?? null;
        setUser(newUser);
        
        if (newUser) {
          // Don't make any Supabase calls directly in the callback
          // Use setTimeout to avoid potential deadlocks
          setTimeout(async () => {
            // Ensure user exists in users table
            await ensureUserExists(newUser.id, newUser.email);
            
            const profileData = await fetchProfile(newUser.id);
            if (profileData) {
              setProfile(profileData);
              setIsAdmin(profileData.role === 'admin');
              
              // Update last login
              await supabase
                .from("users")
                .update({ last_login: new Date().toISOString() })
                .eq("id", newUser.id);
            } else {
              console.log("Could not find user profile, will try to create one");
            }
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          // Ensure user exists in users table
          await ensureUserExists(session.user.id, session.user.email);
          
          fetchProfile(session.user.id).then((profileData) => {
            if (profileData) {
              setProfile(profileData);
              setIsAdmin(profileData.role === 'admin');
            }
            setIsLoading(false);
          });
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    // Clean up subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Process referral when a new user signs up
  const processReferral = async (referralCode: string, userId: string) => {
    if (!referralCode || !userId) return false;

    try {
      // First find the referrer using the code
      const { data: referrerData, error: referrerError } = await supabase
        .from("users")
        .select("id")
        .eq("referral_code", referralCode)
        .single();
        
      if (referrerError || !referrerData) {
        console.error("Error finding referrer:", referrerError);
        return false;
      }
      
      const referrerId = referrerData.id;
      
      // Create referral record
      const { error: referralError } = await supabase
        .from("referrals")
        .insert({
          referrer_id: referrerId,
          referee_id: userId,
          reward: 50
        });
        
      if (referralError) {
        console.error("Error creating referral:", referralError);
        return false;
      }
      
      // Update referrer's referral count and balance
      const { error: updateError } = await supabase
        .from("users")
        .update({ 
          referral_count: supabase.rpc('increment', { arg: 1 }),
          balance: supabase.rpc('increment', { arg: 50 })
        })
        .eq("id", referrerId);
        
      if (updateError) {
        console.error("Error updating referrer:", updateError);
      }
      
      return true;
    } catch (error) {
      console.error("Error in processReferral:", error);
      return false;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, referralCode?: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Create user in users table
        const userCreated = await ensureUserExists(data.user.id, email);
        
        if (!userCreated) {
          toast({
            title: "Profile Creation Failed",
            description: "Your account was created but we couldn't set up your profile. Please contact support.",
            variant: "destructive",
          });
        }
        
        // If referral code is provided, process it
        if (referralCode) {
          const success = await processReferral(referralCode, data.user.id);
          if (success) {
            toast({
              title: "Referral Applied",
              description: "You've joined using a referral link! Bonus rewards applied.",
            });
          }
        }

        toast({
          title: "Welcome to WagChain!",
          description: "Your account has been created successfully.",
        });
        
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast({
        title: "Sign Up Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Ensure user exists in users table
        await ensureUserExists(data.user.id, email);
        
        toast({
          title: "Welcome Back!",
          description: "You've signed in successfully.",
        });
        
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast({
        title: "Sign In Failed",
        description: error.message || "Failed to sign in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
      
      navigate("/auth");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign Out Failed",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isAdmin,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
