import React, { useState, useEffect } from 'react';
import { CancelRounded } from '@mui/icons-material';
import Select from 'react-select';

export default function CreateEventModal({ open, onClose, onSubmit, contacts = [] }) {
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
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    useEffect(() => {
        if (open) {
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
    }, [open]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSelectChange = (selectedOptions) => {
        const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData(prev => ({ ...prev, attendees: selectedIds }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const contactOptions = contacts.map(contact => ({
        value: contact._id,
        label: contact.name
    }));

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[9999] overflow-y-auto p-4 pt-16">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create New Event</h2>
                    <button
                        className="text-gray-500 hover:text-gray-800"
                        onClick={onClose}
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            name="start"
                            type="datetime-local"
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
                            type="datetime-local"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.end}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center">
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
    );
} 