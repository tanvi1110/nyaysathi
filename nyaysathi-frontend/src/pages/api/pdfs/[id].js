import { connectDB } from '../../../lib/mongodb';
import Pdf from '../../../lib/models/Pdf';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  const pdf = await Pdf.findById(id);
  if (!pdf) return res.status(404).json({ error: 'Not found' });

  res.setHeader('Content-Type', pdf.contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${pdf.filename}"`);
  res.send(pdf.data);
} 