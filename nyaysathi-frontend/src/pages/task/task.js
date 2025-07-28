import { ArrowDropDown, CancelRounded } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { useState, useRef, useEffect } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import { getTasks, createTask, resetTaskCollection, getContacts, deleteTask, updateTask } from '@/src/utils/api';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import CreateTaskModal from '../../components/CreateTaskModal';
import GridTable from '../../components/ui/GridTable';
import { Button } from '../../components/ui/Button';

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
        try {
            const newTask = await createTask(formData)
            if (newTask && newTask._id) {
                setTasks(prev => [...prev, newTask])
                setShowModal(false)
            } else {
                console.error('Invalid task response:', newTask);
            }
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

    React.useEffect(() => {
        window.resetTaskCollection = handleResetCollection;
        return () => {
            delete window.resetTaskCollection;
        };
    }, []);

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

    // Table columns definition
    const columns = [
        { Header: 'Title', accessor: 'title', Cell: row => <span className="text-[#635BFF] underline cursor-pointer">{row.title}</span> },
        { Header: 'Description', accessor: 'description', Cell: row => <span className="text-sm text-gray-600 truncate">{row.description}</span> },
        { Header: 'Status', accessor: 'status', Cell: row => <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[row.status]}`}>{row.status}</span> },
        { Header: 'Assigned By', accessor: 'assignedBy', Cell: row => row.assignedBy && typeof row.assignedBy === 'object' ? row.assignedBy.name : row.assignedBy },
        { Header: 'Assigned To', accessor: 'assignedTo', Cell: row => row.assignedTo && typeof row.assignedTo === 'object' ? row.assignedTo.name : row.assignedTo },
        { Header: 'Priority', accessor: 'priority', Cell: row => <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[row.priority]}`}>{row.priority}</span> },
        {
            Header: 'Actions', accessor: 'actions', Cell: row => (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { }} disabled>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => { setShowDeleteModal(true); setTaskToDelete(row._id || row.id); }}>Delete</Button>
                    <select
                        className="border rounded px-2 py-1 text-xs mb-1 mx-2"
                        value={row.status}
                        onChange={e => handleStatusChange(row._id || row.id, e.target.value)}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            )
        },
    ];

    return (
        <Layout>
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Tasks</h1>
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center bg-[#F7F9FB] rounded-xl shadow-sm border border-[#E5E5E5] w-fit">
                        <Button
                            variant={tab === 'Pending' ? 'primary' : 'ghost'}
                            className="px-8 py-3 rounded-xl font-semibold text-base"
                            onClick={() => setTab('Pending')}
                        >
                            Pending
                        </Button>
                        <Button
                            variant={tab === 'Completed' ? 'primary' : 'ghost'}
                            className="px-8 py-3 rounded-xl font-semibold text-base"
                            onClick={() => setTab('Completed')}
                        >
                            Completed
                        </Button>
                    </div>
                    <div className="flex items-center border rounded-lg px-3 py-2 bg-white text-gray-700">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>May 28, 2025 - Jun 04, 2025</span>
                    </div>
                    <Button
                        variant="primary"
                        className="ml-auto"
                        onClick={() => setShowModal(true)}
                    >
                        New Task +
                    </Button>
                    <Button variant="outline" className="flex items-center">
                        Filter
                        <ArrowDropDown />
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleResetCollection}
                    >
                        Reset Collection
                    </Button>
                </div>
                <GridTable columns={columns} data={tasks.filter(t => t.status === tab)} />
            </div>
            {
                <CreateTaskModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                    contacts={contacts}
                    initialFormData={formData}
                />
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
                            <Button
                                variant="outline"
                                onClick={() => { setShowDeleteModal(false); setTaskToDelete(null); }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDeleteTask}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
} 