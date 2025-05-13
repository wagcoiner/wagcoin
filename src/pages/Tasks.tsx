
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Task, UserTask } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Coins, Award, Check, ExternalLink, CheckCircle, Clock } from "lucide-react";
import UserBalance from "@/components/UserBalance";
import TaskGrid from "@/components/tasks/TaskGrid";
import BalanceCards from "@/components/tasks/BalanceCards";

const Tasks: React.FC = () => {
  const { profile, user, refreshProfile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });

        if (tasksError) throw tasksError;
        // Convert type field to match the Task interface type
        const typedTasks = tasksData?.map(task => ({
          ...task,
          type: task.type as 'daily' | 'weekly',
          difficulty: task.difficulty as 'easy' | 'medium' | 'hard'
        }));
        
        setTasks(typedTasks || []);

        // Only fetch user tasks if user is logged in
        if (user?.id) {
          const { data: userTasksData, error: userTasksError } = await supabase
            .from("user_tasks")
            .select("*")
            .eq("user_id", user.id);

          if (userTasksError) throw userTasksError;
          setUserTasks(userTasksData || []);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();

    // Set up real-time subscription for tasks
    const tasksSubscription = supabase
      .channel('tasks-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        }, 
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    // Set up real-time subscription for user tasks if user exists
    let userTasksSubscription = null;
    if (user?.id) {
      userTasksSubscription = supabase
        .channel(`user-tasks-${user.id}`)
        .on('postgres_changes', 
          {
            event: '*',
            schema: 'public',
            table: 'user_tasks',
            filter: `user_id=eq.${user.id}`
          }, 
          () => {
            fetchTasks();
            // Refresh user profile to update balance
            refreshProfile();
          }
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(tasksSubscription);
      if (userTasksSubscription) {
        supabase.removeChannel(userTasksSubscription);
      }
    };
  }, [user?.id, toast, refreshProfile]);

  const handleCompleteTask = async (task: Task) => {
    if (!user) {
      toast({
        title: "Not Signed In",
        description: "Please sign in to complete tasks",
        variant: "destructive",
      });
      return;
    }

    try {
      // Debug log to check user ID
      console.log("Current user ID:", user.id);
      console.log("Current task ID:", task.id);
      
      // Check if task is already completed
      const isCompleted = userTasks.some(ut => ut.task_id === task.id);
      if (isCompleted) {
        toast({
          title: "Already Completed",
          description: "You've already completed this task",
        });
        return;
      }

      // Insert user task record with detailed logging
      console.log("Attempting to insert user_task with:", {
        user_id: user.id,
        task_id: task.id,
        reward: task.reward
      });
      
      const { data: insertData, error: insertError } = await supabase
        .from("user_tasks")
        .insert({
          user_id: user.id,
          task_id: task.id,
          reward: task.reward,
        })
        .select();

      if (insertError) {
        console.error("Insert error details:", insertError);
        throw insertError;
      }
      
      console.log("Insert successful:", insertData);

      // Update user balance
      const currentBalance = profile?.balance || 0;
      const newBalance = currentBalance + task.reward;
      
      console.log("Updating user balance from", currentBalance, "to", newBalance);
      
      const { error: updateError } = await supabase
        .from("users")
        .update({ 
          balance: newBalance,
          total_tasks_completed: (profile?.total_tasks_completed || 0) + 1
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Update error details:", updateError);
        throw updateError;
      }

      // Refresh profile data to update the balance display
      await refreshProfile();

      // Add task to local state to avoid refetch
      setUserTasks(prev => [...prev, {
        id: insertData?.[0]?.id || 'temp-id-' + Date.now(),
        user_id: user.id,
        task_id: task.id,
        reward: task.reward,
        completed_at: new Date().toISOString()
      }]);

      toast({
        title: "Task Completed!",
        description: `You earned ${task.reward} $WAGCoin`,
      });
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isTaskCompleted = (taskId: string): boolean => {
    return userTasks.some(ut => ut.task_id === taskId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="animate-spin h-12 w-12 border-4 border-neon-green border-t-transparent rounded-full mb-4"></div>
        <p className="text-xl">Loading tasks...</p>
      </div>
    );
  }

  // We only check if user is not logged in, not profile
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Award className="h-16 w-16 text-neon-green mb-4" />
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-md">
          Sign in to view and complete tasks to earn $WAGCoin rewards
        </p>
      </div>
    );
  }

  const dailyTasks = tasks.filter(task => task.type === "daily");
  const weeklyTasks = tasks.filter(task => task.type === "weekly");
  const completedTasks = tasks.filter(task => isTaskCompleted(task.id));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">Complete Tasks, Earn $WAGCoin</h1>
        <p className="text-xl text-gray-300 mb-8">
          Each task you complete rewards you with $WAGCoin
        </p>
      </div>

      {user && profile && (
        <BalanceCards profile={profile} />
      )}

      <Tabs defaultValue="daily" className="w-full mt-12">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
          <TabsTrigger value="daily">Daily Tasks</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Tasks</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <TaskGrid tasks={dailyTasks} onCompleteTask={handleCompleteTask} isTaskCompleted={isTaskCompleted} />
        </TabsContent>
        
        <TabsContent value="weekly">
          <TaskGrid tasks={weeklyTasks} onCompleteTask={handleCompleteTask} isTaskCompleted={isTaskCompleted} />
        </TabsContent>
        
        <TabsContent value="completed">
          <TaskGrid tasks={completedTasks} onCompleteTask={handleCompleteTask} isTaskCompleted={isTaskCompleted} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
