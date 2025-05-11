
import { supabase } from "@/integrations/supabase/client";

export const checkAndCreateUser = async (walletAddress: string): Promise<void> => {
  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking for existing user:", fetchError);
      return;
    }

    // If user doesn't exist, create a new one with a random referral code
    if (!existingUser) {
      const referralCode = generateReferralCode();
      
      const { error: createError } = await supabase.from("users").insert({
        wallet_address: walletAddress,
        balance: 0,
        referral_code: referralCode,
        referral_count: 0,
        daily_streak: 1,
        total_tasks_completed: 0,
      });

      if (createError) {
        console.error("Error creating new user:", createError);
      } else {
        console.log("New user created with wallet:", walletAddress);
      }
    } else {
      console.log("User already exists:", existingUser);
      await updateLoginStreak(existingUser.id, existingUser.last_login);
    }
  } catch (error) {
    console.error("Error in checkAndCreateUser:", error);
  }
};

const updateLoginStreak = async (userId: string, lastLogin: string): Promise<void> => {
  try {
    const now = new Date();
    const lastLoginDate = new Date(lastLogin);
    
    // Check if this is a new day login (compare the dates without time)
    const isNewDayLogin = 
      lastLoginDate.getFullYear() !== now.getFullYear() ||
      lastLoginDate.getMonth() !== now.getMonth() ||
      lastLoginDate.getDate() !== now.getDate();

    // Calculate if this is the next consecutive day
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const daysSinceLastLogin = Math.floor((now.getTime() - lastLoginDate.getTime()) / oneDayInMs);
    
    // If it's a new day and the consecutive day, increment streak and add bonus
    if (isNewDayLogin) {
      // Get the current streak
      const { data: userData } = await supabase
        .from("users")
        .select("daily_streak, balance")
        .eq("id", userId)
        .single();

      if (userData) {
        let newStreak = userData.daily_streak;
        let bonusReward = 0;
        
        if (daysSinceLastLogin === 1) {
          // Consecutive day login - increment streak
          newStreak += 1;
          bonusReward = 10; // Base reward for daily login
          
          // Add bonus for milestone streaks
          if (newStreak % 7 === 0) bonusReward += 50; // Weekly milestone
          if (newStreak % 30 === 0) bonusReward += 200; // Monthly milestone
        } else if (daysSinceLastLogin > 1) {
          // Streak broken - reset to 1
          newStreak = 1;
          bonusReward = 10; // Base reward for any login
        }

        if (bonusReward > 0) {
          // Update streak and balance
          await supabase
            .from("users")
            .update({
              daily_streak: newStreak,
              balance: userData.balance + bonusReward,
              last_login: new Date().toISOString()
            })
            .eq("id", userId);
        } else {
          // Just update the last login time
          await supabase
            .from("users")
            .update({
              daily_streak: newStreak,
              last_login: new Date().toISOString()
            })
            .eq("id", userId);
        }
      }
    }
  } catch (error) {
    console.error("Error updating login streak:", error);
  }
};

const generateReferralCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
