# 🔑 Groq API Key Setup Guide

## Quick Setup (3 Steps)

### Step 1: Get Your API Key
1. Go to [https://console.groq.com/](https://console.groq.com/)
2. Sign up or log in
3. Click "API Keys" in the sidebar
4. Click "Create API Key"
5. Copy the key (starts with `gsk_`)

### Step 2: Create Environment File
```bash
# In your project folder, run:
cp env.example .env
```

### Step 3: Add Your API Key
Open the `.env` file and replace the placeholder:
```env
GROQ_API_KEY=gsk_your_actual_api_key_here
```

**Replace `gsk_your_actual_api_key_here` with your actual API key**

### Step 4: Restart the Application
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ Verification

After setup, you should see this message in the console:
```
✅ Groq API client initialized successfully
```

## 🚨 If You See This Message:
```
⚠️  GROQ_API_KEY not found in environment variables. Using mock responses.
```

**Solution**: Check that your `.env` file exists and contains the correct API key.

## 📁 File Structure
```
mutton_mitra/
├── .env                    ← Add your API key here
├── env.example            ← Template file
├── server.js              ← Backend with Groq integration
├── src/                   ← React frontend
└── package.json           ← Dependencies
```

## 🔧 Alternative Setup Methods

### Method 1: Direct Environment Variable (Windows)
```powershell
$env:GROQ_API_KEY="gsk_your_actual_api_key_here"
npm run dev
```

### Method 2: Direct Environment Variable (Command Prompt)
```cmd
set GROQ_API_KEY=gsk_your_actual_api_key_here
npm run dev
```

## 🎯 What Happens Next

1. **With API Key**: Your app will use real Groq AI responses
2. **Without API Key**: Your app will use intelligent mock responses
3. **Both work perfectly** - the app is fully functional either way!

## 🚀 Your Application is Ready!

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📞 Need Help?

1. Check the console for error messages
2. Verify your API key at https://console.groq.com/
3. Ensure the `.env` file is in the root directory
4. Restart the application after making changes

**Your Grok AI-style Bhagavad Gita assistant is now ready to use! 🕉️**
