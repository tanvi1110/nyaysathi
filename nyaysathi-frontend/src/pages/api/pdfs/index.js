import { connectDB } from '../../../lib/mongodb';
import Pdf from '../../../lib/models/Pdf';
import { devStore } from '@/src/lib/devStore';

export default async function handler(req, res) {
    try {
        await connectDB();
    } catch (e) {
        const store = devStore();
        if (req.method === 'POST') {
            const { filename, data } = req.body || {};
            if (!filename || !data) {
                return res.status(400).json({ error: 'Missing filename or data' });
            }
            store.create('pdfs', { filename, data, contentType: 'application/pdf' });
            return res.status(201).json({ message: 'PDF saved (dev fallback)' });
        }
        if (req.method === 'GET') {
            const pdfs = store.list('pdfs').map((p) => ({ _id: p._id, filename: p.filename, createdAt: p.createdAt }));
            return res.status(200).json(pdfs);
        }
        return res.status(503).json({ error: 'Database unavailable (dev fallback active)' });
    }

    if (req.method === 'POST') {
        const { filename, data } = req.body;
        if (!filename || !data) {
            return res.status(400).json({ error: 'Missing filename or data' });
        }
        const buffer = Buffer.from(data, 'base64');
        const pdf = new Pdf({
            filename,
            data: buffer,
            contentType: 'application/pdf'
        });
        await pdf.save();
        return res.status(201).json({ message: 'PDF saved' });
    }

    if (req.method === 'GET') {
        const pdfs = await Pdf.find({}, 'filename createdAt');
        return res.status(200).json(pdfs);
    }

    res.status(405).end();
} 