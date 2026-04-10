import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Select from 'react-select';
import toast from 'react-hot-toast';

export default function CreateEventModal({ open, onClose, onSubmit, contacts = [], initialFormData = {}, loading = false }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start: '',
        end: '',
        allDay: false,
        location: '',
        attendees: [],
        notes: ''
    });

    useEffect(() => {
        if (open) {
            if (initialFormData && Object.keys(initialFormData).length > 0) {
                // Edit mode - populate with existing data
                const startDate = initialFormData.start ? new Date(initialFormData.start) : new Date();
                const endDate = initialFormData.end ? new Date(initialFormData.end) : null;

                const formatDateForInput = (date, isAllDay) => {
                    if (!date) return '';
                    if (isAllDay) {
                        return date.toISOString().slice(0, 10);
                    }
                    return date.toISOString().slice(0, 16);
                };

                setFormData({
                    title: initialFormData.title || '',
                    description: initialFormData.description || '',
                    start: formatDateForInput(startDate, initialFormData.allDay),
                    end: formatDateForInput(endDate, initialFormData.allDay),
                    allDay: initialFormData.allDay || false,
                    location: initialFormData.location || '',
                    attendees: initialFormData.attendees || [],
                    notes: initialFormData.notes || ''
                });
            } else {
                // Create mode - reset form
                setFormData({
                    title: '',
                    description: '',
                    start: '',
                    end: '',
                    allDay: false,
                    location: '',
                    attendees: [],
                    notes: ''
                });
            }
        }
    }, [open]); // Only depend on open state to avoid form resets while typing

    // Separate effect to handle initialFormData when modal opens
    useEffect(() => {
        if (open && initialFormData && Object.keys(initialFormData).length > 0) {
            const startDate = initialFormData.start ? new Date(initialFormData.start) : new Date();
            const endDate = initialFormData.end ? new Date(initialFormData.end) : null;

            const formatDateForInput = (date, isAllDay) => {
                if (!date) return '';
                if (isAllDay) {
                    return date.toISOString().slice(0, 10);
                }
                return date.toISOString().slice(0, 16);
            };

            setFormData({
                title: initialFormData.title || '',
                description: initialFormData.description || '',
                start: formatDateForInput(startDate, initialFormData.allDay),
                end: formatDateForInput(endDate, initialFormData.allDay),
                allDay: initialFormData.allDay || false,
                location: initialFormData.location || '',
                attendees: initialFormData.attendees || [],
                notes: initialFormData.notes || ''
            });
        }
    }, [open, initialFormData._id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'allDay') {
            setFormData(prev => ({
                ...prev,
                allDay: checked,
                // When switching to all-day, convert datetime to date
                start: prev.start ? (checked ? prev.start.slice(0, 10) : prev.start + 'T09:00') : prev.start,
                end: prev.end ? (checked ? prev.end.slice(0, 10) : prev.end + 'T10:00') : prev.end
            }));
        } else if (name === 'start' && !formData.allDay && !formData.end) {
            // Auto-set end time to 1 hour after start time for new events
            const startDate = new Date(value);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
            setFormData(prev => ({
                ...prev,
                [name]: value,
                end: endDate.toISOString().slice(0, 16)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleSelectChange = (selectedOptions) => {
        const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData(prev => ({ ...prev, attendees: selectedIds }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (!formData.start) {
            toast.error('Start date is required');
            return;
        }

        // If end date is provided, ensure it's after start date
        if (formData.end && new Date(formData.end) <= new Date(formData.start)) {
            toast.error('End date must be after start date');
            return;
        }

        // For all-day events, if no end date is provided, set it to the same day
        if (formData.allDay && !formData.end) {
            const startDate = new Date(formData.start);
            startDate.setHours(23, 59, 59, 999);
            formData.end = startDate.toISOString().slice(0, 16);
        }

        onSubmit(formData);
    };

    const contactOptions = contacts.map(contact => ({
        value: contact._id,
        label: contact.name
    }));

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={initialFormData && Object.keys(initialFormData).length > 0 ? "Edit Event" : "Create New Event"}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        name="title"
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex items-center mb-4">
                    <input
                        name="allDay"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={formData.allDay}
                        onChange={handleChange}
                    />
                    <label htmlFor="allDay" className="ml-2 block text-sm text-gray-900">
                        All day
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        name="start"
                        type={formData.allDay ? "date" : "datetime-local"}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={formData.start}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                        name="end"
                        type={formData.allDay ? "date" : "datetime-local"}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={formData.end}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        name="location"
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Attendees</label>
                    <Select
                        isMulti
                        name="attendees"
                        options={contactOptions}
                        className="mt-1"
                        classNamePrefix="select"
                        onChange={handleSelectChange}
                        value={contactOptions.filter(option => formData.attendees.includes(option.value))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                        name="notes"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={formData.notes}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className={`mr-3 px-4 py-2 rounded-md ${loading
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 text-white rounded-md ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#2A59D1] hover:bg-[#1c409b]'
                            }`}
                    >
                        {loading ? 'Saving...' : (initialFormData && Object.keys(initialFormData).length > 0 ? "Update" : "Create")}
                    </button>
                </div>
            </form>
        </Modal>
    );
} 