import { ArrowDropDown, CancelRounded } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { useState, useRef, useEffect } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import { getTasks, createTask, resetTaskCollection, getContacts, deleteTask, updateTask } from '@/src/utils/api';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';


const statusColors = {
    Completed: 'text-green-500 bg-green-50',
    Pending: 'text-blue-500 bg-blue-50',
};
const priorityColors = {
    High: 'text-red-500 bg-red-50',
    Normal: 'text-yellow-600 bg-yellow-50',
    Low: 'text-cyan-600 bg-cyan-50',
};

export default function TasksPage() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Normal',
        status: 'Pending',
        assignedTo: '',
        assignedBy: ''
    })
    const [showModal, setShowModal] = useState(false)
    const [tasks, setTasks] = useState([]);
    const [tab, setTab] = useState('Pending');
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRefs = useRef({});
    const [contacts, setContacts] = useState([]);
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        getTasks().then(setTasks);
        getContacts().then(setContacts);
    }, []);

    // Close dropdown on outside click
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (
                openDropdown !== null &&
                dropdownRefs.current[openDropdown] &&
                !dropdownRefs.current[openDropdown].contains(event.target)
            ) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData); // Debug log
        try {
            const newTask = await createTask(formData)
            console.log('Created task:', newTask); // Debug log
            console.log('Created task type:', typeof newTask); // Debug log
            console.log('Created task keys:', Object.keys(newTask || {})); // Debug log
            if (newTask && newTask._id) {
                setTasks(prev => [...prev, newTask])
                setShowModal(false)
            } else {
                console.error('Invalid task response:', newTask);
            }
            // Reset form data
            setFormData({
                title: '',
                description: '',
                priority: 'Normal',
                status: 'Pending'
            })
        } catch (error) {
            console.error('Error creating task:', error)
        }
    }

    const handleResetCollection = async () => {
        if (window.confirm('This will delete all existing tasks. Are you sure?')) {
            try {
                await resetTaskCollection();
                setTasks([]);
                alert('Collection reset successfully!');
            } catch (error) {
                console.error('Error resetting collection:', error);
                alert('Error resetting collection');
            }
        }
    }

    // Make reset function available globally for debugging
    React.useEffect(() => {
        window.resetTaskCollection = handleResetCollection;
        return () => {
            delete window.resetTaskCollection;
        };
    }, []);

    // Delete task handler
    const handleDeleteTask = async () => {
        if (!taskToDelete) return;
        try {
            await deleteTask(taskToDelete);
            setTasks(prev => prev.filter(task => task.id !== taskToDelete && task._id !== taskToDelete));
            setOpenDropdown(null);
            setShowDeleteModal(false);
            setTaskToDelete(null);
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task.');
        }
    };

    // Update task status handler
    const handleStatusChange = async (id, newStatus) => {
        try {
            const updatedTask = await updateTask(id, { status: newStatus });
            setTasks(prev => prev.map(task => (task.id === id || task._id === id ? { ...task, status: newStatus } : task)));
            setOpenDropdown(null);
            toast.success('Task status updated!');
        } catch (error) {
            console.error('Error updating task status:', error);
            toast.error('Failed to update status.');
        }
    };

    // PortalDropdown component
    function PortalDropdown({ open, position, children, onClose }) {
        useEffect(() => {
            if (!open) return;
            function handleClick(e) {
                if (open && !document.getElementById('portal-dropdown')?.contains(e.target)) {
                    onClose();
                }
            }
            document.addEventListener('mousedown', handleClick);
            return () => document.removeEventListener('mousedown', handleClick);
        }, [open, onClose]);
        if (!open) return null;
        return ReactDOM.createPortal(
            <div
                id="portal-dropdown"
                style={{ position: 'absolute', top: position.top, left: position.left, zIndex: 9999 }}
                className="w-36 min-w-[8rem] bg-white border border-gray-200 rounded-lg shadow-lg py-2 flex flex-col"
            >
                {children}
            </div>,
            document.body
        );
    }

    return (
        <Layout>
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Tasks</h1>
                    
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center bg-[#F7F9FB] rounded-xl shadow-sm border border-[#E5E5E5] w-fit">
                        <button
                            className={`px-8 py-3 rounded-xl font-semibold text-base focus:outline-none transition-all duration-200 ${tab === 'Pending' ? 'bg-[#635BFF] text-white' : 'bg-transparent text-slate-400'
                                }`}
                            onClick={() => setTab('Pending')}
                        >
                            Pending
                        </button>
                        <button
                            className={`px-8 py-3 rounded-xl font-semibold text-base focus:outline-none transition-all duration-200 ${tab === 'Completed' ? 'bg-[#635BFF] text-white' : 'bg-transparent text-slate-400'
                                }`}
                            onClick={() => setTab('Completed')}
                        >
                            Completed
                        </button>
                    </div>
                    <div className="flex items-center border rounded-lg px-3 py-2 bg-white text-gray-700">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>May 28, 2025 - Jun 04, 2025</span>
                    </div>
                    <button
                        className="ml-auto bg-[#2A59D1] hover:bg-[#1c409b] text-white px-4 py-2 rounded-lg font-medium"
                        onClick={() => setShowModal(true)}>
                        New Task +
                    </button>
                    <button className="border px-3 py-2 rounded-lg font-medium text-[#455560] flex items-center">
                        Filter
                        <ArrowDropDown />
                    </button>
                    <button
                        onClick={handleResetCollection}
                        className="border px-3 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50"
                    >
                        Reset Collection
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {/* Task List Header */}
                    <div className="grid grid-cols-7 gap-2 text-left text-gray-500 text-sm border-b px-2 py-2 font-medium">
                        <div>Title</div>
                        <div>Description</div>
                        <div>Status</div>
                        <div>Assigned By</div>
                        <div>Assigned To</div>
                        <div>Priority</div>
                        <div>Actions <span className="ml-1 text-xs">&#9432;</span></div>
                    </div>
                    {/* Task List Rows */}
                    <div className="divide-y">
                        {tasks.filter(t => t.status === tab).map(task => {
                            const dropdownKey = task._id || task.id;
                            return (
                                <div key={dropdownKey} className="grid grid-cols-7 gap-2 items-center px-2 py-3 hover:bg-gray-50">
                                    <div className="text-[#635BFF] underline cursor-pointer">{task.title}</div>
                                    <div className="text-sm text-gray-600 truncate">{task.description}</div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>{task.status}</span>
                                    </div>
                                    <div>{task.assignedBy && typeof task.assignedBy === 'object' ? `${task.assignedBy.name} ` : task.assignedBy}</div>
                                    <div>{task.assignedTo && typeof task.assignedTo === 'object' ? `${task.assignedTo.name}` : task.assignedTo}</div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[task.priority]}`}>{task.priority}</span>
                                    </div>
                                    {/* Actions Dropdown */}
                                    <div className="flex justify-center relative">
                                        <button
                                            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                                            onClick={e => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setDropdownPosition({
                                                    top: rect.bottom + window.scrollY,
                                                    left: rect.right - 160 + window.scrollX // 160px = dropdown width
                                                });
                                                setOpenDropdown(openDropdown === dropdownKey ? null : dropdownKey);
                                            }}
                                            aria-label="Actions"
                                            type="button"
                                        >
                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-500">
                                                <circle cx="5" cy="12" r="2" />
                                                <circle cx="12" cy="12" r="2" />
                                                <circle cx="19" cy="12" r="2" />
                                            </svg>
                                        </button>
                                    </div>
                                    {/* PortalDropdown renders at the body level */}
                                    <PortalDropdown open={openDropdown === dropdownKey} position={dropdownPosition} onClose={() => setOpenDropdown(null)}>
                                        <select
                                            className="border rounded px-2 py-1 text-xs mb-1 mx-2"
                                            value={task.status}
                                            onChange={e => handleStatusChange(dropdownKey, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                        <button className="text-[#635BFF] text-left px-4 py-2 hover:bg-gray-100 text-xs">Edit</button>
                                        <button className="text-red-500 text-left px-4 py-2 hover:bg-gray-100 text-xs" onClick={() => { setShowDeleteModal(true); setTaskToDelete(dropdownKey); }}>Delete</button>
                                    </PortalDropdown>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {
                showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Create New Task</h2>
                                <button
                                    className="text-gray-500 hover:text-gray-800"
                                    onClick={() => setShowModal(false)}
                                >
                                    <CancelRounded />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        name="title"
                                        type="text"
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows={3}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Assigned By</label>
                                    <div className="flex items-center gap-2">
                                        <select
                                            name="assignedBy"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            value={formData.assignedBy}
                                            onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                            required
                                        >
                                            <option value="">Select contact</option>
                                            {contacts.map(c => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                            onClick={() => router.push('/contact/contact')}
                                            title="Add new contact"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                                    <div className="flex items-center gap-2">
                                        <select
                                            name="assignedTo"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            value={formData.assignedTo}
                                            onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                            required
                                        >
                                            <option value="">Select contact</option>
                                            {contacts.map(c => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                            onClick={() => router.push('/contact/contact')}
                                            title="Add new contact"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                                        <select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                            <option>High</option>
                                            <option>Normal</option>
                                            <option>Low</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                            <option>Pending</option>
                                            <option>Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="mr-3 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#2A59D1] text-white rounded-md hover:bg-[#1c409b]"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-red-600">Delete Task</h2>
                        </div>
                        <p className="mb-6 text-gray-700">Are you sure you want to delete this task? This action cannot be undone.</p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                onClick={() => { setShowDeleteModal(false); setTaskToDelete(null); }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                onClick={handleDeleteTask}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
} 