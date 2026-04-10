import { Add, Notifications, Pause, PlayArrow, Search as SearchIcon } from "@mui/icons-material";
import { Button } from "../ui/Button";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

export default function Navbar({ onOpenModal, sidebarOpen = true }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [headerSearch, setHeaderSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerTime, setTimerTime] = useState(0);
    const [timerMode, setTimerMode] = useState('stopwatch');
    const [sessions, setSessions] = useState([]);
    const [currentSessionName, setCurrentSessionName] = useState('');
    const [showTimerModal, setShowTimerModal] = useState(false);
    const dropdownRef = useRef(null);
    const timerRef = useRef(null);

    const options = [
        { id: 'task', label: 'Create New Task', icon: '📋', description: 'Add a new task to your list' },
        { id: 'event', label: 'Create New Event', icon: '📅', description: 'Schedule a new event' },
        { id: 'contact', label: 'Create New Contact', icon: '👤', description: 'Add a new contact' },
    ];

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isTimerRunning) {
            timerRef.current = setInterval(() => {
                if (timerMode === 'stopwatch') {
                    setTimerTime((prevTime) => prevTime + 1);
                } else {
                    setTimerTime((prevTime) => {
                        if (prevTime <= 1) {
                            setIsTimerRunning(false);
                            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                                new Notification('Timer Complete!', {
                                    body: 'Your focus session is complete!',
                                    icon: '/favicon.ico',
                                });
                            }
                            return 0;
                        }
                        return prevTime - 1;
                    });
                }
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimerRunning, timerMode]);

    useEffect(() => {
        if (!headerSearch.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setSearching(true);
                const q = headerSearch.toLowerCase();
                const [tasksRes, eventsRes, contactsRes] = await Promise.all([
                    fetch('/api/tasks'),
                    fetch('/api/events'),
                    fetch('/api/contacts'),
                ]);

                const [tasks, events, contacts] = await Promise.all([
                    tasksRes.ok ? tasksRes.json() : [],
                    eventsRes.ok ? eventsRes.json() : [],
                    contactsRes.ok ? contactsRes.json() : [],
                ]);

                const merged = [
                    ...(Array.isArray(tasks) ? tasks : []).map((t) => ({
                        type: 'Task',
                        title: t.title || 'Untitled task',
                        subtitle: t.status || '',
                        href: '/task/task',
                    })),
                    ...(Array.isArray(events) ? events : []).map((e) => ({
                        type: 'Event',
                        title: e.title || 'Untitled event',
                        subtitle: e.start ? new Date(e.start).toLocaleString() : '',
                        href: '/calendar/calendar',
                    })),
                    ...(Array.isArray(contacts) ? contacts : []).map((c) => ({
                        type: 'Contact',
                        title: c.name || 'Unnamed contact',
                        subtitle: c.email || c.phone || '',
                        href: '/contact/contact',
                    })),
                ].filter((item) =>
                    `${item.title} ${item.subtitle} ${item.type}`.toLowerCase().includes(q)
                );

                setSearchResults(merged.slice(0, 8));
                setShowSearchResults(true);
            } finally {
                setSearching(false);
            }
        }, 250);

        return () => clearTimeout(timeout);
    }, [headerSearch]);

    const toggleTimer = () => setIsTimerRunning(!isTimerRunning);

    const resetTimer = () => {
        setIsTimerRunning(false);
        setTimerTime(timerMode === 'stopwatch' ? 0 : 25 * 60);
    };

    const switchToCountdown = () => {
        setIsTimerRunning(false);
        setTimerMode('countdown');
        setTimerTime(25 * 60);
    };

    const switchToStopwatch = () => {
        setIsTimerRunning(false);
        setTimerMode('stopwatch');
        setTimerTime(0);
    };

    const saveSession = () => {
        if (timerTime > 0 && currentSessionName.trim()) {
            const newSession = {
                id: Date.now(),
                name: currentSessionName,
                duration: timerTime,
                date: new Date().toISOString(),
                mode: timerMode,
            };
            setSessions((prev) => [newSession, ...prev.slice(0, 9)]);
            setCurrentSessionName('');
            resetTimer();
        }
    };

    const requestNotificationPermission = () => {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };

    const notificationPermission = typeof window !== 'undefined' && 'Notification' in window
        ? Notification.permission
        : 'default';

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
        <>
            <header
                className={`fixed top-0 z-50 flex h-16 items-center justify-between border-b border-[var(--border-subtle)] bg-white/90 px-6 backdrop-blur-md transition-[left,width] duration-300 supports-[backdrop-filter]:bg-white/75 ${sidebarOpen ? 'left-64 w-[calc(100%-16rem)]' : 'left-20 w-[calc(100%-5rem)]'}`}
            >
                <div className="relative max-w-md flex-1" ref={dropdownRef}>
                    <input
                        type="search"
                        placeholder="Search tasks, events, contacts..."
                        value={headerSearch}
                        onFocus={() => setShowSearchResults(Boolean(headerSearch.trim()))}
                        onChange={(e) => setHeaderSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2 pl-10 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-[#2A59D1]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A59D1]/20"
                    />
                    <SearchIcon sx={{ fontSize: 18 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    {showSearchResults && (
                        <div className="absolute left-0 right-0 top-full mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                            {searching ? (
                                <div className="px-3 py-2 text-sm text-slate-500">Searching…</div>
                            ) : searchResults.length ? (
                                searchResults.map((item, idx) => (
                                    <button
                                        key={`${item.type}-${idx}`}
                                        onClick={() => {
                                            setShowSearchResults(false);
                                            setHeaderSearch('');
                                            router.push(item.href);
                                        }}
                                        className="flex w-full items-start justify-between rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                                    >
                                        <div>
                                            <div className="text-sm font-medium text-slate-800">{item.title}</div>
                                            <div className="text-xs text-slate-500">{item.subtitle}</div>
                                        </div>
                                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{item.type}</span>
                                    </button>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-sm text-slate-500">No matching results</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="ml-8 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Button variant="primary" onClick={toggleTimer} className="flex items-center gap-2">
                                {isTimerRunning ? <Pause className="h-3 w-3" /> : <PlayArrow className="h-3 w-3" />}
                                {formatTime(timerTime)}
                            </Button>
                            <div className="absolute -right-1 -top-1 rounded-full bg-orange-500 px-1 text-xs text-white">
                                {timerMode === 'countdown' ? '25m' : 'SW'}
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            {timerTime > 0 && (
                                <Button variant="outline" onClick={resetTimer} className="px-2 py-1 text-xs">
                                    Reset
                                </Button>
                            )}
                            <div className="flex overflow-hidden rounded-md border border-gray-300">
                                <button onClick={switchToStopwatch} className={`px-2 py-1 text-xs ${timerMode === 'stopwatch' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}>SW</button>
                                <button onClick={switchToCountdown} className={`px-2 py-1 text-xs ${timerMode === 'countdown' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}>25m</button>
                            </div>
                            {sessions.length > 0 && (
                                <Button variant="outline" onClick={() => setShowTimerModal(true)} className="px-2 py-1 text-xs">📊</Button>
                            )}
                        </div>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <Button variant="primary" onClick={() => setIsOpen(!isOpen)}>
                            Create new <Add />
                        </Button>
                        {isOpen && (
                            <div className="absolute right-0 top-full z-[99999] mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
                                <div className="border-b border-gray-200 p-3">
                                    <input
                                        type="text"
                                        placeholder="Search options..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        autoFocus
                                    />
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {filteredOptions.length > 0 ? filteredOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                setIsOpen(false);
                                                setSearchTerm('');
                                                if (onOpenModal) onOpenModal(option.id);
                                            }}
                                            className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-gray-50"
                                        >
                                            <span className="text-xl">{option.icon}</span>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{option.label}</div>
                                                <div className="text-sm text-gray-500">{option.description}</div>
                                            </div>
                                        </button>
                                    )) : (
                                        <div className="p-3 text-center text-gray-500">No options found for &quot;{searchTerm}&quot;</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-[#2A59D1] text-white shadow-sm transition hover:bg-[#002D9F]" role="button" tabIndex={0} aria-label="Notifications">
                        <Notifications sx={{ fontSize: 22 }} />
                    </div>
                </div>
            </header>

            {showTimerModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50">
                    <div className="max-h-[80vh] w-96 overflow-y-auto rounded-lg bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Timer Sessions</h3>
                            <button onClick={() => setShowTimerModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        {timerTime > 0 && (
                            <div className="mb-4 rounded-lg bg-gray-50 p-3">
                                <h4 className="mb-2 text-sm font-medium">Save Current Session</h4>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Session name..." value={currentSessionName} onChange={(e) => setCurrentSessionName(e.target.value)} className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm" />
                                    <button onClick={saveSession} disabled={!currentSessionName.trim()} className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white disabled:bg-gray-300">Save</button>
                                </div>
                                <div className="mt-1 text-xs text-gray-500">Current: {formatSessionTime(timerTime)} ({timerMode === 'countdown' ? 'Countdown' : 'Stopwatch'})</div>
                            </div>
                        )}

                        <div>
                            <h4 className="mb-2 text-sm font-medium">Recent Sessions</h4>
                            {sessions.length > 0 ? (
                                <div className="space-y-2">
                                    {sessions.map((session) => (
                                        <div key={session.id} className="flex items-center justify-between rounded bg-gray-50 p-2">
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{session.name}</div>
                                                <div className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()} • {formatSessionTime(session.duration)}</div>
                                            </div>
                                            <span className={`rounded px-2 py-1 text-xs ${session.mode === 'countdown' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>{session.mode === 'countdown' ? '25m' : 'SW'}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <div className="py-4 text-center text-gray-500">No sessions saved yet</div>}
                        </div>

                        <div className="mt-4 rounded-lg bg-yellow-50 p-3">
                            <div className="text-sm text-yellow-800"><strong>Notifications:</strong> {notificationPermission === 'granted' ? 'Enabled' : 'Disabled'}</div>
                            {notificationPermission !== 'granted' && (
                                <button onClick={requestNotificationPermission} className="mt-2 rounded bg-yellow-500 px-3 py-1 text-xs text-white">Enable Notifications</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

