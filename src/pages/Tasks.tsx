
import React, { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Task, UserTask } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Coins, Award, Check } from "lucide-react";

const Tasks: React.FC = () => {
  const { user, walletAddress } = useWallet();
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

        if (user) {
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
  }, [user?.id]);

  const handleCompleteTask = async (task: Task) => {
    if (!user) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if task is already completed
      const isCompleted = userTasks.some(ut => ut.task_id === task.id);
      if (isCompleted) {
        toast({
          title: "Already Completed",
          description: "You've already completed this task",
        });
        return;
      }

      // Insert user task record
      const { error: insertError } = await supabase
        .from("user_tasks")
        .insert({
          user_id: user.id,
          task_id: task.id,
          reward: task.reward,
        });

      if (insertError) throw insertError;

      // Update user balance
      const { error: updateError } = await supabase
        .from("users")
        .update({ 
          balance: user.balance + task.reward,
          total_tasks_completed: user.total_tasks_completed + 1
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

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

  if (!walletAddress) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Award className="h-16 w-16 text-neon-green mb-4" />
        <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-md">
          Connect your wallet to view and complete tasks to earn $WAGCoin rewards
        </p>
      </div>
    );
  }

  const dailyTasks = tasks.filter(task => task.type === "daily");
  const weeklyTasks = tasks.filter(task => task.type === "weekly");
  const completedTasks = tasks.filter(task => isTaskCompleted(task.id));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Complete Tasks, Earn $WAGCoin</h1>
        <p className="text-xl text-gray-300">
          Each task you complete rewards you with $WAGCoin
        </p>
        
        {user && (
          <div className="flex justify-center mt-6">
            <div className="bg-gray-900 border border-neon-green/20 rounded-full px-6 py-3 inline-flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Daily Streak:</span>
                <span className="font-bold text-neon-green flex items-center gap-1">
                  <Award className="h-4 w-4" />{user.daily_streak} days
                </span>
              </div>
              <div className="w-0.5 h-6 bg-gray-700"></div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Balance:</span>
                <span className="font-bold text-neon-green flex items-center gap-1">
                  <Coins className="h-4 w-4" />{user.balance} $WAG
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
          <TabsTrigger value="daily">Daily Tasks</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Tasks</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
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

const TaskGrid: React.FC<{ 
  tasks: Task[]; 
  onCompleteTask: (task: Task) => void;
  isTaskCompleted: (taskId: string) => boolean;
}> = ({ tasks, onCompleteTask, isTaskCompleted }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No tasks available in this category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task, index) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          index={index}
          onCompleteTask={onCompleteTask} 
          completed={isTaskCompleted(task.id)}
        />
      ))}
    </div>
  );
};

const TaskCard: React.FC<{ 
  task: Task; 
  index: number;
  onCompleteTask: (task: Task) => void;
  completed: boolean;
}> = ({ task, index, onCompleteTask, completed }) => {
  const difficultyColor = {
    easy: "text-green-400",
    medium: "text-yellow-400",
    hard: "text-red-400"
  };

  const difficultyBg = {
    easy: "bg-green-400/10",
    medium: "bg-yellow-400/10", 
    hard: "bg-red-400/10"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="border-neon-green/20 bg-gray-900 hover:bg-gray-800 transition-colors overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-neon-green">{task.title}</CardTitle>
              <CardDescription className="mt-1">{task.description}</CardDescription>
            </div>
            <div className={`px-2 py-1 rounded-md text-xs font-medium ${difficultyBg[task.difficulty as keyof typeof difficultyBg]}`}>
              <span className={difficultyColor[task.difficulty as keyof typeof difficultyColor]}>
                {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Coins className="h-5 w-5 text-neon-green" />
              <span className="font-bold text-neon-green">{task.reward} $WAGCoin</span>
            </div>
            <div className="text-sm text-gray-400">
              {task.type === "daily" ? "Daily Task" : "Weekly Task"}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            onClick={() => !completed && onCompleteTask(task)}
            disabled={completed}
            className={completed ? "bg-gray-700 w-full" : "bg-neon-green hover:bg-neon-green/90 text-black w-full"}
          >
            {completed ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Completed
              </>
            ) : (
              "Complete Task"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default Tasks;
