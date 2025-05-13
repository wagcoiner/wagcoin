
import React from "react";
import { Task } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Coins, Check, ExternalLink } from "lucide-react";

interface TaskCardProps {
  task: Task;
  index: number;
  onCompleteTask: (task: Task) => void;
  completed: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onCompleteTask, completed }) => {
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
          
          {task.url && (
            <div className="mt-3">
              <a 
                href={task.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm flex items-center gap-1.5 text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Visit task link
              </a>
            </div>
          )}
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

export default TaskCard;
