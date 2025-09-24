// FIX: Implement the AddTaskModal component to allow users to create new tasks.
import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { CloseIcon } from './icons';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'subtasks'>) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.ToDo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({ title, description, status });
    setTitle('');
    setDescription('');
    setStatus(TaskStatus.ToDo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Tạo công việc mới</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ví dụ: Thiết kế trang chủ"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Mô tả (Tùy chọn)</label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Thêm mô tả chi tiết cho công việc..."
            />
          </div>
           <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value={TaskStatus.ToDo}>Cần làm</option>
              <option value={TaskStatus.InProgress}>Đang làm</option>
              <option value={TaskStatus.Done}>Hoàn thành</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 font-semibold">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold">
              Thêm công việc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
