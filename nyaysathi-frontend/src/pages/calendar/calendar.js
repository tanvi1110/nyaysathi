import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Layout from '../../components/layout/Layout';
import { useEffect, useState } from 'react';
import CreateEventModal from '../../components/CreateEventModal';
import { Button } from '../../components/ui/Button';
import GridTable from '../../components/ui/GridTable';
import { getContacts } from '@/src/utils/api';

export default function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [editEvent, setEditEvent] = useState(null);

    async function fetchEvents() {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data);
    }

    useEffect(() => {
        fetchEvents();
        getContacts().then(setContacts);
    }, []);

    const handleAddOrEditEvent = async (formData) => {
        if (editEvent && editEvent._id) {
            // Edit existing event
            const response = await fetch(`/api/events/${editEvent._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setShowModal(false);
                setEditEvent(null);
                fetchEvents();
            }
        } else {
            // Add new event
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setShowModal(false);
                fetchEvents();
            }
        }
    };

    const handleEditEvent = (event) => {
        setEditEvent(event);
        setShowModal(true);
    };

    // Calendar event click handler
    const handleCalendarEventClick = (info) => {
        const eventId = info.event.id;
        const event = events.find(e => e._id === eventId);
        if (event) {
            setEditEvent(event);
            setShowModal(true);
        }
    };

    // Table columns definition
    const columns = [
        { Header: 'Title', accessor: 'title' },
        { Header: 'Description', accessor: 'description' },
        { Header: 'Start', accessor: 'start', Cell: row => row.start ? new Date(row.start).toLocaleString() : '' },
        { Header: 'End', accessor: 'end', Cell: row => row.end ? new Date(row.end).toLocaleString() : '' },
        { Header: 'All Day', accessor: 'allDay', Cell: row => row.allDay ? 'Yes' : 'No' },
        { Header: 'Location', accessor: 'location' },
        { Header: 'Attendees', accessor: 'attendees', Cell: row => Array.isArray(row.attendees) && row.attendees.length > 0 ? row.attendees.join(', ') : '' },
        { Header: 'Notes', accessor: 'notes' },
        {
            Header: 'Actions', accessor: 'actions', Cell: row => (
                <Button variant="primary" className="!px-2 !py-1 text-xs" onClick={() => handleEditEvent(row)}>
                    Edit
                </Button>
            )
        },
    ];

    return (
        <Layout>
            <div className="mb-4 flex gap-2">
                <Button onClick={() => setShowModal(true)}>Add Event</Button>
                <Button variant="white" onClick={() => setShowTable((v) => !v)}>
                    {showTable ? 'Hide All Events' : 'Show All Events'}
                </Button>
            </div>
            {showTable && (
                <div className="mb-6">
                    <GridTable columns={columns} data={events} />
                </div>
            )}
            <div>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events.map(e => ({ ...e, id: e._id }))}
                    eventClick={handleCalendarEventClick}
                />
            </div>
            <CreateEventModal
                open={showModal}
                onClose={() => { setShowModal(false); setEditEvent(null); }}
                onSubmit={handleAddOrEditEvent}
                contacts={contacts}
                initialFormData={editEvent || {}}
            />
        </Layout>
    );
} 