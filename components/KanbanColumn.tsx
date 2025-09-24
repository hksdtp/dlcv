import React from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  tasks: Task[];
  selectedTaskId?: string | null;
  onSelectTask: (task: Task) => void;
  isSearchActive: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ tasks, selectedTaskId, onSelectTask, isSearchActive }) => {
  if (tasks.length > 0) {
    return (
      <div className="bg-transparent">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            isSelected={task.id === selectedTaskId}
            onSelect={onSelectTask} 
          />
        ))}
      </div>
    );
  }

  if (isSearchActive) {
    return (
      <div className="text-center text-sm text-slate-500 py-20 px-6">
        <h3 className="text-lg font-semibold text-slate-700">Không tìm thấy kết quả</h3>
        <p className="mt-1">Thử một từ khóa khác để tìm kiếm công việc của bạn.</p>
      </div>
    );
  }

  return (
    <div className="text-center text-sm text-slate-500 py-20 px-6">
      <h3 className="text-lg font-semibold text-slate-700">Chưa có công việc</h3>
      <p className="mt-1">Nhấn nút dấu cộng ở trên để thêm công việc đầu tiên của bạn.</p>
    </div>
  );
};

export default KanbanColumn;
