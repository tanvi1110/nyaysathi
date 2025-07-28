import React, { useState, useEffect } from 'react';
import { CancelRounded } from '@mui/icons-material';

export default function CreateTaskModal({ open, onClose, onSubmit, contacts = [], initialFormData = {} }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Normal',
        status: 'Pending',
        assignedTo: '',
        assignedBy: '',
        ...initialFormData
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
        setFormData({
            title: '',
            description: '',
            priority: 'Normal',
            status: 'Pending',
            assignedTo: '',
            assignedBy: '',
            ...initialFormData
        });
    }, [open, initialFormData]);

    if (!open) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[9999] overflow-y-auto p-4 pt-16">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create New Task</h2>
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
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows={3}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assigned By</label>
                        <div className="flex items-center gap-2">
                            <select
                                name="assignedBy"
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                value={formData.assignedBy}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select contact</option>
                                {contacts.map(c => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                        <div className="flex items-center gap-2">
                            <select
                                name="assignedTo"
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                value={formData.assignedTo}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select contact</option>
                                {contacts.map(c => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                <option>High</option>
                                <option>Normal</option>
                                <option>Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                <option>Pending</option>
                                <option>Completed</option>
                            </select>
                        </div>
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