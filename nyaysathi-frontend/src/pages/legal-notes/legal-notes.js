import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from '../../components/ui/Button';
import jsPDF from 'jspdf';

function FilenameModal({ open, onClose, onSave }) {
    const [filename, setFilename] = useState('');
    useEffect(() => { if (open) setFilename(''); }, [open]);
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[9999] overflow-y-auto p-4 pt-16">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Name your PDF</h2>
                    <button className="text-gray-500 hover:text-gray-800" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={e => { e.preventDefault(); onSave(filename); }}>
                    <input
                        type="text"
                        className="block w-full border border-gray-300 rounded-md p-2 mb-4"
                        placeholder="Enter file name"
                        value={filename}
                        onChange={e => setFilename(e.target.value)}
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" type="submit">Save</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function SuccessModal({ open, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center max-w-xs w-full">
                <div className="bg-green-100 rounded-full p-3 mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="text-lg font-semibold mb-2 text-center">PDF saved successfully!</div>
                <Button variant="primary" onClick={onClose} className="mt-2">Close</Button>
            </div>
        </div>
    );
}

function PdfIcon() {
    return (
        <svg className="w-10 h-10 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="3" width="16" height="18" rx="2" fill="#fff" stroke="#ef4444" strokeWidth="1.5" />
            <path d="M8 7h8M8 11h8M8 15h4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export default function LegalNotesPage() {
    const [value, setValue] = useState('');
    const [saving, setSaving] = useState(false);
    const [pdfs, setPdfs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Debug: Check if API key is available
    console.log('TinyMCE API Key available:', !!process.env.NEXT_PUBLIC_TINYMCE_API);
    console.log('TinyMCE API Key length:', process.env.NEXT_PUBLIC_TINYMCE_API?.length || 0);

    useEffect(() => {
        fetch('/api/pdfs')
            .then(res => res.json())
            .then(setPdfs);
    }, [saving, showSuccess]);

    const handleSavePdf = async (filename) => {
        setSaving(true);
        const doc = new jsPDF();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = value;
        const text = tempDiv.innerText || tempDiv.textContent || '';
        const lines = doc.splitTextToSize(text, 180);
        doc.text(lines, 10, 20);
        const pdfBlob = doc.output('blob');
        const arrayBuffer = await pdfBlob.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        await fetch('/api/pdfs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: filename.endsWith('.pdf') ? filename : filename + '.pdf', data: base64 }),
        });
        setSaving(false);
        setShowModal(false);
        setShowSuccess(true);
    };

    const pdfCards = pdfs.filter(pdf => pdf.filename.toLowerCase().endsWith('.pdf'));

    return (
        <Layout>
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 mt-6">
                <h1 className="text-2xl font-bold mb-4">Legal Notes / Drafts</h1>
                <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API || ""}
                    value={value}
                    onEditorChange={setValue}
                    init={{
                        height: 400,
                        menubar: true,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar:
                            'undo redo | formatselect | bold italic underline backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help | image | code',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
                    }}
                />
                <div className="mt-4 flex justify-end">
                    <Button variant="primary" onClick={() => setShowModal(true)} loading={saving}>Save as PDF</Button>
                </div>
                <FilenameModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSavePdf}
                />
                <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
            </div>
            <div className="max-w-5xl mx-auto mt-10">
                <h2 className="text-2xl font-bold mb-4">Saved Legal Notes (PDFs)</h2>
                {pdfCards.length === 0 ? (
                    <div className="text-gray-400 text-sm">No saved legal notes yet.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {pdfCards.map(pdf => (
                            <div key={pdf._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center min-h-[170px]">
                                <PdfIcon />
                                <div className="font-medium text-center text-sm mb-2 break-words w-full">{pdf.filename}</div>
                                <div className="text-xs text-gray-400 mb-3">{new Date(pdf.createdAt).toLocaleString()}</div>
                                <a
                                    href={`/api/pdfs/${pdf._id}`}
                                    download={pdf.filename}
                                    className="w-full text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 bg-[#2A59D1] hover:bg-[#002D9F] text-white"
                                >
                                    Download
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
} 