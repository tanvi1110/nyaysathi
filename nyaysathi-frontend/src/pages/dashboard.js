import { useState, useEffect, useRef } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import CreateTaskModal from '../components/CreateTaskModal';
import CreateEventModal from '../components/CreateEventModal';
import CreateContactModal from '../components/CreateContactModal';

// Enhanced Timer component
function Timer() {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState('');
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    const startTimer = () => setIsRunning(true);
    const pauseTimer = () => setIsRunning(false);
    const resetTimer = () => {
        setIsRunning(false);
        setTime(0);
    };

    const saveSession = () => {
        if (time > 0 && currentSession.trim()) {
            const newSession = {
                id: Date.now(),
                name: currentSession,
                duration: time,
                date: new Date().toISOString()
            };
            setSessions(prev => [newSession, ...prev.slice(0, 4)]); // Keep last 5 sessions
            setCurrentSession('');
            resetTimer();
        }
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatSessionTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hrs > 0) return `${hrs}h ${mins}m`;
        return `${mins}m`;
    };

    return (
        <div className="space-y-4">
            {/* Timer Display */}
            <div className="text-center">
                <div className="text-3xl font-mono font-bold text-gray-900 mb-2">
                    {formatTime(time)}
                </div>
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="primary"
                        onClick={isRunning ? pauseTimer : startTimer}
                        className="flex items-center gap-2"
                    >
                        {isRunning ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Pause
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Start
                            </>
                        )}
                    </Button>
                    {time > 0 && (
                        <Button
                            variant="outline"
                            onClick={resetTimer}
                            className="text-xs px-2 py-1"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            {/* Session Input */}
            {time > 0 && (
                <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="What are you working on?"
                        value={currentSession}
                        onChange={(e) => setCurrentSession(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <Button
                        variant="outline"
                        onClick={saveSession}
                        disabled={!currentSession.trim()}
                        className="w-full text-sm"
                    >
                        Save Session
                    </Button>
                </div>
            )}

            {/* Recent Sessions */}
            {sessions.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Recent Sessions</h4>
                    <div className="space-y-1">
                        {sessions.map((session) => (
                            <div key={session.id} className="flex justify-between items-center text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                <span className="truncate">{session.name}</span>
                                <span className="font-mono">{formatSessionTime(session.duration)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Enhanced Create New Dropdown with Search
function CreateNewDropdown({ onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const options = [
        { id: 'task', label: 'Create New Task', icon: '📋', description: 'Add a new task to your list' },
        { id: 'event', label: 'Create New Event', icon: '📅', description: 'Schedule a new event' },
        { id: 'contact', label: 'Create New Contact', icon: '👤', description: 'Add a new contact' },
    ];

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onSelect(option.id);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="primary"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2"
            >
                Create new
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
            </Button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200">
                        <input
                            type="text"
                            placeholder="Search options..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            autoFocus
                        />
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelect(option)}
                                    className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                    <span className="text-xl">{option.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{option.label}</div>
                                        <div className="text-sm text-gray-500">{option.description}</div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-3 text-center text-gray-500">
                                No options found for "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Calendar Events Component
function CalendarEvents() {
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'Client Meeting - ABC Corp',
            date: '2024-01-15',
            time: '10:00 AM',
            type: 'meeting',
            status: 'upcoming',
            description: 'Discuss contract terms and legal requirements'
        },
        {
            id: 2,
            title: 'Court Hearing - Case #12345',
            date: '2024-01-16',
            time: '2:30 PM',
            type: 'court',
            status: 'upcoming',
            description: 'Final hearing for property dispute case'
        },
        {
            id: 3,
            title: 'Document Review Deadline',
            date: '2024-01-14',
            time: '5:00 PM',
            type: 'deadline',
            status: 'urgent',
            description: 'Review and finalize merger agreement documents'
        },
        {
            id: 4,
            title: 'Legal Consultation - XYZ Ltd',
            date: '2024-01-17',
            time: '11:00 AM',
            type: 'consultation',
            status: 'upcoming',
            description: 'Initial consultation for employment law case'
        },
        {
            id: 5,
            title: 'Contract Signing - DEF Corp',
            date: '2024-01-18',
            time: '3:00 PM',
            type: 'signing',
            status: 'upcoming',
            description: 'Final contract signing ceremony'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const getEventIcon = (type) => {
        switch (type) {
            case 'meeting': return '🤝';
            case 'court': return '⚖️';
            case 'deadline': return '⏰';
            case 'consultation': return '💼';
            case 'signing': return '✍️';
            default: return '📅';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'urgent': return 'bg-red-100 text-red-800';
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter events based on search and type
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || event.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                <Button variant="outline" className="text-sm">View All</Button>
            </div>

            {/* Search and Filter */}
            <div className="mb-4 space-y-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="all">All Types</option>
                        <option value="meeting">Meetings</option>
                        <option value="court">Court</option>
                        <option value="deadline">Deadlines</option>
                        <option value="consultation">Consultations</option>
                        <option value="signing">Signings</option>
                    </select>
                </div>
            </div>

            <div className="space-y-3">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <span className="text-2xl mt-1">{getEventIcon(event.type)}</span>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">{event.title}</div>
                                <div className="text-sm text-gray-500 mb-1">
                                    {new Date(event.date).toLocaleDateString()} at {event.time}
                                </div>
                                <div className="text-xs text-gray-600">{event.description}</div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                {event.status}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        {searchTerm || filterType !== 'all' ? 'No events found matching your criteria.' : 'No upcoming events.'}
                    </div>
                )}
            </div>
        </div>
    );
}

// Quick Stats Component
function QuickStats() {
    const stats = [
        { label: 'Active Cases', value: '24', change: '+12%', icon: '📁' },
        { label: 'Pending Tasks', value: '8', change: '-3%', icon: '📋' },
        { label: 'Upcoming Events', value: '5', change: '+2', icon: '📅' },
        { label: 'Total Contacts', value: '156', change: '+8%', icon: '👥' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <span className="text-2xl">{stat.icon}</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                        <span className="text-sm text-gray-500 ml-1">from last month</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Main Dashboard Component
export default function DashboardPage() {
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleCreateNew = (type) => {
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
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement global search functionality
        console.log('Searching for:', searchQuery);
        // You can add search logic here to search across tasks, events, contacts, etc.
    };

    return (
        <Layout>
            <div className="p-6 bg-[#F4F5FF] min-h-screen">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
                        </div>

                        {/* Global Search */}
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search tasks, events, contacts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 min-w-64"
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                className="px-4 py-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Quick Stats */}
                <QuickStats />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar Events */}
                    <div className="lg:col-span-2">
                        <CalendarEvents />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Timer Widget */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timer</h3>
                            <Timer />
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <CreateNewDropdown onSelect={handleCreateNew} />
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" className="w-full justify-center text-sm">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Report
                                    </Button>
                                    <Button variant="outline" className="w-full justify-center text-sm">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Email
                                    </Button>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" className="w-full justify-center text-sm">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Notes
                                    </Button>
                                    <Button variant="outline" className="w-full justify-center text-sm">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Calendar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CreateTaskModal
                isOpen={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                onSubmit={(task) => {
                    console.log('Task created:', task);
                    // You can add task to state here if needed
                }}
            />

            <CreateEventModal
                isOpen={showEventModal}
                onClose={() => setShowEventModal(false)}
                onSubmit={(event) => {
                    console.log('Event created:', event);
                    // You can add event to state here if needed
                }}
            />

            <CreateContactModal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
                onSubmit={(contact) => {
                    console.log('Contact created:', contact);
                    // You can add contact to state here if needed
                }}
            />
        </Layout>
    );
} 