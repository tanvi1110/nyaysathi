import toast from 'react-hot-toast';

export const getTasks = async () => {
    try {
        const response = await fetch('/api/tasks')
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json()
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}

export const createTask = async (taskData) => {
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json()
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
}

export const updateTask = async (id, updatedData) => {
    const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return await response.json();
};

export const deleteTask = async (id) => {
    const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return true;
};

export const resetTaskCollection = async () => {
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resetCollection: true })
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json()
    } catch (error) {
        console.error('Error resetting collection:', error);
        throw error;
    }
}

export const getContacts = async () => {
    const res = await fetch('/api/contacts')
    return await res.json(res)
}

export const createContact = async (data) => {
    try {
        const res = await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Error creating contact:', error);
        throw error;
    }
};
