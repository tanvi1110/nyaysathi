import { connectDB } from '@/src/lib/mongodb';
import Event from '@/src/lib/models/Event';

export default async function handler(req, res) {
    await connectDB();
    const { id } = req.query;
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