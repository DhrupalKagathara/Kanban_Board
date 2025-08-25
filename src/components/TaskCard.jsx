import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';

const TaskCard = ({
  task,
  columnId,
  index,
  dragOverColumn,
  dragOverIndex,
  handleDragStart,
  handleDragEnd,
  priorityColors
}) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      data-task-id={task.id}
      draggable={true}
      onDragStart={(e) => {
        console.log('TaskCard: Drag start', task.title, task.id);
        setIsDragging(true);
        handleDragStart(e, task);
      }}
      onDragEnd={(e) => {
        console.log('TaskCard: Drag end');
        setIsDragging(false);
        handleDragEnd(e);
      }}
      className={` bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg border border-gray-600 cursor-move transition-all duration-200 mb-2
        ${isDragging 
          ? 'scale-105 shadow-2xl z-50 border-blue-400 bg-gray-800/80' 
          : 'hover:bg-gray-700/70 hover:scale-[1.02] hover:shadow-xl'
        }`}
      style={{ opacity: isDragging ? 0.9 : 1 }}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-gray-500 mt-1 opacity-100 transition-opacity" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium text-sm group-hover:text-blue-300 transition-colors">
              {task.title}
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="text-gray-400 text-xs line-clamp-2 mb-3">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">#{task.id.toString().slice(-4)}</span>
            {task.dueDate && (
              <span className="text-gray-500">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.createdAt && !task.dueDate && (
              <span className="text-gray-500">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
