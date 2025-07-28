import mongoose from 'mongoose';

const PdfSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    data: { type: Buffer, required: true },
    contentType: { type: String, default: 'application/pdf' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Pdf || mongoose.model('Pdf', PdfSchema); 