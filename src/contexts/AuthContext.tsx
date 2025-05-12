
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

export interface UserProfile {
  id: string;
  username: string;
  balance: number;
  referral_code: string;
  referral_count: number;
  daily_streak: number;
  total_tasks_completed: number;
  role: 'user' | 'admin';
  last_login: string;
  created_at: string;
}

interface AuthContextProps {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    const profileData = await fetchProfile(user.id);
    
    if (profileData) {
      setProfile(profileData);
      setIsAdmin(profileData.role === 'admin');
    }
    
    setIsLoading(false);
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
            const profileData = await fetchProfile(newUser.id);
            if (profileData) {
              setProfile(profileData);
              setIsAdmin(profileData.role === 'admin');
              
              // Update last login
              await supabase
                .from("profiles")
                .update({ last_login: new Date().toISOString() })
                .eq("id", newUser.id);
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
        fetchProfile(session.user.id).then((profileData) => {
          if (profileData) {
            setProfile(profileData);
            setIsAdmin(profileData.role === 'admin');
          }
          setIsLoading(false);
        });
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
      // Call the Supabase function to process the referral
      const { data, error } = await supabase.rpc('process_referral', {
        ref_code: referralCode,
        new_user_id: userId
      });

      if (error) {
        console.error("Error processing referral:", error);
        return false;
      }

      return data;
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
