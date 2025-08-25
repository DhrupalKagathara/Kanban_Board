import React from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const Column = ({
  column,
  tasks,
  dragOverColumn,
  dragOverIndex,
  handleDragOver,
  handleDrop,
  handleDragStart,
  handleDragEnd,
  priorityColors,
  openModal
}) => {
  const Icon = column.icon;

  const HighlightLine = ({ index }) =>
    dragOverColumn === column.id && dragOverIndex === index ? (
      <div className="h-1 bg-blue-400/70 rounded-full mx-1 shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
    ) : null;

  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 min-h-[600px] border border-gray-700 transition-all duration-300 ${dragOverColumn === column.id
          ? 'ring-2 ring-blue-400 bg-gray-800/70 shadow-lg shadow-blue-400/20'
          : 'hover:border-gray-600'
        }`}
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-gradient-to-r ${column.color} shadow-lg`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-white font-semibold">{column.name}</h2>
          <span className="text-gray-400 text-sm ml-1 bg-gray-700/50 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => openModal(column.id)}
          className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-200 hover:scale-110 group shadow-md hover:shadow-lg"
          title={`Add task to ${column.name}`}
        >
          <Plus className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
        </button>
      </div>

      <div
        className="space-y-2"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();

          const taskElements = [...e.currentTarget.querySelectorAll('[data-task-id]')];

          let closestIndex = taskElements.length;

          for (let i = 0; i < taskElements.length; i++) {
            const rect = taskElements[i].getBoundingClientRect();
            const midY = rect.top + rect.height / 2;

            if (e.clientY < midY) {
              closestIndex = i;
              break;
            }
          }

          handleDragOver(e, column.id, closestIndex);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDrop(e, column.id, dragOverIndex ?? tasks.length);
        }}
      >
        <HighlightLine index={0} />

        {tasks.map((task, index) => (
          <React.Fragment key={task.id}>
            <TaskCard
              task={task}
              columnId={column.id}
              index={index}
              dragOverColumn={dragOverColumn}
              dragOverIndex={dragOverIndex}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              priorityColors={priorityColors}
            />

            <HighlightLine index={index + 1} />
          </React.Fragment>
        ))}

        {tasks.length === 0 && (
          <div className="min-h-[120px] rounded-lg border-2 border-dashed border-gray-600 hover:border-gray-500 transition-all duration-300 flex flex-col items-center justify-center text-gray-500">
            <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No tasks yet</p>
            <p className="text-xs mt-1 opacity-70">Drag tasks here or click + to add</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
