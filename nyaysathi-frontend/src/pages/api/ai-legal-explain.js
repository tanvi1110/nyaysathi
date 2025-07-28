import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatHuggingFace } from "@langchain/community/chat_models/huggingface";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Free AI Models Configuration
const AI_MODELS = {
    // Option 1: Ollama (Local, Free) - requires Ollama installation
    ollama: {
        model: "llama2:7b",
        baseUrl: "http://localhost:11434",
        available: false // Set to true if Ollama is installed
    },
    // Option 2: HuggingFace (Free tier with API key)
    huggingface: {
        model: "microsoft/DialoGPT-medium",
        apiKey: process.env.HUGGINGFACE_API_KEY,
        available: !!process.env.HUGGINGFACE_API_KEY
    },
    // Option 3: Fallback to enhanced manual system
    manual: {
        available: true
    }
};

// Legal explanation prompt template
const LEGAL_PROMPT_TEMPLATE = `
You are a legal translation expert specializing in Indian legal documents. Your task is to:

1. Translate the given legal text from {sourceLang} to {targetLang}
2. Simplify complex legal terms and provide explanations
3. Make the text accessible to non-legal professionals
4. Maintain accuracy while improving clarity

Source Text: {text}

Please provide:
1. A clear translation
2. Simplified explanations for legal terms
3. Alternative ways to express complex concepts

Target Language: {targetLang}
Source Language: {sourceLang}

Response format:
Translation: [translated text]
Simplified: [simplified version with explanations]
Alternatives: [2-3 alternative expressions]
`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { text, sourceLang, targetLang, mode } = req.body;

        if (!text || !sourceLang || !targetLang) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        let result;

        // Try AI models in order of preference
        if (AI_MODELS.ollama.available) {
            result = await useOllama(text, sourceLang, targetLang, mode);
        } else if (AI_MODELS.huggingface.available) {
            result = await useHuggingFace(text, sourceLang, targetLang, mode);
        } else {
            result = await useEnhancedManual(text, sourceLang, targetLang, mode);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error('AI Legal Explanation Error:', error);
        return res.status(500).json({
            error: 'AI processing failed',
            details: error.message,
            fallback: 'Using enhanced manual system'
        });
    }
}

// Ollama (Local AI Model)
async function useOllama(text, sourceLang, targetLang, mode) {
    try {
        const model = new ChatOllama({
            model: AI_MODELS.ollama.model,
            baseUrl: AI_MODELS.ollama.baseUrl,
        });

        const prompt = PromptTemplate.fromTemplate(LEGAL_PROMPT_TEMPLATE);
        const outputParser = new StringOutputParser();

        const chain = prompt.pipe(model).pipe(outputParser);

        const response = await chain.invoke({
            text,
            sourceLang,
            targetLang,
            mode
        });

        return {
            translatedText: response,
            confidence: 95,
            method: 'ollama',
            alternatives: generateAlternatives(response, targetLang)
        };
    } catch (error) {
        console.error('Ollama error:', error);
        throw new Error('Ollama model not available');
    }
}

// HuggingFace (Free AI Model)
async function useHuggingFace(text, sourceLang, targetLang, mode) {
    try {
        const model = new ChatHuggingFace({
            model: AI_MODELS.huggingface.model,
            apiKey: AI_MODELS.huggingface.apiKey,
        });

        const prompt = PromptTemplate.fromTemplate(LEGAL_PROMPT_TEMPLATE);
        const outputParser = new StringOutputParser();

        const chain = prompt.pipe(model).pipe(outputParser);

        const response = await chain.invoke({
            text,
            sourceLang,
            targetLang,
            mode
        });

        return {
            translatedText: response,
            confidence: 90,
            method: 'huggingface',
            alternatives: generateAlternatives(response, targetLang)
        };
    } catch (error) {
        console.error('HuggingFace error:', error);
        throw new Error('HuggingFace model not available');
    }
}

// Enhanced Manual System (Fallback)
async function useEnhancedManual(text, sourceLang, targetLang, mode) {
    // First, get basic translation
    const translationResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
            format: 'text',
        }),
    });

    if (!translationResponse.ok) {
        throw new Error('Translation failed');
    }

    const translationData = await translationResponse.json();
    let translatedText = translationData.translatedText || text;

    // Enhanced legal term dictionary
    const enhancedLegalTerms = {
        'hi': {
            'अनुबंध': 'अनुबंध (Contract - दो या अधिक पक्षों के बीच कानूनी समझौता)',
            'अदालत': 'अदालत (Court - न्याय प्रदान करने वाला स्थान)',
            'वकील': 'वकील (Lawyer - कानूनी सलाह देने वाला व्यक्ति)',
            'मामला': 'मामला (Case - अदालत में दायर किया गया विवाद)',
            'सबूत': 'सबूत (Evidence - किसी बात को सिद्ध करने वाला प्रमाण)',
            'फैसला': 'फैसला (Verdict - अदालत का निर्णय)',
            'अपील': 'अपील (Appeal - उच्च न्यायालय में पुनर्विचार की मांग)',
            'जमानत': 'जमानत (Bail - अदालत से मिली अस्थायी स्वतंत्रता)',
            'गवाह': 'गवाह (Witness - घटना देखने वाला व्यक्ति)',
            'गवाही': 'गवाही (Testimony - गवाह का बयान)',
            'आरोप': 'आरोप (Charge - किसी के खिलाफ लगाया गया दोष)',
            'दोषी': 'दोषी (Guilty - अपराध करने वाला)',
            'निर्दोष': 'निर्दोष (Innocent - बिना दोष के)',
            'सजा': 'सजा (Punishment - अपराध के लिए दिया गया दंड)',
            'कैद': 'कैद (Imprisonment - जेल में रखना)',
            'जुर्माना': 'जुर्माना (Fine - पैसे का दंड)',
            'माफी': 'माफी (Pardon - सजा माफ करना)',
            'रिहाई': 'रिहाई (Release - जेल से छोड़ना)',
            'हिरासत': 'हिरासत (Custody - पुलिस की देखरेख में रखना)',
            'तलाशी': 'तलाशी (Search - किसी स्थान की जांच)',
            'जब्त': 'जब्त (Seizure - किसी वस्तु को ले लेना)',
            'निषेधाज्ञा': 'निषेधाज्ञा (Injunction - किसी कार्य को रोकने का आदेश)',
            'क्षतिपूर्ति': 'क्षतिपूर्ति (Compensation - नुकसान की भरपाई)',
            'हर्जाना': 'हर्जाना (Damages - नुकसान के लिए पैसा)',
            'ब्याज': 'ब्याज (Interest - देर से भुगतान पर अतिरिक्त राशि)',
            'दस्तावेज': 'दस्तावेज (Document - लिखित प्रमाण)',
            'हस्ताक्षर': 'हस्ताक्षर (Signature - किसी का नाम लिखना)',
            'मुहर': 'मुहर (Stamp - आधिकारिक छाप)',
            'प्रमाणित': 'प्रमाणित (Certified - आधिकारिक रूप से सत्यापित)',
            'कानूनी': 'कानूनी (Legal - कानून के अनुसार)',
            'अवैध': 'अवैध (Illegal - कानून के विरुद्ध)',
            'वैध': 'वैध (Valid - कानूनी रूप से मान्य)',
            'अमान्य': 'अमान्य (Invalid - कानूनी रूप से अमान्य)'
        },
        'mr': {
            'करार': 'करार (Contract - दो किंवा अधिक पक्षांमधील कायदेशीर करार)',
            'कोर्ट': 'कोर्ट (Court - न्याय देणारे ठिकाण)',
            'वकील': 'वकील (Lawyer - कायदेशीर सल्ला देणारा व्यक्ती)',
            'खटला': 'खटला (Case - कोर्टात दाखल केलेला वाद)',
            'पुरावा': 'पुरावा (Evidence - एखादी गोष्ट सिद्ध करणारा पुरावा)',
            'निर्णय': 'निर्णय (Verdict - कोर्टाचा निर्णय)',
            'अपील': 'अपील (Appeal - उच्च न्यायालयात पुनर्विचाराची मागणी)',
            'जामीन': 'जामीन (Bail - कोर्टाकडून मिळालेली तात्पुरती स्वातंत्र्य)',
            'साक्षीदार': 'साक्षीदार (Witness - घटना पाहणारा व्यक्ती)',
            'साक्ष': 'साक्ष (Testimony - साक्षीदाराचे बयान)',
            'आरोप': 'आरोप (Charge - एखाद्यावर लावलेला दोष)',
            'दोषी': 'दोषी (Guilty - गुन्हा करणारा)',
            'निर्दोष': 'निर्दोष (Innocent - दोष नसलेला)',
            'शिक्षा': 'शिक्षा (Punishment - गुन्ह्यासाठी दिलेला दंड)',
            'तुरुंग': 'तुरुंग (Imprisonment - तुरुंगात ठेवणे)',
            'दंड': 'दंड (Fine - पैशाचा दंड)',
            'माफी': 'माफी (Pardon - शिक्षा माफ करणे)',
            'सोडणे': 'सोडणे (Release - तुरुंगातून सोडणे)',
            'हिरासत': 'हिरासत (Custody - पोलीसांच्या देखरेखीत ठेवणे)',
            'शोध': 'शोध (Search - एखाद्या ठिकाणाची तपासणी)',
            'जप्त': 'जप्त (Seizure - एखादी वस्तू घेणे)',
            'निषेध': 'निषेध (Injunction - एखादे काम रोखण्याचा आदेश)',
            'नुकसानभरपाई': 'नुकसानभरपाई (Compensation - नुकसानाची भरपाई)',
            'हर्जाना': 'हर्जाना (Damages - नुकसानासाठी पैसे)',
            'व्याज': 'व्याज (Interest - उशीरा भरण्यासाठी अतिरिक्त रक्कम)',
            'दस्तऐवज': 'दस्तऐवज (Document - लिखित पुरावा)',
            'सही': 'सही (Signature - एखाद्याचे नाव लिहिणे)',
            'शिक्का': 'शिक्का (Stamp - अधिकृत छाप)',
            'प्रमाणित': 'प्रमाणित (Certified - अधिकृतपणे पडताळलेले)',
            'कायदेशीर': 'कायदेशीर (Legal - कायद्यानुसार)',
            'बेकायदेशीर': 'बेकायदेशीर (Illegal - कायद्याविरुद्ध)',
            'वैध': 'वैध (Valid - कायदेशीरपणे मान्य)',
            'अवैध': 'अवैध (Invalid - कायदेशीरपणे अमान्य)'
        }
    };

    // Apply enhanced legal simplifications
    const terms = enhancedLegalTerms[targetLang] || enhancedLegalTerms['hi'];
    let simplifiedText = translatedText;

    Object.entries(terms).forEach(([term, explanation]) => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        simplifiedText = simplifiedText.replace(regex, explanation);
    });

    return {
        translatedText: simplifiedText,
        confidence: 88,
        method: 'enhanced_manual',
        alternatives: generateEnhancedAlternatives(simplifiedText, targetLang)
    };
}

// Generate enhanced alternatives
function generateEnhancedAlternatives(text, targetLang) {
    const alternatives = [];

    if (targetLang === 'hi') {
        alternatives.push(
            'सरल भाषा में: ' + text.replace(/कानूनी/g, 'आसान').replace(/अनुबंध/g, 'समझौता'),
            'व्यावहारिक अर्थ: ' + text.replace(/अदालत/g, 'न्यायालय').replace(/वकील/g, 'कानूनी सलाहकार'),
            'सामान्य भाषा: ' + text.replace(/मामला/g, 'विवाद').replace(/सबूत/g, 'प्रमाण')
        );
    } else if (targetLang === 'mr') {
        alternatives.push(
            'सोप्या भाषेत: ' + text.replace(/कायदेशीर/g, 'सोपे').replace(/करार/g, 'करारनामा'),
            'व्यावहारिक अर्थ: ' + text.replace(/कोर्ट/g, 'न्यायालय').replace(/वकील/g, 'कायदेशीर सल्लागार'),
            'सामान्य भाषा: ' + text.replace(/खटला/g, 'वाद').replace(/पुरावा/g, 'प्रमाण')
        );
    }

    return alternatives.slice(0, 3);
}

// Generate alternatives for AI responses
function generateAlternatives(text, targetLang) {
    // Simple variations for AI-generated text
    const alternatives = [];

    if (targetLang === 'hi') {
        alternatives.push(
            text.replace(/है/g, 'हैं'),
            text.replace(/करता/g, 'करते'),
            text.replace(/देता/g, 'देते')
        );
    } else if (targetLang === 'mr') {
        alternatives.push(
            text.replace(/आहे/g, 'आहोत'),
            text.replace(/करतो/g, 'करतात'),
            text.replace(/देतो/g, 'देतात')
        );
    }

    return alternatives.slice(0, 3).filter(alt => alt !== text);
} 