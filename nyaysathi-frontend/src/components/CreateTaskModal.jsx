import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';

export default function CreateTaskModal({ isOpen, onClose, onSubmit, contacts = [], initialFormData = {} }) {
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
        setFormData({
            title: '',
            description: '',
            priority: 'Normal',
            status: 'Pending',
            assignedTo: '',
            assignedBy: '',
            ...initialFormData
        });
    }, [isOpen, initialFormData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Task"
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
        </Modal>
    );
} 