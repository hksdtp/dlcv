import React from 'react';
import { Task } from '../types';
// FIX: Renamed component import from TaskListItem to TaskCard.
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

// FIX: Renamed component from TaskList to KanbanColumn for consistency with filename.
const KanbanColumn: React.FC<KanbanColumnProps> = ({ tasks, onSelectTask }) => {
  return (
    <div className="bg-white">
      {tasks.length > 0 ? (
        tasks.map(task => (
          <TaskCard key={task.id} task={task} onSelect={onSelectTask} />
        ))
      ) : (
        <div className="text-center text-sm text-slate-500 py-20 px-6">
          <h3 className="text-lg font-semibold text-slate-700">Hộp thư trống</h3>
          <p className="mt-1">Tuyệt vời! Không có công việc nào cần làm. Hãy thêm công việc mới để bắt đầu.</p>
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;
