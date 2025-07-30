import { connectDB } from '../../../lib/mongodb';
import Pdf from '../../../lib/models/Pdf';

export default async function handler(req, res) {
    await connectDB();

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