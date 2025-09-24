import React from 'react';
import { Task } from '../types';
// FIX: Renamed component import from TaskListItem to TaskCard.
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  tasks: Task[];
  selectedTaskId?: string | null;
  onSelectTask: (task: Task) => void;
}

// FIX: Renamed component from TaskList to KanbanColumn for consistency with filename.
const KanbanColumn: React.FC<KanbanColumnProps> = ({ tasks, selectedTaskId, onSelectTask }) => {
  return (
    <div className="bg-transparent">
      {tasks.length > 0 ? (
        tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            isSelected={task.id === selectedTaskId}
            onSelect={onSelectTask} 
          />
        ))
      ) : (
        <div className="text-center text-sm text-slate-500 py-20 px-6">
          <h3 className="text-lg font-semibold text-slate-700">Chưa có công việc</h3>
          <p className="mt-1">Nhấn nút dấu cộng ở trên để thêm công việc đầu tiên của bạn.</p>
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;