import { useState, useRef, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/Button';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'mr', label: 'Marathi' },
    { code: 'bn', label: 'Bengali' },
    { code: 'ta', label: 'Tamil' },
    { code: 'te', label: 'Telugu' },
    { code: 'gu', label: 'Gujarati' },
    { code: 'kn', label: 'Kannada' },
    { code: 'ml', label: 'Malayalam' },
    { code: 'pa', label: 'Punjabi' },
    { code: 'ur', label: 'Urdu' },
    { code: 'ar', label: 'Arabic' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'it', label: 'Italian' },
    { code: 'pt', label: 'Portuguese' },
    { code: 'ru', label: 'Russian' },
    { code: 'ja', label: 'Japanese' },
    { code: 'ko', label: 'Korean' },
    { code: 'zh', label: 'Chinese' },
];

// File validation function
const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
    ];

    if (file.size > maxSize) {
        return { valid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
        return { valid: false, error: 'Please upload PDF, DOC, DOCX, or TXT files only' };
    }

    return { valid: true };
};

// Voice recording component
function VoiceRecorder({ onTranscript, isRecording, onStartRecording, onStopRecording, recordingError }) {
    const [isSupported, setIsSupported] = useState(false); // Start with false to avoid hydration mismatch
    const [recordingTime, setRecordingTime] = useState(0);
    const intervalRef = useRef(null);

    // Check browser support
    useEffect(() => {
        // Only check on client side
        if (typeof window !== 'undefined') {
            const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
            setIsSupported(hasSpeechRecognition);
        }
    }, []);

    // Timer effect
    useEffect(() => {
        if (isRecording) {
            intervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                setRecordingTime(0);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRecording]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Show loading state until we determine browser support
    if (typeof window === 'undefined') {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                    <div className="animate-pulse bg-gray-300 h-5 w-5 rounded"></div>
                    <span className="text-sm text-gray-600">Checking voice recording support...</span>
                </div>
            </div>
        );
    }

    if (!isSupported) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-sm text-yellow-800">Voice recording not supported in this browser</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${isRecording
                        ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
                        : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                        }`}
                    onClick={isRecording ? onStopRecording : onStartRecording}
                    disabled={!isSupported}
                >
                    <div className={`w-6 h-6 rounded-full border-2 ${isRecording
                        ? 'border-red-500 bg-red-500 animate-pulse'
                        : 'border-blue-500'
                        }`}>
                        {isRecording && (
                            <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                        )}
                    </div>
                    <span className="text-sm font-medium">
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </span>
                </button>

                {isRecording && (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-red-600 font-mono">{formatTime(recordingTime)}</span>
                    </div>
                )}
            </div>

            {recordingError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-red-800">{recordingError}</span>
                    </div>
                </div>
            )}

            <div className="text-xs text-gray-500">
                Click to start recording. Speak clearly and pause between sentences for better accuracy.
            </div>
        </div>
    );
}

function FileUploadSection({ onFileUpload, fileLoading, fileError, fileName, fileSize }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <label htmlFor="file-upload" className="text-xs text-gray-600 font-medium">
                    Upload Document:
                </label>
                <div className="flex-1">
                    <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        className="text-xs w-full"
                        onChange={onFileUpload}
                        disabled={fileLoading}
                    />
                </div>
            </div>

            {/* File Info Display */}
            {fileName && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900">{fileName}</p>
                            {fileSize && <p className="text-xs text-blue-700">{fileSize}</p>}
                        </div>
                        {fileLoading && (
                            <div className="flex items-center gap-1">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-xs text-blue-600">Processing...</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Error Display */}
            {fileError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-red-800">{fileError}</span>
                    </div>
                </div>
            )}

            {/* File Type Info */}
            <div className="text-xs text-gray-500">
                Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
            </div>
        </div>
    );
}

function TextPreview({ text, fileName }) {
    if (!text || !fileName) return null;

    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const charCount = text.length;

    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-medium text-green-900">Text Extracted Successfully</h3>
            </div>

            <div className="text-xs text-green-700 mb-2">
                <span className="font-medium">{fileName}</span> • {wordCount} words • {charCount} characters
            </div>

            <div className="bg-white border border-green-200 rounded p-3 max-h-32 overflow-y-auto">
                <p className="text-sm text-gray-700 leading-relaxed">
                    {text.length > 300 ? `${text.substring(0, 300)}...` : text}
                </p>
            </div>

            {text.length > 300 && (
                <div className="text-xs text-green-600 mt-2">
                    Showing first 300 characters. Full text loaded for translation.
                </div>
            )}
        </div>
    );
}

function TranslationInput({ value, onChange, inputLang, setInputLang, onFileUpload, onRecord, fileLoading, fileError, fileName, fileSize, onClear, isRecording, onStartRecording, onStopRecording, recordingError }) {
    return (
        <div className="flex flex-col gap-4">
            <label className="font-medium text-sm text-gray-700" htmlFor="source-text">Source Text</label>
            <textarea
                id="source-text"
                className="w-full min-h-[180px] border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                placeholder="Enter or paste your legal draft, note, or summary here... Or upload a document below."
                value={value}
                onChange={e => onChange(e.target.value)}
            />

            {/* Text Preview for uploaded files */}
            <TextPreview text={value} fileName={fileName} />

            <div className="flex gap-2 items-center">
                <label htmlFor="input-lang" className="text-xs text-gray-600 font-medium">Input Language:</label>
                <select
                    id="input-lang"
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-200"
                    value={inputLang}
                    onChange={e => setInputLang(e.target.value)}
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                </select>
            </div>

            {/* Enhanced File Upload Section */}
            <FileUploadSection
                onFileUpload={onFileUpload}
                fileLoading={fileLoading}
                fileError={fileError}
                fileName={fileName}
                fileSize={fileSize}
            />

            {/* Voice Recording Section */}
            <VoiceRecorder
                onTranscript={onRecord}
                isRecording={isRecording}
                onStartRecording={onStartRecording}
                onStopRecording={onStopRecording}
                recordingError={recordingError}
            />

            <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-400">Or upload a document below</span>
                </div>

                {(value || fileName) && (
                    <button
                        type="button"
                        className="flex items-center gap-1 px-2 py-1 rounded bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors text-xs"
                        onClick={onClear}
                        aria-label="Clear all content"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}

function TranslationOutput({ value, targetLang, setTargetLang, mode, setMode, onCopy, onDownload, confidence, alternatives }) {
    return (
        <div className="flex flex-col gap-4">
            <label className="font-medium text-sm text-gray-700" htmlFor="output-text">Translated Output</label>

            {/* Mode Toggle */}
            <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600 font-medium">Translation Mode:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        type="button"
                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${mode === 'normal'
                            ? 'bg-white text-blue-700 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                        onClick={() => setMode('normal')}
                    >
                        Normal
                    </button>
                    <button
                        type="button"
                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${mode === 'legal'
                            ? 'bg-white text-blue-700 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                        onClick={() => setMode('legal')}
                    >
                        Legal Simplified
                    </button>
                </div>

                {mode === 'legal' && (
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-xs text-blue-600 font-medium">AI Enhanced</span>
                    </div>
                )}
            </div>

            <textarea
                id="output-text"
                className="w-full min-h-[180px] border border-gray-300 rounded-lg p-3 text-sm bg-gray-50"
                value={value}
                readOnly
                placeholder={mode === 'legal' ? 'AI will provide simplified legal explanations...' : 'Translated text will appear here...'}
            />

            <div className="flex gap-2 items-center">
                <label htmlFor="target-lang" className="text-xs text-gray-600 font-medium">Target Language:</label>
                <select
                    id="target-lang"
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-200"
                    value={targetLang}
                    onChange={e => setTargetLang(e.target.value)}
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors"
                    onClick={onCopy}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Copy</span>
                </button>
                <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors"
                    onClick={onDownload}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs">Download</span>
                </button>
            </div>

            {/* Confidence Score */}
            {confidence && (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Confidence:</span>
                    <div className="flex items-center gap-1">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all duration-300"
                                style={{ width: confidence }}
                            ></div>
                        </div>
                        <span className="text-xs text-gray-700 font-medium">{confidence}</span>
                    </div>
                </div>
            )}

            {/* Alternative Translations */}
            {alternatives && alternatives.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-700">Alternative Translations:</h4>
                    <div className="space-y-1">
                        {alternatives.map((alt, index) => (
                            <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                                {alt}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ActionPanel({ onTranslate, useAI, setUseAI, sideBySide, setSideBySide, mode }) {
    return (
        <div className="flex flex-col items-center gap-4 my-6">
            <Button
                variant="primary"
                className="px-8 py-3 text-base flex items-center gap-2"
                onClick={onTranslate}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {mode === 'legal' ? 'Translate & Simplify' : 'Translate'}
            </Button>

            <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={useAI}
                        onChange={e => setUseAI(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Use AI to explain legal terms</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={sideBySide}
                        onChange={e => setSideBySide(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Side-by-side view</span>
                </label>
            </div>

            {mode === 'legal' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md">
                    <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Legal Simplified Mode</p>
                            <p className="text-xs">AI will break down complex legal terms and provide simplified explanations in the target language.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function LanguageTranslationPage() {
    const [sourceText, setSourceText] = useState('');
    const [inputLang, setInputLang] = useState('en');
    const [targetLang, setTargetLang] = useState('hi');
    const [outputText, setOutputText] = useState('');
    const [mode, setMode] = useState('normal');
    const [useAI, setUseAI] = useState(false);
    const [sideBySide, setSideBySide] = useState(false);
    const [confidence, setConfidence] = useState('87%');
    const [alternatives, setAlternatives] = useState([
        'वैकल्पिक अनुवाद 1',
        'वैकल्पिक अनुवाद 2',
    ]);
    const [translating, setTranslating] = useState(false);
    const [error, setError] = useState('');
    const [fileLoading, setFileLoading] = useState(false);
    const [fileError, setFileError] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');

    // Voice recording states
    const [isRecording, setIsRecording] = useState(false);
    const [recordingError, setRecordingError] = useState('');
    const recognitionRef = useRef(null);

    // Enhanced file upload handler with better PDF extraction
    const handleFileUpload = async e => {
        setFileError('');
        setFileLoading(true);
        setFileName('');
        setFileSize('');

        const file = e.target.files[0];
        if (!file) {
            setFileLoading(false);
            return;
        }

        const validation = validateFile(file);
        if (!validation.valid) {
            setFileError(validation.error);
            setFileLoading(false);
            return;
        }

        try {
            if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                // Enhanced PDF extraction
                const pdfjsLib = await import('pdfjs-dist/build/pdf');
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

                let extractedText = '';
                const totalPages = pdf.numPages;

                // Extract text from each page with progress tracking
                for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                    try {
                        const page = await pdf.getPage(pageNum);
                        const textContent = await page.getTextContent();

                        // Improved text extraction with better formatting
                        const pageText = textContent.items
                            .map(item => item.str)
                            .join(' ')
                            .replace(/\s+/g, ' ') // Remove extra whitespace
                            .trim();

                        extractedText += pageText + '\n\n';

                        // Update progress for large PDFs
                        if (totalPages > 5) {
                            console.log(`Processed page ${pageNum}/${totalPages}`);
                        }
                    } catch (pageError) {
                        console.warn(`Error processing page ${pageNum}:`, pageError);
                        extractedText += `[Error reading page ${pageNum}]\n\n`;
                    }
                }

                const finalText = extractedText.trim();
                if (!finalText) {
                    throw new Error('No text could be extracted from this PDF. It might be an image-based PDF or password protected.');
                }

                setSourceText(finalText);
                setFileName(file.name);
                setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

            } else if (
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.name.toLowerCase().endsWith('.docx') ||
                file.type === 'application/msword' ||
                file.name.toLowerCase().endsWith('.doc')
            ) {
                // Enhanced DOCX/DOC extraction
                const mammoth = await import('mammoth');
                const arrayBuffer = await file.arrayBuffer();

                const result = await mammoth.extractRawText({ arrayBuffer });

                if (!result.value.trim()) {
                    throw new Error('No text could be extracted from this document.');
                }

                setSourceText(result.value.trim());
                setFileName(file.name);
                setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

            } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
                // TXT extraction
                const text = await file.text();

                if (!text.trim()) {
                    throw new Error('The text file appears to be empty.');
                }

                setSourceText(text.trim());
                setFileName(file.name);
                setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
            }

        } catch (err) {
            console.error('File processing error:', err);
            setFileError(err.message || 'Failed to extract text from file. Please ensure the file is not corrupted or password protected.');
            setSourceText('');
        } finally {
            setFileLoading(false);
        }
    };

    // Voice recording handlers
    const handleStartRecording = () => {
        setRecordingError('');

        try {
            // Initialize speech recognition
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                setRecordingError('Speech recognition is not supported in this browser');
                return;
            }

            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = inputLang === 'en' ? 'en-US' : inputLang;

            let finalTranscript = '';

            recognitionRef.current.onstart = () => {
                setIsRecording(true);
                setRecordingError('');
            };

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                // Update the text area with both final and interim results
                setSourceText(finalTranscript + interimTranscript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setRecordingError(`Recording error: ${event.error}`);
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };

            recognitionRef.current.start();

        } catch (error) {
            console.error('Speech recognition setup error:', error);
            setRecordingError('Failed to start recording. Please check microphone permissions.');
        }
    };

    const handleStopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);
    };

    // Clear all content handler
    const handleClear = () => {
        setSourceText('');
        setFileName('');
        setFileSize('');
        setFileError('');
        setOutputText('');
        setError('');
        setRecordingError('');

        // Stop recording if active
        if (isRecording && recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    // Enhanced translation logic with AI legal explanation mode
    const handleTranslate = async () => {
        if (!sourceText.trim()) {
            setError('Please enter some text to translate.');
            return;
        }

        setTranslating(true);
        setError('');
        setOutputText('');
        setConfidence('');
        setAlternatives([]);

        try {
            if (mode === 'normal') {
                // Normal translation
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        q: sourceText,
                        source: inputLang,
                        target: targetLang,
                        format: 'text',
                    }),
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || 'Translation failed');
                }

                const data = await res.json();
                setOutputText(data.translatedText || '');
                setConfidence(data.confidence ? `${data.confidence}%` : '85%');

                // Generate alternative translations
                const alternatives = generateAlternatives(data.translatedText, targetLang);
                setAlternatives(alternatives);

            } else if (mode === 'legal') {
                // AI-powered legal explanation mode
                const res = await fetch('/api/ai-legal-explain', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: sourceText,
                        sourceLang: inputLang,
                        targetLang: targetLang,
                        mode: useAI ? 'ai_enhanced' : 'basic'
                    }),
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || 'AI legal explanation failed');
                }

                const data = await res.json();
                setOutputText(data.translatedText || '');
                setConfidence(data.confidence || '88%');
                setAlternatives(data.alternatives || []);

                // Show AI method used
                if (data.method) {
                    console.log(`AI Method used: ${data.method}`);
                }
            }
        } catch (err) {
            console.error('Translation error:', err);
            setError('Translation failed. Please try again.');
        }

        setTranslating(false);
    };

    // Generate alternative translations
    const generateAlternatives = (translatedText, targetLang) => {
        const alternatives = [];

        // Simple variations based on target language
        if (targetLang === 'hi') {
            alternatives.push(
                translatedText.replace(/है/g, 'हैं'),
                translatedText.replace(/करता/g, 'करते'),
                translatedText.replace(/देता/g, 'देते')
            );
        } else if (targetLang === 'mr') {
            alternatives.push(
                translatedText.replace(/आहे/g, 'आहोत'),
                translatedText.replace(/करतो/g, 'करतात'),
                translatedText.replace(/देतो/g, 'देतात')
            );
        }

        return alternatives.slice(0, 3).filter(alt => alt !== translatedText);
    };



    const handleCopy = () => {
        navigator.clipboard.writeText(outputText);
    };

    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([outputText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'translation.txt';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Language Translation</h1>
                    <p className="text-gray-600 mb-4">Translate legal drafts, notes, and summaries in multiple Indian languages using AI.</p>
                    <div className="flex gap-4 border-b border-gray-200 pb-2 mb-2">
                        <div className="px-3 py-1 rounded-t bg-gray-100 text-blue-700 font-medium cursor-pointer">Draft</div>
                        <div className="px-3 py-1 rounded-t text-gray-500 cursor-pointer">Notes</div>
                        <div className="px-3 py-1 rounded-t text-gray-500 cursor-pointer">Audio</div>
                        <div className="px-3 py-1 rounded-t text-gray-500 cursor-pointer">Summarize</div>
                    </div>
                </div>
                {/* Main Translation Layout */}
                <div className={`grid ${sideBySide ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-8`}>
                    <TranslationInput
                        value={sourceText}
                        onChange={setSourceText}
                        inputLang={inputLang}
                        setInputLang={setInputLang}
                        onFileUpload={handleFileUpload}
                        onRecord={() => { }} // Placeholder
                        fileLoading={fileLoading}
                        fileError={fileError}
                        fileName={fileName}
                        fileSize={fileSize}
                        onClear={handleClear}
                        isRecording={isRecording}
                        onStartRecording={handleStartRecording}
                        onStopRecording={handleStopRecording}
                        recordingError={recordingError}
                    />
                    <TranslationOutput
                        value={outputText}
                        targetLang={targetLang}
                        setTargetLang={setTargetLang}
                        mode={mode}
                        setMode={setMode}
                        onCopy={handleCopy}
                        onDownload={handleDownload}
                        confidence={confidence}
                        alternatives={alternatives}
                    />
                </div>
                {/* Translation Controls */}
                <ActionPanel
                    onTranslate={handleTranslate}
                    useAI={useAI}
                    setUseAI={setUseAI}
                    sideBySide={sideBySide}
                    setSideBySide={setSideBySide}
                    mode={mode}
                />
                {fileLoading && <div className="text-blue-600 text-sm text-center mt-2">Extracting text from file...</div>}
                {fileError && <div className="text-red-600 text-sm text-center mt-2">{fileError}</div>}
                {error && <div className="text-red-600 text-sm text-center mt-2">{error}</div>}
                {/*
          // === Integration Placeholders ===
          // - LibreTranslate API: see handleTranslate
          // - Whisper (audio-to-text): see handleRecord
          // - Mistral/OpenAI for legal explanation: see handleTranslate (mode === 'explain')
        */}
            </div>
        </Layout>
    );
} 