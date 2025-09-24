// FIX: Implement the main App component, state management, and layout.
import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, User, SelectOption } from './types';
import KanbanColumn from './components/KanbanColumn';
import AddTaskModal from './components/AddTaskModal';
import { ArrowLeftOnRectangleIcon, TrashIcon, CloseIcon, PlusIcon, ChevronLeftIcon } from './components/icons';
import CustomSelect from './components/CustomSelect';

// --- Sample Data ---
const users: User[] = [
    { id: 'u1', name: 'Thanh Hằng', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 'u2', name: 'Minh Tuấn', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    { id: 'u3', name: 'Hoài An', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
    { id: 'u4', name: 'Gia Bảo', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
];

const statusOptions: SelectOption[] = [
    { value: TaskStatus.ToDo, label: 'Cần làm' },
    { value: TaskStatus.InProgress, label: 'Đang làm' },
    { value: TaskStatus.Done, label: 'Hoàn thành' },
];

// --- UserSelectionScreen Component ---
interface UserSelectionScreenProps {
    users: User[];
    onSelectUser: (user: User) => void;
}
const UserSelectionScreen: React.FC<UserSelectionScreenProps> = ({ users, onSelectUser }) => {
    return (
        <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <h1 className="text-4xl font-bold text-slate-800">Ai đang làm việc?</h1>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-6 mt-12">
                    {users.map(user => (
                        <div key={user.id} onClick={() => onSelectUser(user)} className="flex flex-col items-center gap-3 cursor-pointer group">
                            <img 
                                src={user.avatar} 
                                alt={user.name}
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
                            />
                            <span className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{user.name}</span>
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
    
    const handleStatusChange = (newStatus: string) => {
        onUpdate({ ...task, status: newStatus as TaskStatus });
    };

    const handleSubtaskToggle = (subtaskId: string) => {
        const updatedSubtasks = task.subtasks.map(subtask => 
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        );
        onUpdate({ ...task, subtasks: updatedSubtasks });
    };

    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
    const totalSubtasks = task.subtasks.length;

    return (
        <div className="h-full flex flex-col max-h-full p-4 md:p-8">
            <header className="flex justify-between items-start flex-shrink-0 mb-6 md:mb-8">
                <div className="flex items-center gap-2">
                    <button onClick={onClose} className="md:hidden p-2 -ml-2 text-indigo-600">
                       <ChevronLeftIcon/>
                    </button>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 break-words">{task.title}</h1>
                </div>
                 <div className="flex items-center gap-1 md:gap-2">
                     <button onClick={() => { if(window.confirm('Bạn có chắc muốn xóa công việc này?')) onDelete(task.id) }} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-500/10 transition-colors">
                        <TrashIcon />
                    </button>
                    <button onClick={onClose} className="hidden md:block p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-500/10 transition-colors">
                        <CloseIcon />
                    </button>
                </div>
            </header>
            
            <div className="flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                     <div>
                        <label className="text-sm font-semibold text-slate-500 mb-2 block">Trạng thái</label>
                         <CustomSelect 
                            options={statusOptions}
                            value={task.status}
                            onChange={handleStatusChange}
                         />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-500">Ngày tạo</label>
                        <p className="mt-2 w-full text-md p-2.5 rounded-lg bg-slate-100">{new Date(task.createdAt).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-500">Mô tả</label>
                    <p className="text-slate-700 mt-2 whitespace-pre-wrap leading-relaxed bg-slate-100 p-4 rounded-lg">{task.description || 'Không có mô tả.'}</p>
                </div>

                {totalSubtasks > 0 && (
                    <div className="mt-8">
                        <h3 className="font-semibold text-slate-800 mb-4">Checklist ({completedSubtasks}/{totalSubtasks})</h3>
                        <ul className="space-y-4">
                            {task.subtasks.map(subtask => (
                                <li key={subtask.id} className="flex items-center p-3 bg-slate-100 rounded-lg">
                                    <input 
                                        type="checkbox"
                                        id={`subtask-${subtask.id}`}
                                        checked={subtask.completed}
                                        onChange={() => handleSubtaskToggle(subtask.id)}
                                        className="custom-checkbox h-4 w-4 text-indigo-600 flex-shrink-0"
                                    />
                                    <label htmlFor={`subtask-${subtask.id}`} className={`ml-3 text-md text-slate-800 select-none cursor-pointer transition-colors ${subtask.completed ? 'line-through text-slate-500' : ''}`}>
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
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Load initial data on mount
    useEffect(() => {
        setTasks([
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
    }, []);

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
        <div className="bg-slate-50 min-h-screen">
            <div className="flex h-screen overflow-hidden">
                {/* --- Sidebar (Task List) --- */}
                <aside className={`
                    absolute md:relative w-full md:w-96 bg-white/70 backdrop-blur-xl border-r border-slate-200/80 
                    flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out
                    ${selectedTask ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
                `}>
                     <header className="p-4 border-b border-slate-200/80 flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover"/>
                            <div>
                               <p className="font-bold text-slate-800">{currentUser.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setIsModalOpen(true)} title="Thêm công việc mới" className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-500/10 transition-colors">
                                <PlusIcon />
                            </button>
                            <button onClick={() => setCurrentUser(null)} title="Chuyển người dùng" className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-500/10 transition-colors">
                                <ArrowLeftOnRectangleIcon/>
                            </button>
                        </div>
                    </header>
                    <div className="flex-grow overflow-y-auto">
                        <KanbanColumn 
                            tasks={sortedTasks} 
                            onSelectTask={handleSelectTask} 
                            selectedTaskId={selectedTask?.id}
                        />
                    </div>
                </aside>

                {/* --- Main Content (Task Detail) --- */}
                <main className={`
                    flex-1 transition-transform duration-300 ease-in-out
                    absolute md:relative w-full h-full bg-slate-50
                    ${selectedTask ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                `}>
                    {selectedTask ? (
                       <TaskDetail 
                            task={selectedTask} 
                            onClose={handleCloseDetail} 
                            onUpdate={handleUpdateTask}
                            onDelete={handleDeleteTask}
                        />
                    ) : (
                        <div className="hidden md:flex flex-col items-center justify-center h-full text-center text-slate-500 p-8">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h2 className="text-2xl font-semibold mt-6 text-slate-600">Bắt đầu làm việc</h2>
                            <p className="mt-2 max-w-sm">Chọn một công việc từ danh sách bên trái để xem chi tiết.</p>
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