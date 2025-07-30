import { connectDB } from '../../../lib/mongodb';
import Pdf from '../../../lib/models/Pdf';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  const pdf = await Pdf.findById(id);
  if (!pdf) return res.status(404).json({ error: 'Not found' });

  // Set proper headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${pdf.filename}"`);
  res.setHeader('Content-Length', pdf.data.length);

  // Send the PDF buffer
  res.send(pdf.data);
} 