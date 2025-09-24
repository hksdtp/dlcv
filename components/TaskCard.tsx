import React from 'react';
import { Task, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onSelect: (task: Task) => void;
}

const statusConfig = {
    [TaskStatus.ToDo]: {
        dotClasses: 'bg-red-500',
    },
    [TaskStatus.InProgress]: {
        dotClasses: 'bg-yellow-500',
    },
    [TaskStatus.Done]: {
        dotClasses: 'bg-green-500',
    }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, isSelected, onSelect }) => {
    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
    const totalSubtasks = task.subtasks.length;
    
    return (
        <article 
            onClick={() => onSelect(task)} 
            className={`flex items-start gap-4 p-4 border-b border-slate-200/80 cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-indigo-100/60' : 'hover:bg-slate-100/50'}`}
        >
            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusConfig[task.status].dotClasses}`}></div>
            <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-slate-800 text-md truncate pr-4">{task.title}</h3>
                    <span className="text-xs text-slate-500 flex-shrink-0">{new Date(task.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <p className="text-slate-600 text-sm truncate mt-1">{task.description || 'Không có mô tả'}</p>
                
                {totalSubtasks > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <span>{`✓ ${completedSubtasks}/${totalSubtasks}`}</span>
                    </div>
                )}
            </div>
        </article>
    );
};

export default TaskCard;