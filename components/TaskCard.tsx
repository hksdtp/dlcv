import React from 'react';
import { Task, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
}

const statusConfig = {
    [TaskStatus.ToDo]: {
        label: 'Cần làm',
        badgeClasses: 'bg-red-100 text-red-800',
    },
    [TaskStatus.InProgress]: {
        label: 'Đang làm',
        badgeClasses: 'bg-yellow-100 text-yellow-800',
    },
    [TaskStatus.Done]: {
        label: 'Hoàn thành',
        badgeClasses: 'bg-green-100 text-green-800',
    }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect }) => {
    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
    const totalSubtasks = task.subtasks.length;
    const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
    
    return (
        <article onClick={() => onSelect(task)} className="flex items-start gap-4 p-4 border-b border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors duration-200">
            <div className="flex-grow overflow-hidden">
                 <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-semibold mr-3 px-2.5 py-0.5 rounded-full ${statusConfig[task.status].badgeClasses}`}>
                        {statusConfig[task.status].label}
                    </span>
                    <span className="text-xs text-slate-500 flex-shrink-0">{new Date(task.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>

                <h3 className="font-bold text-slate-800 text-md truncate">{task.title}</h3>
                <p className="text-slate-600 text-sm truncate mt-1">{task.description || 'Không có mô tả'}</p>
                
                {totalSubtasks > 0 && (
                    <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-slate-500">{completedSubtasks}/{totalSubtasks} công việc con</span>
                            <span className="text-xs font-medium text-slate-500">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
};

export default TaskCard;