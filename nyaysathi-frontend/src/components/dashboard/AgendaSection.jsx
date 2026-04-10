import React, { useCallback, useEffect, useState } from 'react';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import CreateTaskModal from '../CreateTaskModal';
import CreateEventModal from '../CreateEventModal';
import { getContacts } from '@/src/utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/src/lib/AuthContext';

const AgendaSection = () => {
    const { requireAuth } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [contacts, setContacts] = useState([]);

    const refreshTasks = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/tasks');
            if (!res.ok) throw new Error('Failed to load tasks');
            const data = await res.json();
            setTasks(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Could not load tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshEvents = useCallback(async () => {
        setEventsLoading(true);
        try {
            const res = await fetch('/api/events');
            if (!res.ok) throw new Error('Failed to load events');
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Could not load events');
        } finally {
            setEventsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshTasks();
    }, [refreshTasks]);

    useEffect(() => {
        refreshEvents();
    }, [refreshEvents]);

    useEffect(() => {
        getContacts().then(setContacts).catch(() => { });
    }, []);

    const handleToggleTaskStatus = async (taskId) => {
        const task = tasks.find((t) => String(t._id) === String(taskId));
        if (!task) return;

        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';

        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error('Update failed');
            const updatedTask = await res.json();
            setTasks((prev) => prev.map((t) => (String(t._id) === String(taskId) ? updatedTask : t)));
        } catch {
            toast.error('Failed to update task');
        }
    };

    const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
    const now = new Date();
    const upcomingEvents = events
        .filter((e) => e.start && new Date(e.start) >= now)
        .sort((a, b) => new Date(a.start) - new Date(b.start));

    const formatEventWhen = (start, allDay) => {
        const d = new Date(start);
        if (Number.isNaN(d.getTime())) return '';
        if (allDay) {
            return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        }
        return d.toLocaleString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    return (
        <Card className="mb-8 border border-slate-200/80 bg-gradient-to-br from-[#eef1ff] via-white to-slate-50/90 p-6 shadow-md">
            <div className="mb-5 text-xl font-semibold tracking-tight text-slate-900">Today&apos;s agenda</div>
            <div className="flex flex-col gap-4 lg:flex-row">
                <Card className="flex-1 border border-slate-100 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="font-medium text-slate-800">
                            {pendingCount} pending task{pendingCount !== 1 ? 's' : ''}
                        </span>
                        <Button
                            variant="primary"
                            className="!px-3 !py-1 text-xs"
                            onClick={() => requireAuth(() => setShowTaskModal(true))}
                        >
                            + Add task
                        </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {loading ? (
                            <span className="text-xs text-slate-400">Loading tasks…</span>
                        ) : tasks.length === 0 ? (
                            <span className="text-sm text-slate-500">No tasks yet. Add one to get started.</span>
                        ) : (
                            tasks.map((task) => (
                                <label key={task._id} className="flex cursor-pointer items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={task.status === 'Completed'}
                                        onChange={() => handleToggleTaskStatus(task._id)}
                                        className="accent-[#2A59D1]"
                                    />
                                    <span className={task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-800'}>
                                        {task.title}
                                    </span>
                                </label>
                            ))
                        )}
                    </div>
                </Card>

                <Card className="flex-1 border border-slate-100 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="font-medium text-slate-800">
                            {upcomingEvents.length} upcoming event{upcomingEvents.length !== 1 ? 's' : ''}
                        </span>
                        <Button
                            variant="primary"
                            className="!px-3 !py-1 text-xs"
                            onClick={() => requireAuth(() => setShowEventModal(true))}
                        >
                            + Add event
                        </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {eventsLoading ? (
                            <span className="text-xs text-slate-400">Loading events…</span>
                        ) : upcomingEvents.length === 0 ? (
                            <span className="text-sm text-slate-500">No upcoming events. Schedule hearings and meetings here.</span>
                        ) : (
                            upcomingEvents.slice(0, 5).map((ev) => (
                                <div key={ev._id} className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2">
                                    <div className="font-medium text-slate-900">{ev.title}</div>
                                    <div className="text-xs text-slate-500">{formatEventWhen(ev.start, ev.allDay)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            <CreateTaskModal
                open={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                onSubmit={(formData) => {
                    fetch('/api/tasks', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData),
                    })
                        .then(async (res) => {
                            if (!res.ok) throw new Error('Could not create task');
                            return res.json();
                        })
                        .then((newTask) => {
                            setTasks((prev) => [...prev, newTask]);
                            setShowTaskModal(false);
                            toast.success('Task added');
                        })
                        .catch(() => toast.error('Could not create task'));
                }}
                contacts={contacts}
                initialFormData={{}}
            />

            <CreateEventModal
                open={showEventModal}
                onClose={() => setShowEventModal(false)}
                onSubmit={(formData) => {
                    fetch('/api/events', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: formData.title,
                            description: formData.description,
                            start: formData.start,
                            end: formData.end || undefined,
                            allDay: formData.allDay,
                            location: formData.location,
                            attendees: formData.attendees || [],
                            notes: formData.notes,
                        }),
                    })
                        .then(async (res) => {
                            if (!res.ok) {
                                const err = await res.json().catch(() => ({}));
                                throw new Error(err.message || 'Could not create event');
                            }
                            return res.json();
                        })
                        .then(() => {
                            setShowEventModal(false);
                            refreshEvents();
                            toast.success('Event scheduled');
                        })
                        .catch((e) => toast.error(e.message || 'Could not create event'));
                }}
                contacts={contacts}
            />
        </Card>
    );
};

export default AgendaSection;
