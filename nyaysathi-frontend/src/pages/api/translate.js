export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { q: sourceText, source, target } = req.body;

        // Google Translate API (free tier: 500,000 characters/month)
        const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

        if (!GOOGLE_TRANSLATE_API_KEY) {
            // Fallback to a free alternative: MyMemory Translation API
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${source}|${target}`);

            if (!response.ok) {
                throw new Error('Translation service unavailable');
            }

            const data = await response.json();

            if (data.responseStatus === 200) {
                return res.status(200).json({
                    translatedText: data.responseData.translatedText,
                    confidence: 85,
                    detectedLanguage: {
                        confidence: 85,
                        language: source
                    }
                });
            } else {
                throw new Error(data.responseDetails || 'Translation failed');
            }
        } else {
            // Use Google Translate API if key is available
            const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: sourceText,
                    source: source,
                    target: target,
                    format: 'text'
                })
            });

            if (!response.ok) {
                throw new Error('Google Translate API error');
            }

            const data = await response.json();

            return res.status(200).json({
                translatedText: data.data.translations[0].translatedText,
                confidence: 95,
                detectedLanguage: {
                    confidence: 95,
                    language: data.data.translations[0].detectedSourceLanguage || source
                }
            });
        }

    } catch (err) {
        console.error('Translation error:', err);
        return res.status(500).json({
            error: 'Translation failed',
            details: err.message,
            suggestion: 'Please check your internet connection and try again.'
        });
    }
}
