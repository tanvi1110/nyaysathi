import { connectDB } from '@/src/lib/mongodb';
import Event from '@/src/lib/models/Event';

export default async function handler(req, res) {
    await connectDB();
    if (req.method === 'GET') {
        const events = await Event.find({});
        return res.status(200).json(events);
    }
    if (req.method === 'POST') {
        const event = await Event.create(req.body);
        return res.status(201).json(event);
    }
    res.status(405).end();
} 