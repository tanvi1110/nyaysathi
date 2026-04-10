import { connectDB } from '@/src/lib/mongodb';
import Event from '@/src/lib/models/Event';
import { devStore } from '@/src/lib/devStore';

export default async function handler(req, res) {
    try {
        try {
            await connectDB();
        } catch (e) {
            const store = devStore();
            if (req.method === 'GET') {
                const events = store.list('events').sort((a, b) => new Date(a.start) - new Date(b.start));
                return res.status(200).json(events);
            }
            if (req.method === 'POST') {
                const body = req.body || {};
                if (!body.title || !String(body.title).trim()) {
                    return res.status(400).json({ message: 'Title is required' });
                }
                if (!body.start) {
                    return res.status(400).json({ message: 'Start date is required' });
                }
                const payload = {
                    title: String(body.title).trim(),
                    description: body.description,
                    start: body.start,
                    end: body.end || undefined,
                    allDay: Boolean(body.allDay),
                    location: body.location,
                    attendees: Array.isArray(body.attendees) ? body.attendees : [],
                    notes: body.notes,
                };
                const event = store.create('events', payload);
                return res.status(201).json(event);
            }
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(503).json({ message: 'Database unavailable (dev fallback active)' });
        }

        if (req.method === 'GET') {
            const events = await Event.find({}).sort({ start: 1 });
            return res.status(200).json(events);
        }

        if (req.method === 'POST') {
            const body = req.body || {};
            if (!body.title || !String(body.title).trim()) {
                return res.status(400).json({ message: 'Title is required' });
            }
            if (!body.start) {
                return res.status(400).json({ message: 'Start date is required' });
            }
            const start = new Date(body.start);
            if (Number.isNaN(start.getTime())) {
                return res.status(400).json({ message: 'Invalid start date' });
            }

            const payload = {
                title: String(body.title).trim(),
                description: body.description,
                start,
                end: body.end ? new Date(body.end) : undefined,
                allDay: Boolean(body.allDay),
                location: body.location,
                attendees: Array.isArray(body.attendees) ? body.attendees : [],
                notes: body.notes,
            };

            if (payload.end && Number.isNaN(payload.end.getTime())) {
                return res.status(400).json({ message: 'Invalid end date' });
            }

            const event = await Event.create(payload);
            return res.status(201).json(event);
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        console.error('Events API error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
