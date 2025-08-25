import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
import Column from './Column';
import AddTaskModal from './AddTaskModal';

const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [draggedTask, setDraggedTask] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeColumnId, setActiveColumnId] = useState(null);

    const columns = [
        { id: 'todo', name: 'To Do', icon: Calendar, color: 'from-red-500 to-red-600' },
        { id: 'in-progress', name: 'In Progress', icon: Clock, color: 'from-yellow-500 to-yellow-600' },
        { id: 'review', name: 'Review', icon: AlertCircle, color: 'from-blue-500 to-blue-600' },
        { id: 'done', name: 'Done', icon: CheckCircle, color: 'from-green-500 to-green-600' }
    ];

    const priorityColors = {
        low: 'bg-green-500/20 text-green-400 border-green-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        high: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    const generateTaskId = () => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `task_${timestamp}_${random}`;
    };


    useEffect(() => {
        const storedTasks = localStorage.getItem('kanbanTasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    const saveTasksToStorage = (updatedTasks) => {
        setTasks(updatedTasks);
        localStorage.setItem('kanbanTasks', JSON.stringify(updatedTasks));
    };


    const getTasksForColumn = (columnId) => {
        return tasks
            .filter(task => {
                if (task.columnId !== columnId) return false;

                if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    !task.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return false;
                }

                if (filterPriority !== 'all' && task.priority !== filterPriority) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task.id);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.id);

        setTimeout(() => {
            if (e.target) e.target.style.opacity = '0.5';
        }, 0);
    };

    const handleDragOver = (e, columnId, index = null) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(columnId);
        setDragOverIndex(index !== null ? index : getTasksForColumn(columnId).length);
    };

    const handleDrop = (e, targetColumnId, targetIndex) => {
        e.preventDefault();

        const taskToMove = tasks.find(t => t.id === draggedTask);
        if (!taskToMove) {
            handleDragEnd();
            return;
        }

        let updatedTasks = tasks.filter(t => t.id !== taskToMove.id);

        const tasksInTargetColumn = updatedTasks
            .filter(t => t.columnId === targetColumnId)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const finalIndex = Math.min(targetIndex, tasksInTargetColumn.length);
        tasksInTargetColumn.splice(finalIndex, 0, {
            ...taskToMove,
            columnId: targetColumnId,
            updatedAt: new Date().toISOString()
        });

        tasksInTargetColumn.forEach((task, index) => {
            task.order = index;
        });

        updatedTasks = [
            ...updatedTasks.filter(t => t.columnId !== targetColumnId),
            ...tasksInTargetColumn
        ];

        saveTasksToStorage(updatedTasks);
        handleDragEnd();
    };

    const handleDragEnd = (e) => {
        if (e && e.target) e.target.style.opacity = '1';
        setDraggedTask(null);
        setDragOverColumn(null);
        setDragOverIndex(null);
    };

    const addTask = (columnId, taskData) => {
        const columnTasks = getTasksForColumn(columnId);
        const newTask = {
            id: generateTaskId(),
            ...taskData,
            columnId,
            order: columnTasks.length,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const updatedTasks = [...tasks, newTask];
        saveTasksToStorage(updatedTasks);
        return newTask;
    };

    const openModal = (columnId) => {
        setActiveColumnId(columnId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setActiveColumnId(null);
    };

    const handleAddTask = (taskData) => {
        if (activeColumnId) addTask(activeColumnId, taskData);
        closeModal();
    };

    const clearAllTasks = () => {
        saveTasksToStorage([]);
    };

    const getStats = () => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.columnId === 'done').length;
        const inProgressTasks = tasks.filter(task => task.columnId === 'in-progress').length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return { totalTasks, completedTasks, inProgressTasks, completionRate };
    };

    const stats = getStats();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Kanban Board</h1>
                            <p className="text-gray-400">
                                Manage your tasks efficiently with drag & drop functionality
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
                                <div className="text-2xl font-bold text-white">{stats.totalTasks}</div>
                                <div className="text-xs text-gray-400">Total Tasks</div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
                                <div className="text-2xl font-bold text-green-400">{stats.completedTasks}</div>
                                <div className="text-xs text-gray-400">Completed</div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
                                <div className="text-2xl font-bold text-blue-400">{stats.completionRate}%</div>
                                <div className="text-xs text-gray-400">Complete</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none cursor-pointer"
                            >
                                <option value="all">All Priorities</option>
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>
                        </div>

                        <button
                            onClick={clearAllTasks}
                            className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-all duration-200"
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {columns.map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            tasks={getTasksForColumn(column.id)}
                            dragOverColumn={dragOverColumn}
                            dragOverIndex={dragOverIndex}
                            handleDragOver={handleDragOver}
                            handleDrop={handleDrop}
                            handleDragStart={handleDragStart}
                            handleDragEnd={handleDragEnd}
                            priorityColors={priorityColors}
                            openModal={openModal}
                        />
                    ))}
                </div>

                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>
                        Drag and drop tasks between columns to update their status.
                        All changes are automatically saved.
                    </p>
                </div>
            </div>

            {isModalOpen && (
                <AddTaskModal
                    closeModal={closeModal}
                    handleAddTask={handleAddTask}
                />
            )}
        </div>
    );
};

export default KanbanBoard;
