import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddTaskModal = ({ closeModal, handleAddTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    handleAddTask(formData);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && formData.title.trim()) {
      handleSubmit();
    } else if (e.key === 'Escape') {
      closeModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => handleKeyPress(e);
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [formData.title]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Add New Task</h3>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter task title"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && formData.title.trim() && handleSubmit()}
            />
            {!formData.title.trim() && (
              <p className="text-red-400 text-xs mt-1">Title is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Enter task description (optional)"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-200 border border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.title.trim()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-blue-500 disabled:hover:to-purple-500"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AddTaskModal;