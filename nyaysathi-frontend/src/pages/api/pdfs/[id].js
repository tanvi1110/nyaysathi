import { connectDB } from '../../../lib/mongodb';
import Pdf from '../../../lib/models/Pdf';
import { devStore } from '@/src/lib/devStore';

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    await connectDB();
  } catch (e) {
    const store = devStore();
    const pdf = store.find('pdfs', (p) => String(p._id) === String(id));
    if (!pdf) return res.status(404).json({ error: 'Not found' });
    // fallback stores base64 string
    const buffer = Buffer.from(pdf.data, 'base64');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdf.filename}"`);
    res.setHeader('Content-Length', buffer.length);
    return res.send(buffer);
  }

  const pdf = await Pdf.findById(id);
  if (!pdf) return res.status(404).json({ error: 'Not found' });

  // Set proper headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${pdf.filename}"`);
  res.setHeader('Content-Length', pdf.data.length);

  // Send the PDF buffer
  res.send(pdf.data);
} 