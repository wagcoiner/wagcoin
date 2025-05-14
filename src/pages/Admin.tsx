
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, AlertTriangle, Trash } from "lucide-react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define the schema for task creation
const taskFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  reward: z.coerce.number().min(1, { message: "Reward must be at least 1" }),
  difficulty: z.enum(["easy", "medium", "hard"], { 
    required_error: "Please select a difficulty level" 
  }),
  type: z.enum(["daily", "weekly"], { 
    required_error: "Please select a task frequency" 
  }),
  destination_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
});

// Define the type for our form
type TaskFormValues = z.infer<typeof taskFormSchema>;

// Define task type
interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: string;
  type: string;
  url: string | null;
}

const Admin: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("wagcoin_admin") === "true";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load all tasks when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        setTasks(data || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [toast]);
  
  // Initialize form with validation schema
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      reward: 0,
      difficulty: "medium",
      type: "daily",
      destination_url: "",
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: TaskFormValues) => {
    try {
      // Insert the new task into Supabase
      const { data: newTask, error } = await supabase
        .from("tasks")
        .insert({
          title: data.title,
          description: data.description,
          reward: data.reward,
          difficulty: data.difficulty,
          type: data.type,
          url: data.destination_url || null,
        })
        .select();

      if (error) {
        throw error;
      }

      // Add the new task to our local state
      if (newTask && newTask.length > 0) {
        setTasks([newTask[0], ...tasks]);
      }

      // Show success toast
      toast({
        title: "Task Created",
        description: `${data.title} has been added successfully.`,
      });

      // Reset form
      form.reset();
      
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: `Failed to create task: ${(error as any).message}`,
        variant: "destructive",
      });
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      // Update the tasks state by filtering out the deleted task
      setTasks(tasks.filter(task => task.id !== taskId));

      toast({
        title: "Task Deleted",
        description: "The task has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: `Failed to delete task: ${(error as any).message}`,
        variant: "destructive",
      });
    }
  };

  // If not admin, show access required message
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="mb-6">Please log in to access admin features.</p>
        <Button onClick={() => navigate("/admin-login")}>
          Go to Admin Login <ArrowRight className="ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem("wagcoin_admin");
              navigate("/");
            }}
            className="border-red-500/50 text-red-500 hover:bg-red-500/10"
          >
            Logout
          </Button>
        </div>

        <Card className="max-w-3xl mx-auto border-neon-green/20 bg-gray-900 mb-8">
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
            <CardDescription>
              Add new tasks for users to complete and earn $WAGCoin rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a clear and concise task title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Explain what users need to do to complete this task" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="reward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reward ($WAGCoin)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Amount of $WAGCoin to reward upon completion
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="destination_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Link to where the task can be completed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Set the difficulty level of this task
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select task frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How often this task can be completed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-neon-green hover:bg-neon-green/90 text-black"
                  >
                    Create Task
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Display existing tasks table */}
        <Card className="max-w-3xl mx-auto border-neon-green/20 bg-gray-900">
          <CardHeader>
            <CardTitle>Existing Tasks</CardTitle>
            <CardDescription>
              Manage tasks that users can complete
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No tasks have been created yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Difficulty</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell className="hidden md:table-cell capitalize">{task.difficulty}</TableCell>
                      <TableCell className="hidden md:table-cell capitalize">{task.type}</TableCell>
                      <TableCell>{task.reward} $WAG</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="text-red-500 border-red-500/30 hover:bg-red-500/10">
                              <Trash size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the task "{task.title}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteTask(task.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Admin;
