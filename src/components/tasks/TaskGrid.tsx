
import React from "react";
import { Task } from "@/types";
import { motion } from "framer-motion";
import TaskCard from "./TaskCard";

interface TaskGridProps {
  tasks: Task[];
  onCompleteTask: (task: Task) => void;
  isTaskCompleted: (taskId: string) => boolean;
}

const TaskGrid: React.FC<TaskGridProps> = ({ tasks, onCompleteTask, isTaskCompleted }) => {
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

export default TaskGrid;
