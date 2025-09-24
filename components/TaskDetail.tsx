import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Subtask, SelectOption } from '../types';
import CustomSelect from './CustomSelect';
import { ChevronLeftIcon, TrashIcon, CheckIcon, PlusIcon } from './icons';

interface TaskDetailProps {
    task: Task;
    onClose: () => void;
    onUpdate: (task: Task) => void;
    onDelete: (taskId: string) => void;
    isReadOnly: boolean;
}

const statusOptions: SelectOption[] = [
    { value: TaskStatus.ToDo, label: 'Cần làm' },
    { value: TaskStatus.InProgress, label: 'Đang làm' },
    { value: TaskStatus.Done, label: 'Hoàn thành' },
];

const departmentOptions: SelectOption[] = [
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Development', label: 'Development' },
    { value: 'General', label: 'General' },
];

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose, onUpdate, onDelete, isReadOnly }) => {
    const [editedTask, setEditedTask] = useState<Task>(task);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

    useEffect(() => {
        setEditedTask(task);
    }, [task]);

    const handleInputChange = (field: 'title' | 'description', value: string) => {
        setEditedTask(prev => ({ ...prev, [field]: value }));
    };

    const handleSelectChange = (field: 'status' | 'department', value: string) => {
        setEditedTask(prev => ({...prev, [field]: value}));
    };

    const handleSubtaskToggle = (subtaskId: string) => {
        const updatedSubtasks = editedTask.subtasks.map(subtask =>
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        );
        setEditedTask(prev => ({ ...prev, subtasks: updatedSubtasks }));
    };
    
    const handleAddSubtask = () => {
        if (!newSubtaskTitle.trim() || isReadOnly) return;
        const newSubtask: Subtask = {
            id: `s-${Date.now()}`,
            title: newSubtaskTitle.trim(),
            completed: false,
        };
        setEditedTask(prev => ({...prev, subtasks: [...prev.subtasks, newSubtask]}));
        setNewSubtaskTitle('');
    };

    const handleDeleteSubtask = (subtaskId: string) => {
        if (isReadOnly) return;
        const updatedSubtasks = editedTask.subtasks.filter(subtask => subtask.id !== subtaskId);
        setEditedTask(prev => ({ ...prev, subtasks: updatedSubtasks }));
    };

    const handleSaveChanges = () => {
        if (isReadOnly) return;
        onUpdate(editedTask);
    };
    
    const hasChanges = JSON.stringify(task) !== JSON.stringify(editedTask);
    const completedSubtasks = editedTask.subtasks.filter(st => st.completed).length;
    const totalSubtasks = editedTask.subtasks.length;

    return (
        <div className="h-full flex flex-col max-h-full p-4 md:p-8">
            <header className="flex justify-between items-start flex-shrink-0 mb-6 md:mb-8">
                <div className="flex items-center gap-2 flex-grow min-w-0">
                    <button onClick={onClose} className="md:hidden p-2 -ml-2 text-indigo-600">
                       <ChevronLeftIcon/>
                    </button>
                    <input
                        type="text"
                        value={editedTask.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 bg-transparent focus:outline-none focus:bg-slate-200/50 rounded-lg p-1 -m-1 w-full truncate disabled:bg-transparent disabled:cursor-default"
                        readOnly={isReadOnly}
                    />
                </div>
                 <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 pl-2">
                     {!isReadOnly && hasChanges && (
                         <button onClick={handleSaveChanges} className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors flex items-center gap-2 pl-3 pr-4 text-sm font-semibold shadow-lg shadow-indigo-500/30">
                             <CheckIcon /> <span>Lưu</span>
                         </button>
                     )}
                     {!isReadOnly && (
                        <button onClick={() => { if(window.confirm('Bạn có chắc muốn xóa công việc này?')) onDelete(task.id) }} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-500/10 transition-colors">
                            <TrashIcon />
                        </button>
                     )}
                </div>
            </header>
            
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                    <div>
                        <label className="text-sm font-semibold text-slate-500 mb-2 block">Trạng thái</label>
                         <CustomSelect 
                            options={statusOptions}
                            value={editedTask.status}
                            onChange={(value) => handleSelectChange('status', value)}
                            disabled={isReadOnly}
                         />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-500 mb-2 block">Bộ phận</label>
                         <CustomSelect 
                            options={departmentOptions}
                            value={editedTask.department || 'General'}
                            onChange={(value) => handleSelectChange('department', value)}
                            disabled={isReadOnly}
                         />
                    </div>
                </div>


                <div>
                    <label htmlFor="description" className="text-sm font-semibold text-slate-500">Mô tả</label>
                    <textarea
                      id="description"
                      rows={5}
                      value={editedTask.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder={isReadOnly ? "Không có mô tả" : "Thêm mô tả chi tiết..."}
                      className="text-slate-700 mt-2 whitespace-pre-wrap leading-relaxed bg-slate-200/40 p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-200/40 disabled:cursor-default"
                      readOnly={isReadOnly}
                    />
                </div>

                <div className="mt-8">
                    <h3 className="font-semibold text-slate-800 mb-4">Checklist ({completedSubtasks}/{totalSubtasks})</h3>
                    <ul className="space-y-3">
                        {editedTask.subtasks.map(subtask => (
                            <li key={subtask.id} className="flex items-center p-2 bg-slate-200/40 rounded-lg group">
                                <input 
                                    type="checkbox"
                                    id={`subtask-${subtask.id}`}
                                    checked={subtask.completed}
                                    onChange={() => handleSubtaskToggle(subtask.id)}
                                    className="custom-checkbox h-4 w-4 text-indigo-600 flex-shrink-0 disabled:cursor-not-allowed"
                                    disabled={isReadOnly}
                                />
                                <label htmlFor={`subtask-${subtask.id}`} className={`ml-3 text-md text-slate-800 select-none flex-grow ${isReadOnly ? '' : 'cursor-pointer'} transition-colors ${subtask.completed ? 'line-through text-slate-500' : ''}`}>
                                    {subtask.title}
                                </label>
                                {!isReadOnly && (
                                    <button onClick={() => handleDeleteSubtask(subtask.id)} className="ml-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <TrashIcon />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                     {!isReadOnly && (
                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                value={newSubtaskTitle}
                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                                placeholder="Thêm công việc con mới..."
                                className="w-full px-3 py-2 border border-slate-300/70 rounded-lg bg-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex-grow"
                            />
                             <button onClick={handleAddSubtask} className="p-2 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-semibold flex items-center gap-1.5">
                                <PlusIcon /> <span className="hidden sm:inline">Thêm</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;