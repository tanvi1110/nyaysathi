import { connectDB } from '@/src/lib/mongodb';
import Event from '@/src/lib/models/Event';
import { devStore } from '@/src/lib/devStore';

export default async function handler(req, res) {
    const { id } = req.query;
    try {
        await connectDB();
    } catch (e) {
        const store = devStore();
        if (req.method === 'PUT') {
            const updated = store.update('events', id, req.body || {});
            if (!updated) return res.status(404).json({ message: 'Not found' });
            return res.status(200).json(updated);
        }
        if (req.method === 'DELETE') {
            store.remove('events', id);
            return res.status(204).end();
        }
        return res.status(503).json({ message: 'Database unavailable (dev fallback active)' });
    }
    if (req.method === 'PUT') {
        const event = await Event.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(event);
    }
    if (req.method === 'DELETE') {
        await Event.findByIdAndDelete(id);
        return res.status(204).end();
    }
    res.status(405).end();
} 