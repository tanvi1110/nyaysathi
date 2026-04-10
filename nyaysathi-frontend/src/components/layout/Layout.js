import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import CreateTaskModal from '../CreateTaskModal';
import CreateEventModal from '../CreateEventModal';
import CreateContactModal from '../CreateContactModal';
import { getContacts } from '@/src/utils/api';
import { useAuth } from '@/src/lib/AuthContext';
import AuthModal from '@/src/components/AuthModal';

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [contacts, setContacts] = useState([]);
    const { requireAuth, authModalOpen, setAuthModalOpen, onAuthed } = useAuth();

    // Fetch contacts for modals
    useEffect(() => {
        getContacts().then(setContacts);
    }, []);

    const handleCreateNew = (type) => {
        requireAuth(() => {
            switch (type) {
                case 'task':
                    setShowTaskModal(true);
                    break;
                case 'event':
                    setShowEventModal(true);
                    break;
                case 'contact':
                    setShowContactModal(true);
                    break;
                default:
                    break;
            }
        });
    };

    return (
        <div className="flex min-h-screen bg-[var(--background)]">
            <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar onOpenModal={handleCreateNew} sidebarOpen={sidebarOpen} />
                <main
                    className={`mt-16 flex-1 max-w-[1600px] w-full mx-auto p-6 pt-8 transition-[margin] duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'
                        }`}
                >
                    {children}
                </main>
            </div>

            <CreateTaskModal
                open={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                onSubmit={(formData) => {
                    fetch('/api/tasks', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    })
                        .then(res => res.json())
                        .then(() => {
                            setShowTaskModal(false);
                            // Optionally refresh the page or update global state
                            window.location.reload();
                        })
                        .catch(err => {
                            console.error('Error saving task:', err);
                        });
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
                        body: JSON.stringify(formData)
                    })
                        .then(res => res.json())
                        .then(() => {
                            setShowEventModal(false);
                            // Optionally refresh the page or update global state
                            window.location.reload();
                        })
                        .catch(err => {
                            console.error('Error saving event:', err);
                        });
                }}
                contacts={contacts}
            />

            <CreateContactModal
                open={showContactModal}
                onClose={() => setShowContactModal(false)}
                onSubmit={(formData) => {
                    fetch('/api/contacts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    })
                        .then(res => res.json())
                        .then(() => {
                            setShowContactModal(false);
                            // Refresh contacts list
                            getContacts().then(setContacts);
                        })
                        .catch(err => {
                            console.error('Error saving contact:', err);
                        });
                }}
            />

            <AuthModal
                open={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                onAuthed={onAuthed}
            />
        </div>
    );
}
