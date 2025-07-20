import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Summarizer() {
  const [summary, setSummary] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/summarize/`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setSummary(data.summary);
    setFileUrl(data.file_url);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Upload PDF to Summarize</h2>
      <input type="file" accept="application/pdf" onChange={handleUpload} />
      {loading && <p className="text-blue-600 mt-4">Summarizing...</p>}
      {summary && (
        <div className="mt-6">
          <p className="text-lg font-semibold mb-2">Summary:</p>
          <div className="bg-gray-100 p-4 rounded prose max-w-none">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline mt-2 inline-block"
          >
            View Uploaded PDF
          </a>
        </div>
      )}
    </div>
  );
}
