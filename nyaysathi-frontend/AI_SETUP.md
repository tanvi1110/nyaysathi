# AI Setup Guide for NyaySathi Language Translation

This guide explains how to set up free AI models for enhanced legal translation features.

## 🆓 Free AI Options Available

### 1. **Ollama (Local AI - Completely Free)**

- **Cost**: $0 (runs locally on your computer)
- **Privacy**: 100% private (no data sent to external servers)
- **Setup**: Requires installation of Ollama

### 2. **HuggingFace (Free Tier)**

- **Cost**: $0 (free tier with API key)
- **Privacy**: Data sent to HuggingFace servers
- **Setup**: Requires free API key

### 3. **Enhanced Manual System (Fallback)**

- **Cost**: $0 (no external dependencies)
- **Privacy**: 100% private
- **Setup**: Works immediately

---

## 🚀 Setup Instructions

### Option 1: Ollama (Recommended for Privacy)

#### Step 1: Install Ollama

```bash
# Windows (WSL2)
curl -fsSL https://ollama.ai/install.sh | sh

# macOS
curl -fsSL https://ollama.ai/install.sh | sh

# Linux
curl -fsSL https://ollama.ai/install.sh | sh
```

#### Step 2: Download Legal Model

```bash
# Download a legal-specialized model
ollama pull llama2:7b

# Or use a smaller model for faster processing
ollama pull llama2:7b-chat
```

#### Step 3: Enable Ollama in Code

Edit `src/pages/api/ai-legal-explain.js`:

```javascript
const AI_MODELS = {
  ollama: {
    model: "llama2:7b",
    baseUrl: "http://localhost:11434",
    available: true, // Change this to true
  },
  // ... other options
};
```

#### Step 4: Start Ollama Service

```bash
ollama serve
```

### Option 2: HuggingFace (Free API)

#### Step 1: Get Free API Key

1. Go to [HuggingFace](https://huggingface.co/)
2. Create free account
3. Go to Settings → Access Tokens
4. Create new token

#### Step 2: Add Environment Variable

Create `.env.local` file:

```env
HUGGINGFACE_API_KEY=your_api_key_here
```

#### Step 3: Enable HuggingFace in Code

The system will automatically detect your API key and use HuggingFace.

### Option 3: Enhanced Manual (No Setup Required)

- Works immediately
- No API keys needed
- Enhanced legal term dictionary
- Privacy-focused

---

## 🧪 Testing Your AI Setup

### Test Ollama

```bash
# Test if Ollama is running
curl http://localhost:11434/api/tags

# Test with a simple prompt
ollama run llama2:7b "Translate 'contract' to Hindi"
```

### Test HuggingFace

```bash
# Test API key
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium
```

---

## 📊 Performance Comparison

| Feature     | Ollama       | HuggingFace    | Manual       |
| ----------- | ------------ | -------------- | ------------ |
| **Speed**   | Fast (local) | Medium (API)   | Instant      |
| **Privacy** | 100% Private | API dependent  | 100% Private |
| **Cost**    | $0           | $0 (free tier) | $0           |
| **Setup**   | Medium       | Easy           | None         |
| **Quality** | High         | High           | Good         |
| **Offline** | Yes          | No             | Yes          |

---

## 🔧 Troubleshooting

### Ollama Issues

```bash
# Check if Ollama is running
ps aux | grep ollama

# Restart Ollama
pkill ollama
ollama serve

# Check model availability
ollama list
```

### HuggingFace Issues

```bash
# Test API key validity
curl -H "Authorization: Bearer YOUR_KEY" \
     https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium
```

### General Issues

1. **Check console logs** for error messages
2. **Verify environment variables** are set correctly
3. **Restart development server** after changes
4. **Check network connectivity** for API calls

---

## 🎯 Recommended Setup

### For Development:

- Start with **Enhanced Manual** (works immediately)
- Add **HuggingFace** for better AI capabilities
- Consider **Ollama** for production/privacy

### For Production:

- Use **Ollama** for privacy and reliability
- Keep **Enhanced Manual** as fallback
- Monitor API usage if using HuggingFace

---

## 📝 Environment Variables

Create `.env.local` file:

```env
# HuggingFace (optional)
HUGGINGFACE_API_KEY=your_api_key_here

# NextAuth (if using)
NEXTAUTH_URL=http://localhost:3000
```

---

## 🚀 Next Steps

1. **Install dependencies**: `npm install`
2. **Choose your AI option** from above
3. **Test the system** with legal text
4. **Monitor performance** and adjust as needed

The system will automatically fall back to the enhanced manual system if AI models are unavailable, ensuring it always works!
