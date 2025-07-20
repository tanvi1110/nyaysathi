import Layout from "@/src/components/layout/Layout";
import { createContact, getContacts } from "@/src/utils/api";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        dob: ""
    })

    useEffect(() => {
        getContacts().then(setContacts);
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            // Check for duplicate email or phone in local contacts
            const duplicate = contacts.find(
                c => c.email === form.email || c.phone === form.phone
            );
            if (duplicate) {
                toast.error('A contact with this email or phone already exists.');
                return;
            }
            console.log('Submitting form:', form); // Log form data
            const newContact = await createContact(form)
            toast.success('Contact added successfully');
            setContacts((prev) => [...prev, newContact])
            setShowModal(false)
            setForm({ name: '', email: '', phone: '', address: '', dob: '' })
        } catch (err) {
            console.error('Error in handleSubmit:', err); // Log error object
            // Try to extract backend error message if available
            let errorMsg = err.message || 'Something went wrong';
            if (err.response) {
                // If error has a response (e.g., from axios), try to get backend message
                errorMsg = err.response.data?.error || errorMsg;
            } else if (err instanceof Error && err.message.startsWith('HTTP error!')) {
                errorMsg = err.message;
            }
            toast.error(errorMsg);
        }

    }


    return (
        <Layout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Contacts</h1>
                    <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md">New Contact</button>
                </div>
                <table className="min-w-full bg-white rounded shadow">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Phone</th>
                            <th className="p-3 text-left">Address</th>
                            <th className="p-3 text-left">Date of Birth</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((c) => (
                            <tr key={c._id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{c.name}</td>
                                <td className="p-3">{c.email}</td>
                                <td className="p-3">{c.phone}</td>
                                <td className="p-3">{c.address}</td>
                                <td className="p-3">{new Date(c.dateOfBirth).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
                            <h2 className="text-xl font-semibold">Add Contact</h2>
                            <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
                            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" />
                            <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" />
                            <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full border p-2 rounded" />
                            <input type="date" name="dob" value={form.dob} onChange={handleChange} className="w-full border p-2 rounded" />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </Layout>

    );
} 