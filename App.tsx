// FIX: Implement the main App component, state management, and layout.
import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskStatus, User } from './types';
import KanbanColumn from './components/KanbanColumn';
import AddTaskModal from './components/AddTaskModal';
import { ArrowLeftOnRectangleIcon, PlusIcon, MagnifyingGlassIcon } from './components/icons';
import TaskDetail from './components/TaskDetail';

// --- Sample Data ---
const users: User[] = [
    { id: 'u1', name: 'Sếp Hạnh', role: 'admin' },
    { id: 'u2', name: 'Mr Hùng', role: 'manager' },
    { id: 'u3', name: 'Ms Nhung', role: 'marketing_lead' },
    { id: 'u4', name: 'Ninh', role: 'member' },
];

const NINH_USER_ID = 'u4';

const initialTasks: Task[] = [
    {
        id: '1',
        title: 'Thiết kế giao diện cho trang đăng nhập',
        description: 'Tạo mockup và prototype cho luồng đăng nhập của người dùng, bao gồm cả xử lý lỗi và quên mật khẩu.',
        status: TaskStatus.ToDo,
        department: 'Marketing',
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
        department: 'Development',
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
        department: 'Development',
        subtasks: [
             { id: 's3-1', title: 'Cài đặt thư viện JWT', completed: true },
             { id: 's3-2', title: 'Tạo middleware xác thực', completed: true },
             { id: 's3-3', title: 'Áp dụng middleware cho các route cần bảo vệ', completed: true },
        ],
        createdAt: new Date('2023-10-24T09:00:00Z').toISOString(),
    }
];

// --- Helper Functions ---
const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const userColors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
];

const UserAvatar: React.FC<{ user: User }> = ({ user }) => {
    const colorIndex = user.id.charCodeAt(1) % userColors.length;
    return (
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 ${userColors[colorIndex]}`}>
            {getInitials(user.name)}
        </div>
    );
};


// --- UserSelectionScreen Component ---
interface UserSelectionScreenProps {
    users: User[];
    onSelectUser: (user: User) => void;
}
const UserSelectionScreen: React.FC<UserSelectionScreenProps> = ({ users, onSelectUser }) => {
    const roleLabels: { [key in User['role']]: string } = {
        admin: 'Quản trị viên',
        manager: 'Quản lý',
        marketing_lead: 'Trưởng phòng Marketing',
        member: 'Thành viên',
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 animate-app-fade-in">
            <div className="w-full max-w-md text-center">
                <h1 className="text-4xl font-bold text-slate-800 mb-4">Chọn người sử dụng</h1>
                <p className="text-slate-600 mb-12">Vui lòng chọn hồ sơ của bạn để tiếp tục.</p>
                <div className="space-y-4">
                    {users.map(user => (
                        <button 
                            key={user.id} 
                            onClick={() => onSelectUser(user)} 
                            className="w-full flex items-center gap-4 text-left px-4 py-3 bg-white/60 backdrop-blur-lg border border-slate-200/50 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-400/80 transition-all duration-300 transform hover:scale-105"
                        >
                            <UserAvatar user={user} />
                            <div>
                                <span className="font-semibold text-lg text-slate-900">{user.name}</span>
                                <p className="text-sm text-slate-500">{roleLabels[user.role]}</p>
                            </div>
                        </button>
                    ))}
                </div>
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
    const [searchQuery, setSearchQuery] = useState('');
    
    // Load tasks from localStorage (always Ninh's tasks)
    useEffect(() => {
        if (currentUser) {
            const storedTasks = localStorage.getItem(`tasks_${NINH_USER_ID}`);
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            } else {
                setTasks(initialTasks);
            }
            setSelectedTask(null);
            setSearchQuery('');
        }
    }, [currentUser]);

    // Save tasks to localStorage when they change
    useEffect(() => {
        // Only Ninh's actions should save tasks
        if (currentUser?.role === 'member') {
            localStorage.setItem(`tasks_${NINH_USER_ID}`, JSON.stringify(tasks));
        }
    }, [tasks, currentUser]);

    const isReadOnly = currentUser?.role !== 'member';

    const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'subtasks'>) => {
        if (isReadOnly) return;
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
        if (isReadOnly) return;
        setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
        if (selectedTask && selectedTask.id === updatedTask.id) {
            setSelectedTask(updatedTask);
        }
    };

    const handleDeleteTask = (taskId: string) => {
        if (isReadOnly) return;
        setTasks(tasks.filter(task => task.id !== taskId));
        setSelectedTask(null);
    };

    const filteredTasks = useMemo(() => {
        const sorted = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        let roleFiltered = sorted;
        if (currentUser?.role === 'marketing_lead') {
            roleFiltered = sorted.filter(task => task.department === 'Marketing');
        }

        if (!searchQuery) {
            return roleFiltered;
        }

        const lowercasedQuery = searchQuery.toLowerCase();
        return roleFiltered.filter(task => 
            task.title.toLowerCase().includes(lowercasedQuery) ||
            (task.description && task.description.toLowerCase().includes(lowercasedQuery))
        );
    }, [tasks, currentUser, searchQuery]);

    if (!currentUser) {
        return <UserSelectionScreen users={users} onSelectUser={setCurrentUser} />;
    }
    
    const userForHeader = isReadOnly ? users.find(u => u.id === NINH_USER_ID) : currentUser;
    
    const UserProfileHeader: React.FC<{ user: User, isReadOnly: boolean, targetUser?: User}> = ({ user, isReadOnly, targetUser }) => {
        const colorIndex = user.id.charCodeAt(1) % userColors.length;
        const roleLabels: { [key in User['role']]: string } = {
            admin: 'Admin',
            manager: 'Manager',
            marketing_lead: 'Marketing Lead',
            member: 'Member',
        };
        
        return (
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-md flex-shrink-0 ${userColors[colorIndex]}`}>
                    {getInitials(user.name)}
                </div>
                <div>
                    <p className="font-bold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-xs text-slate-500 leading-tight">
                        {isReadOnly && targetUser ? `Đang xem việc của ${targetUser.name}` : roleLabels[user.role]}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen w-screen overflow-hidden animate-app-fade-in">
            <div className="flex h-full">
                {/* --- Sidebar (Task List) --- */}
                <aside className={`
                    absolute md:relative w-full md:w-96 bg-slate-50/70 backdrop-blur-2xl border-r border-slate-300/50 
                    flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out
                    ${selectedTask ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
                `}>
                     <header className="p-4 border-b border-slate-300/50 flex justify-between items-center flex-shrink-0">
                        <UserProfileHeader user={currentUser} isReadOnly={isReadOnly} targetUser={userForHeader} />
                        <div className="flex items-center gap-1">
                            {!isReadOnly && (
                                <button onClick={() => setIsModalOpen(true)} title="Thêm công việc mới" className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-500/10 transition-colors">
                                    <PlusIcon />
                                </button>
                            )}
                            <button onClick={() => setCurrentUser(null)} title="Chuyển người dùng" className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-500/10 transition-colors">
                                <ArrowLeftOnRectangleIcon/>
                            </button>
                        </div>
                    </header>

                    {/* --- Search Bar --- */}
                    <div className="p-4 border-b border-slate-300/50 flex-shrink-0">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm kiếm công việc..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border-0 bg-slate-200/60 py-2.5 pl-10 pr-4 text-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto">
                        <KanbanColumn 
                            tasks={filteredTasks} 
                            onSelectTask={handleSelectTask} 
                            selectedTaskId={selectedTask?.id}
                            isSearchActive={searchQuery.length > 0}
                        />
                    </div>
                </aside>

                {/* --- Main Content (Task Detail) --- */}
                <main className={`
                    flex-1 transition-transform duration-300 ease-in-out
                    absolute md:relative w-full h-full bg-transparent
                    ${selectedTask ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                `}>
                    {selectedTask ? (
                       <TaskDetail 
                            task={selectedTask} 
                            onClose={handleCloseDetail} 
                            onUpdate={handleUpdateTask}
                            onDelete={handleDeleteTask}
                            isReadOnly={isReadOnly}
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
            {!isReadOnly && <AddTaskModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAddTask={handleAddTask}
            />}
        </div>
    );
};

export default App;