import { useEffect, useState } from 'react';

export default function PdfList() {
    const [pdfs, setPdfs] = useState([]);

    useEffect(() => {
        fetch('/api/pdfs')
            .then(res => res.json())
            .then(setPdfs);
    }, []);

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
            <h1 className="text-2xl font-bold mb-4">Saved PDFs</h1>
            <ul className="space-y-2">
                {pdfs.map(pdf => (
                    <li key={pdf._id} className="flex items-center justify-between border-b py-2">
                        <span>{pdf.filename} <span className="text-xs text-gray-400">({new Date(pdf.createdAt).toLocaleString()})</span></span>
                        <a href={`/api/pdfs/${pdf._id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Download</a>
                    </li>
                ))}
            </ul>
        </div>
    );
} 