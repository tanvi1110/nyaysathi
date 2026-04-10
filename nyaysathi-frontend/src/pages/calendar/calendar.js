import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Layout from '../../components/layout/Layout';
import { useEffect, useMemo, useState } from 'react';
import CreateEventModal from '../../components/CreateEventModal';
import { Button } from '../../components/ui/Button';
import GridTable from '../../components/ui/GridTable';
import { getContacts } from '@/src/utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/src/lib/AuthContext';

export default function CalendarPage() {
    const { requireAuth } = useAuth();
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [editEvent, setEditEvent] = useState(null);
    const [loading, setLoading] = useState(false);

    async function fetchEvents() {
        try {
            const response = await fetch('/api/events');
            if (!response.ok) throw new Error('Failed to fetch events');
            const data = await response.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Failed to fetch events');
        }
    }

    useEffect(() => {
        fetchEvents();
        getContacts().then(setContacts);
    }, []);

    const calendarEvents = useMemo(() => events.map((e) => ({ ...e, id: e._id })), [events]);

    const handleAddOrEditEvent = async (formData) => {
        setLoading(true);
        try {
            const processedFormData = {
                ...formData,
                start: formData.allDay ? new Date(`${formData.start}T00:00:00`) : new Date(formData.start),
                end: formData.end
                    ? (formData.allDay ? new Date(`${formData.end}T23:59:59`) : new Date(formData.end))
                    : null,
            };

            const endpoint = editEvent?._id ? `/api/events/${editEvent._id}` : '/api/events';
            const method = editEvent?._id ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(processedFormData),
            });

            if (!response.ok) throw new Error(editEvent?._id ? 'Failed to update event' : 'Failed to create event');
            toast.success(editEvent?._id ? 'Event updated successfully' : 'Event created successfully');
            setShowModal(false);
            setEditEvent(null);
            fetchEvents();
        } catch (error) {
            toast.error(error.message || 'Failed to save event');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        try {
            const response = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete event');
            toast.success('Event deleted successfully');
            fetchEvents();
        } catch {
            toast.error('Failed to delete event');
        }
    };

    const columns = [
        { Header: 'Title', accessor: 'title' },
        { Header: 'Description', accessor: 'description' },
        { Header: 'Start', accessor: 'start', Cell: (row) => row.start ? new Date(row.start).toLocaleString() : '' },
        { Header: 'End', accessor: 'end', Cell: (row) => row.end ? new Date(row.end).toLocaleString() : '' },
        { Header: 'All Day', accessor: 'allDay', Cell: (row) => row.allDay ? 'Yes' : 'No' },
        { Header: 'Location', accessor: 'location' },
        {
            Header: 'Actions', accessor: 'actions', Cell: (row) => (
                <div className="flex gap-2">
                    <Button variant="primary" className="!px-2 !py-1 text-xs" onClick={() => { setEditEvent(row); setShowModal(true); }}>
                        Edit
                    </Button>
                    <Button variant="white" className="!px-2 !py-1 text-xs text-red-600 hover:bg-red-50" onClick={() => handleDeleteEvent(row._id)}>
                        Delete
                    </Button>
                </div>
            )
        },
    ];

    return (
        <Layout>
            <section className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">Case Calendar</h1>
                            <p className="text-sm text-slate-600">Track hearings, consultations, and filing deadlines.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => requireAuth(() => setShowModal(true))}>Add Event</Button>
                            <Button variant="white" onClick={() => setShowTable((v) => !v)}>
                                {showTable ? 'Hide Event Table' : 'Show Event Table'}
                            </Button>
                        </div>
                    </div>

                    {showTable && (
                        <div className="mb-6">
                            <GridTable columns={columns} data={events} />
                        </div>
                    )}

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            events={calendarEvents}
                            height="auto"
                            eventClick={(info) => {
                                const event = events.find((e) => e._id === info.event.id);
                                if (event) {
                                    setEditEvent(event);
                                    setShowModal(true);
                                }
                            }}
                        />
                    </div>
                </div>
            </section>

            <CreateEventModal
                open={showModal}
                onClose={() => { setShowModal(false); setEditEvent(null); }}
                onSubmit={handleAddOrEditEvent}
                contacts={contacts}
                initialFormData={editEvent || {}}
                loading={loading}
            />
        </Layout>
    );
}
