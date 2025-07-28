import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import CreateTaskModal from '../CreateTaskModal';
import { getContacts } from '@/src/utils/api';

const AgendaSection = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [adding, setAdding] = useState(false);
    const [contacts, setContacts] = useState([]);

    // Fetch tasks from backend
    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/tasks');
                const data = await res.json();
                setTasks(data);
            } catch (err) {
                // handle error
            }
            setLoading(false);
        };
        fetchTasks();
    }, []);

    // Fetch contacts from backend
    useEffect(() => {
        getContacts().then(setContacts);
    }, []);

    // Add new task
    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return;
        setAdding(true);
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTaskTitle, description: '', status: 'Pending' })
            });
            const newTask = await res.json();
            setTasks(prev => [...prev, newTask]);
            setShowModal(false);
            setNewTaskTitle('');
        } catch (err) {
            // handle error
        }
        setAdding(false);
    };

    // Mark task as completed or undo completion
    const handleToggleTaskStatus = async (taskId) => {
        const task = tasks.find(t => t._id === taskId);
        if (!task) return;

        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';

        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const updatedTask = await res.json();
            setTasks(prevTasks => prevTasks.map(t => t._id === taskId ? updatedTask : t));
        } catch (err) {
            console.error("Failed to update task status:", err);
            // Optionally, show an error to the user
        }
    };

    // Calculate number of pending tasks
    const pendingCount = tasks.filter(t => t.status === 'Pending').length;

    return (
        <Card className="mb-6 bg-[#E9EDFF] p-6">
            <div className="font-semibold text-xl mb-4">Today's Agenda</div>
            <div className="flex gap-4">
                {/* Task Card */}
                <Card className="flex-1 bg-white">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{pendingCount} task{pendingCount !== 1 ? 's' : ''} today</span>
                        <Button variant="primary" className="!px-3 !py-1 text-xs" onClick={() => setShowModal(true)}>+ Add Task</Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {loading ? (
                            <span className="text-xs text-gray-400">Loading...</span>
                        ) : tasks.length === 0 ? (
                            <span className="text-xs text-gray-400">No tasks for today.</span>
                        ) : (
                            tasks.map((task) => (
                                <label key={task._id} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={task.status === 'Completed'}
                                        onChange={() => handleToggleTaskStatus(task._id)}
                                        className="accent-[#2A59D1]"
                                    />
                                    <span className={task.status === 'Completed' ? 'line-through text-gray-400' : ''}>{task.title}</span>
                                </label>
                            ))
                        )}
                    </div>
                </Card>
                {/* Calendar Card (static for now) */}
                <Card className="flex-1 bg-white">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">0 Calendar Events</span>
                        <Button variant="primary" className="!px-3 !py-1 text-xs">+ Add Event</Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {/* Calendar events will be implemented next */}
                    </div>
                </Card>
            </div>
            {/* Add Task Modal */}
            <CreateTaskModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={(formData) => {
                    setAdding(true);
                    fetch('/api/tasks', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    })
                        .then(res => res.json())
                        .then(newTask => {
                            setTasks(prev => [...prev, newTask]);
                            setShowModal(false);
                        })
                        .finally(() => setAdding(false));
                }}
                contacts={contacts}
                initialFormData={{ title: newTaskTitle }}
            />
        </Card>
    );
};

export default AgendaSection; 