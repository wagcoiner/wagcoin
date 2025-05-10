
import React from "react";
import { useWallet } from "@/contexts/WalletContext";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
  url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
});

// Define the type for our form
type TaskFormValues = z.infer<typeof taskFormSchema>;

const AdminPage: React.FC = () => {
  const { user } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize form with validation schema
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      reward: 0,
      difficulty: "medium",
      type: "daily",
      url: "",
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: TaskFormValues) => {
    try {
      // Insert the new task into Supabase
      const { error } = await supabase
        .from("tasks")
        .insert({
          title: data.title,
          description: data.description,
          reward: data.reward,
          difficulty: data.difficulty,
          type: data.type,
          url: data.url || null,
        });

      if (error) {
        throw error;
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

  // Check if user is authenticated and has admin privileges
  // For now, we'll just check if the user exists
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="mb-6">Please connect your wallet to access admin features.</p>
        <Button onClick={() => navigate("/")}>
          Return to Home <ArrowRight className="ml-2" />
        </Button>
      </div>
    );
  }

  // In a production environment, you'd check if user has admin role here
  // For now, we'll allow any authenticated user to use admin features

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

        <Card className="max-w-3xl mx-auto border-neon-green/20 bg-gray-900">
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
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com"
                            {...field}
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
      </motion.div>
    </div>
  );
};

export default AdminPage;
