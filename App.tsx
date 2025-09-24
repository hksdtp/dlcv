// FIX: Implement the main App component, state management, and layout.
import React, { useState } from 'react';
import { Task, TaskStatus, User } from './types';
import KanbanColumn from './components/KanbanColumn';
import AddTaskModal from './components/AddTaskModal';
import { ArrowLeftOnRectangleIcon, TrashIcon, CloseIcon } from './components/icons';

// --- Sample Data ---
const users: User[] = [
    { id: 'u1', name: 'Thanh Hằng', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 'u2', name: 'Minh Tuấn', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    { id: 'u3', name: 'Hoài An', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
    { id: 'u4', name: 'Gia Bảo', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
];


// --- UserSelectionScreen Component ---
interface UserSelectionScreenProps {
    users: User[];
    onSelectUser: (user: User) => void;
}
const UserSelectionScreen: React.FC<UserSelectionScreenProps> = ({ users, onSelectUser }) => {
    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
                <h1 className="text-3xl font-bold text-slate-800 text-center">Ai đang làm việc?</h1>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
                    {users.map(user => (
                        <div key={user.id} onClick={() => onSelectUser(user)} className="flex flex-col items-center gap-3 cursor-pointer group">
                            <img 
                                src={user.avatar} 
                                alt={user.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-transparent group-hover:border-indigo-500 transition-all duration-200"
                            />
                            <span className="font-semibold text-slate-700 group-hover:text-indigo-600">{user.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- TaskDetail Component (defined in-file to avoid creating new files) ---
interface TaskDetailProps {
    task: Task;
    onClose: () => void;
    onUpdate: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose, onUpdate, onDelete }) => {
    
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as TaskStatus;
        onUpdate({ ...task, status: newStatus });
    };

    const handleSubtaskToggle = (subtaskId: string) => {
        const updatedSubtasks = task.subtasks.map(subtask => 
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        );
        onUpdate({ ...task, subtasks: updatedSubtasks });
    };

    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
    const totalSubtasks = task.subtasks.length;
    const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col max-h-full">
            <header className="flex justify-between items-center pb-4 border-b border-slate-200 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <select
                        value={task.status}
                        onChange={handleStatusChange}
                        className={`text-sm font-semibold p-1 rounded-md border-2 ${
                            task.status === TaskStatus.ToDo ? 'border-red-200 bg-red-50 text-red-800' :
                            task.status === TaskStatus.InProgress ? 'border-yellow-200 bg-yellow-50 text-yellow-800' :
                            'border-green-200 bg-green-50 text-green-800'
                        } focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none`}
                    >
                        <option value={TaskStatus.ToDo}>Cần làm</option>
                        <option value={TaskStatus.InProgress}>Đang làm</option>
                        <option value={TaskStatus.Done}>Hoàn thành</option>
                    </select>
                    <span className="text-sm text-slate-500">Tạo ngày: {new Date(task.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-2">
                     <button onClick={() => onDelete(task.id)} className="p-2 text-slate-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors">
                        <TrashIcon />
                    </button>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-colors">
                        <CloseIcon />
                    </button>
                </div>
            </header>
            
            <div className="flex-grow pt-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-slate-900">{task.title}</h2>
                <p className="text-slate-600 mt-2 whitespace-pre-wrap">{task.description || 'Không có mô tả.'}</p>

                {totalSubtasks > 0 && (
                    <div className="mt-8">
                        <h3 className="font-semibold text-slate-800 mb-3">Công việc con ({completedSubtasks}/{totalSubtasks})</h3>
                        <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <ul className="space-y-3">
                            {task.subtasks.map(subtask => (
                                <li key={subtask.id} className="flex items-center">
                                    <input 
                                        type="checkbox"
                                        id={`subtask-${subtask.id}`}
                                        checked={subtask.completed}
                                        onChange={() => handleSubtaskToggle(subtask.id)}
                                        className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                    />
                                    <label htmlFor={`subtask-${subtask.id}`} className={`ml-3 text-sm text-slate-700 select-none cursor-pointer ${subtask.completed ? 'line-through text-slate-500' : ''}`}>
                                        {subtask.title}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- App Component ---
const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: '1',
            title: 'Thiết kế giao diện cho trang đăng nhập',
            description: 'Tạo mockup và prototype cho luồng đăng nhập của người dùng, bao gồm cả xử lý lỗi và quên mật khẩu.',
            status: TaskStatus.ToDo,
            subtasks: [
                { id: 's1-1', title: 'Vẽ wireframe', completed: true },
                { id: 's1-2', title: 'Tạo mockup high-fidelity', completed: false },
                { id: 's1-3', title: 'Tạo prototype tương tác', completed: false },
            ],
            createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
        },
        {
            id: '2',
            title: 'Phát triển API cho tính năng giỏ hàng',
            description: 'Xây dựng các endpoint RESTful để quản lý giỏ hàng: thêm, xóa, cập nhật sản phẩm.',
            status: TaskStatus.InProgress,
            subtasks: [
                { id: 's2-1', title: 'Định nghĩa data model', completed: true },
                { id: 's2-2', title: 'Viết endpoint POST /cart', completed: true },
                { id: 's2-3', title: 'Viết endpoint GET /cart', completed: false },
                { id: 's2-4', title: 'Viết endpoint DELETE /cart/item/:id', completed: false },
            ],
            createdAt: new Date('2023-10-25T14:30:00Z').toISOString(),
        },
        {
            id: '3',
            title: 'Triển khai hệ thống xác thực người dùng',
            description: 'Tích hợp JWT (JSON Web Tokens) để bảo vệ các API và quản lý phiên đăng nhập của người dùng.',
            status: TaskStatus.Done,
            subtasks: [
                 { id: 's3-1', title: 'Cài đặt thư viện JWT', completed: true },
                 { id: 's3-2', title: 'Tạo middleware xác thực', completed: true },
                 { id: 's3-3', title: 'Áp dụng middleware cho các route cần bảo vệ', completed: true },
            ],
            createdAt: new Date('2023-10-24T09:00:00Z').toISOString(),
        }
    ]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'subtasks'>) => {
        const newTask: Task = {
            ...taskData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            subtasks: [],
        };
        setTasks(prevTasks => [newTask, ...prevTasks]);
    };

    const handleSelectTask = (task: Task) => {
        setSelectedTask(task);
    };

    const handleCloseDetail = () => {
        setSelectedTask(null);
    };

    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
        if (selectedTask && selectedTask.id === updatedTask.id) {
            setSelectedTask(updatedTask);
        }
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId));
        setSelectedTask(null);
    };

    const sortedTasks = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (!currentUser) {
        return <UserSelectionScreen users={users} onSelectUser={setCurrentUser} />;
    }

    return (
        <div className="bg-slate-100 min-h-screen font-sans text-slate-800">
            <div className="flex h-screen">
                <aside className="w-96 bg-white border-r border-slate-200 flex flex-col">
                     <header className="p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover"/>
                            <div>
                               <p className="font-bold text-slate-800">{currentUser.name}</p>
                               <p className="text-xs text-slate-500">Quản lý công việc</p>
                            </div>
                        </div>
                         <button onClick={() => setCurrentUser(null)} title="Chuyển người dùng" className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
                             <ArrowLeftOnRectangleIcon/>
                         </button>
                    </header>
                    <div className="flex-grow overflow-y-auto">
                        <KanbanColumn tasks={sortedTasks} onSelectTask={handleSelectTask} />
                    </div>
                    <footer className="p-4 border-t border-slate-200 flex-shrink-0">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            <span>Thêm công việc mới</span>
                        </button>
                    </footer>
                </aside>

                <main className="flex-1 p-6 overflow-y-auto bg-slate-50">
                    {selectedTask ? (
                       <TaskDetail 
                            task={selectedTask} 
                            onClose={handleCloseDetail} 
                            onUpdate={handleUpdateTask}
                            onDelete={handleDeleteTask}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h2 className="text-2xl font-semibold mt-4 text-slate-600">Chưa chọn công việc</h2>
                            <p className="mt-2 max-w-sm">Chọn một công việc từ danh sách bên trái để xem chi tiết, cập nhật trạng thái hoặc các công việc con.</p>
                        </div>
                    )}
                </main>
            </div>
            <AddTaskModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAddTask={handleAddTask}
            />
        </div>
    );
};

export default App;
