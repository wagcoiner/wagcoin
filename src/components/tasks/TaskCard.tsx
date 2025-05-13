
import React, { useState, useEffect } from "react";
import { Task } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Coins, Check, ExternalLink, Loader2, Timer, Clock } from "lucide-react";

interface TaskCardProps {
  task: Task;
  index: number;
  onCompleteTask: (task: Task) => void;
  completed: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onCompleteTask, completed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTaskStarted, setIsTaskStarted] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 seconds = 1 minute
  const [isReadyToClaim, setIsReadyToClaim] = useState(false);

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
  
  useEffect(() => {
    // Check localStorage for an ongoing countdown
    const checkStoredCountdown = () => {
      const taskStartTime = localStorage.getItem(`task_${task.id}_start_time`);
      if (taskStartTime) {
        const startTimeMs = parseInt(taskStartTime, 10);
        const elapsedSeconds = Math.floor((Date.now() - startTimeMs) / 1000);
        
        if (elapsedSeconds >= 60) {
          // Countdown already completed
          setIsTaskStarted(true);
          setIsReadyToClaim(true);
          setCountdown(0);
        } else {
          // Resume countdown
          setIsTaskStarted(true);
          setCountdown(60 - elapsedSeconds);
          setIsReadyToClaim(false);
        }
      }
    };
    
    checkStoredCountdown();
  }, [task.id]);

  useEffect(() => {
    let timer: number | undefined;
    
    if (isTaskStarted && countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown(prevCount => {
          const newCount = prevCount - 1;
          if (newCount <= 0) {
            clearInterval(timer);
            setIsReadyToClaim(true);
            return 0;
          }
          return newCount;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTaskStarted, countdown]);

  const handleStartTask = () => {
    setIsTaskStarted(true);
    setCountdown(60);
    
    // Store start time in localStorage
    const startTime = Date.now();
    localStorage.setItem(`task_${task.id}_start_time`, startTime.toString());
    
    // If there's a URL, open it in a new tab
    if (task.url) {
      window.open(task.url, "_blank");
    }
  };
  
  const handleTaskComplete = async () => {
    if (completed || isProcessing || !isReadyToClaim) return;
    
    setIsProcessing(true);
    try {
      await onCompleteTask(task);
      // Clear the task timer from localStorage after successful completion
      localStorage.removeItem(`task_${task.id}_start_time`);
      setIsTaskStarted(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          
          {task.url && !isTaskStarted && !completed && (
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

          {isTaskStarted && !completed && !isReadyToClaim && (
            <div className="mt-3 flex items-center justify-center">
              <div className="text-center bg-gray-800 rounded-md p-2 w-full">
                <div className="flex items-center justify-center gap-2 text-orange-400">
                  <Clock className="h-4 w-4 animate-pulse" />
                  <span>Please wait {formatTime(countdown)} before claiming</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0">
          {completed ? (
            <Button
              disabled={true}
              className="bg-gray-700 w-full"
            >
              <Check className="mr-2 h-4 w-4" /> Completed
            </Button>
          ) : isTaskStarted ? (
            <Button
              onClick={handleTaskComplete}
              disabled={isProcessing || !isReadyToClaim}
              className={
                isProcessing 
                  ? "bg-neon-green/70 hover:bg-neon-green/70 text-black w-full"
                  : isReadyToClaim
                    ? "bg-neon-green hover:bg-neon-green/90 text-black w-full"
                    : "bg-gray-700 text-gray-400 w-full cursor-not-allowed"
              }
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" /> Claim Reward
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleStartTask}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
              <ExternalLink className="mr-2 h-4 w-4" /> Start Task
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
