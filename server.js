const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize Groq client
let groqClient = null;
try {
    const { Groq } = require('groq');
    if (process.env.GROQ_API_KEY) {
        groqClient = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
        console.log('✅ Groq API client initialized successfully');
    } else {
        console.log('⚠️  GROQ_API_KEY not found in environment variables. Using mock responses.');
    }
} catch (error) {
    console.log('⚠️  Failed to initialize Groq client. Using mock responses.');
    console.error('Groq initialization error:', error.message);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// Mock AI responses based on the original Streamlit app
const gitaResponses = {
    'karma': {
        answer: `The Bhagavad Gita teaches us about Karma Yoga - the path of selfless action. In Chapter 3, Verse 25, Krishna says:

"As the ignorant perform their duties with attachment to results, so the wise should perform their duties without attachment, for the welfare of the world."

This means we should perform our duties without being attached to the fruits of our actions. When we work selflessly, dedicating our actions to the divine, we find inner peace and spiritual growth.

**Practical Application**: In your daily work, try to focus on the quality of your effort rather than the outcome. Dedicate your actions to a higher purpose, whether that's serving others or contributing to something greater than yourself.

**Key Insight**: True freedom comes from performing actions without being bound by their results. This is the essence of Karma Yoga.`,
        context: "Bhagavad Gita Chapter 3 - Karma Yoga teachings",
        confidence: 0.95
    },
    'peace': {
        answer: `The Gita offers profound wisdom about finding inner peace. In Chapter 2, Verse 48, Krishna advises Arjuna:

"Yogastha kuru karmani sangam tyaktva dhananjaya
Siddhy-asiddhyoh samo bhutva samatvam yoga uchyate"

This means: "Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga."

**The Path to Peace**:
1. **Equanimity**: Maintain balance in success and failure
2. **Detachment**: Don't be overly attached to outcomes
3. **Mindfulness**: Stay present in your actions
4. **Surrender**: Trust in the divine plan

**Practical Meditation**: Sit quietly and observe your thoughts without judgment. Like watching clouds pass in the sky, let thoughts come and go. This practice helps cultivate the inner peace that Krishna describes.

**Remember**: True peace comes from within, not from external circumstances.`,
        context: "Bhagavad Gita Chapter 2 - Path to inner peace",
        confidence: 0.95
    },
    'purpose': {
        answer: `The Bhagavad Gita addresses the fundamental question of life's purpose in Chapter 4, Verse 18:

"Karmany akarma yah pasyed akarmani ca karma yah
Sa buddhiman manusyesu sa yuktah krtsna-karma-krt"

This means: "One who sees inaction in action and action in inaction is intelligent among men, and he is in the transcendental position, although engaged in all sorts of activities."

**Understanding Your Purpose**:
1. **Dharma**: Your unique duty and calling in life
2. **Karma**: Actions performed with right intention
3. **Bhakti**: Devotion to your higher purpose
4. **Jnana**: Wisdom that guides your path

**Finding Your Purpose**:
- Listen to your inner voice and intuition
- Serve others selflessly
- Develop your unique talents and gifts
- Align your actions with your values
- Trust the journey of self-discovery

**The Gita's Wisdom**: Your purpose is not separate from who you are. It's the natural expression of your authentic self in service to the world.`,
        context: "Bhagavad Gita Chapter 4 - Life purpose and dharma",
        confidence: 0.95
    },
    'default': {
        answer: `The Bhagavad Gita offers timeless wisdom for all aspects of life. In Chapter 6, Verse 5-6, Krishna teaches:

"One must elevate oneself by one's own mind, not degrade oneself. The mind is the friend of the conditioned soul, and his enemy as well."

**Key Principles**:
1. **Self-Mastery**: Control your mind and senses
2. **Right Action**: Perform duties with proper intention
3. **Devotion**: Surrender to the divine
4. **Knowledge**: Seek wisdom and understanding

**Practical Steps**:
- Practice daily meditation or prayer
- Study spiritual texts regularly
- Serve others selflessly
- Cultivate virtues like patience, compassion, and truthfulness

**Remember**: The Gita is not just a book to read, but a guide to live by. Apply its teachings in your daily life, and you'll experience transformation from within.`,
        context: "Bhagavad Gita general teachings",
        confidence: 0.9
    }
};

// AI API endpoint
app.post('/api/gita-answer', async(req, res) => {
    try {
        const { question, context = [], personalityContext = {} } = req.body;

        // If Groq client is available, use it
        if (groqClient) {
            try {
                // Build comprehensive context prompt
                let contextPrompt = '';

                // Session continuity
                if (context && context.length > 0) {
                    const recentContext = context.slice(-2); // More focused context
                    contextPrompt += 'Recent conversation context:\n';
                    for (const [q, a] of recentContext) {
                        contextPrompt += `User previously asked: ${q.substring(0, 100)}...\n`;
                        contextPrompt += `I responded about: ${a.substring(0, 150)}...\n`;
                    }
                    contextPrompt += '\n';
                }

                // Personality adaptation
                if (personalityContext && Object.keys(personalityContext).length > 0) {
                    contextPrompt += `User's communication style: ${personalityContext.communication_style || 'balanced'}\n`;
                    if (personalityContext.top_interests && personalityContext.top_interests.length > 0) {
                        contextPrompt += `Dominant interests: ${personalityContext.top_interests.map(t => t[0]).join(', ')}\n`;
                    }
                    contextPrompt += `Emotional tendency: ${personalityContext.dominant_emotion || 'neutral'}\n\n`;
                }

                // Advanced prompt engineering based on your Streamlit app
                const prompt = `You are an advanced AI spiritual guide with deep knowledge of the Bhagavad Gita and profound empathy for human spiritual journeys. You have perfect memory of previous conversations and can provide highly personalized guidance.

${contextPrompt}

Current question: ${question}

Please provide a comprehensive, empathetic response that:
1. Directly addresses the question using specific Gita verses (include chapter and verse numbers when possible)
2. Shows awareness of conversation continuity and personal growth
3. Connects ancient wisdom to modern life applications
4. Uses a warm, wise, and personally engaging tone
5. Includes practical spiritual exercises or reflections when appropriate
6. Acknowledges the user's spiritual journey and progress

Format your response with clear sections and use emotive language that resonates with the human heart while maintaining philosophical depth.

Response:`;

                const completion = await groqClient.chat.completions.create({
                    model: "llama3-70b-8192",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.8,
                    max_tokens: 600,
                    top_p: 0.9
                });

                const answer = completion.choices[0].message.content.trim();

                res.json({
                    success: true,
                    data: {
                        answer: answer,
                        context: "Bhagavad Gita wisdom from Groq AI",
                        confidence: 0.95
                    }
                });

            } catch (groqError) {
                console.error('Groq API error:', groqError);
                // Fallback to mock response
                throw new Error('Groq API failed, using fallback');
            }
        } else {
            // Fallback to mock responses if Groq is not available
            setTimeout(() => {
                // Determine response based on question content
                let responseKey = 'default';
                const questionLower = question.toLowerCase();

                if (questionLower.includes('karma') || questionLower.includes('action') || questionLower.includes('work')) {
                    responseKey = 'karma';
                } else if (questionLower.includes('peace') || questionLower.includes('calm') || questionLower.includes('tranquil')) {
                    responseKey = 'peace';
                } else if (questionLower.includes('purpose') || questionLower.includes('meaning') || questionLower.includes('dharma')) {
                    responseKey = 'purpose';
                }

                const response = gitaResponses[responseKey];

                res.json({
                    success: true,
                    data: response
                });
            }, 2000); // 2 second delay to simulate AI processing
        }

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Sentiment analysis endpoint
app.post('/api/sentiment', (req, res) => {
    try {
        const { text } = req.body;

        // Simple sentiment detection
        const positiveWords = ['happy', 'peace', 'joy', 'grateful', 'blessed', 'love', 'hope', 'content'];
        const negativeWords = ['sad', 'angry', 'fear', 'anxious', 'worried', 'stress', 'confused', 'lost'];
        const veryPositiveWords = ['ecstatic', 'blissful', 'enlightened', 'transcendent', 'divine'];
        const veryNegativeWords = ['despair', 'hopeless', 'devastated', 'broken', 'empty'];

        const textLower = text.toLowerCase();

        let score = 0;
        positiveWords.forEach(word => {
            if (textLower.includes(word)) score += 1;
        });
        negativeWords.forEach(word => {
            if (textLower.includes(word)) score -= 1;
        });
        veryPositiveWords.forEach(word => {
            if (textLower.includes(word)) score += 2;
        });
        veryNegativeWords.forEach(word => {
            if (textLower.includes(word)) score -= 2;
        });

        let sentiment = 'neutral';
        if (score >= 2) sentiment = 'very_positive';
        else if (score >= 1) sentiment = 'positive';
        else if (score <= -2) sentiment = 'very_negative';
        else if (score <= -1) sentiment = 'negative';

        res.json({
            success: true,
            sentiment: sentiment,
            score: score
        });

    } catch (error) {
        console.error('Error analyzing sentiment:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Topics extraction endpoint
app.post('/api/topics', (req, res) => {
    try {
        const { text } = req.body;

        const topicKeywords = {
            'karma_yoga': ['karma', 'action', 'duty', 'work', 'selfless', 'service'],
            'bhakti_yoga': ['devotion', 'love', 'god', 'worship', 'surrender', 'faith'],
            'raja_yoga': ['meditation', 'focus', 'concentration', 'mind', 'yoga', 'practice'],
            'jnana_yoga': ['knowledge', 'wisdom', 'understanding', 'truth', 'self-realization'],
            'dharma': ['dharma', 'righteousness', 'moral', 'ethics', 'purpose', 'duty'],
            'peace': ['peace', 'calm', 'tranquil', 'serene', 'stillness', 'quiet'],
            'life_purpose': ['meaning', 'purpose', 'direction', 'calling', 'destiny'],
            'death_mortality': ['death', 'mortality', 'afterlife', 'soul', 'eternal'],
            'relationships': ['relationship', 'family', 'friend', 'love', 'conflict'],
            'suffering': ['pain', 'suffering', 'grief', 'loss', 'sorrow', 'difficulty'],
            'success': ['success', 'achievement', 'goal', 'ambition', 'material'],
            'spirituality': ['spiritual', 'divine', 'sacred', 'holy', 'transcendent']
        };

        const textLower = text.toLowerCase();
        const topics = [];

        Object.entries(topicKeywords).forEach(([topic, keywords]) => {
            const score = keywords.filter(keyword => textLower.includes(keyword)).length;
            if (score > 0) {
                topics.push({ topic, score });
            }
        });

        // Sort by relevance and return top 3
        topics.sort((a, b) => b.score - a.score);
        const topTopics = topics.slice(0, 3).map(t => t.topic);

        res.json({
            success: true,
            topics: topTopics
        });

    } catch (error) {
        console.error('Error extracting topics:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Wisdom points calculation endpoint
app.post('/api/wisdom-points', (req, res) => {
    try {
        const { question, sentiment, topics } = req.body;

        let points = 10; // Base points

        // Bonus for deep topics
        const deepTopics = ['life_purpose', 'death_mortality', 'jnana_yoga', 'spirituality'];
        points += topics.filter(topic => deepTopics.includes(topic)).length * 15;

        // Bonus for question length and complexity
        const wordCount = question.split(' ').length;
        if (wordCount > 20) points += 10;
        if (wordCount > 50) points += 20;

        // Bonus for philosophical questions
        if (question.toLowerCase().includes('why') ||
            question.toLowerCase().includes('how') ||
            question.toLowerCase().includes('what is the meaning') ||
            question.toLowerCase().includes('purpose')) {
            points += 15;
        }

        // Sentiment bonus
        if (sentiment === 'very_positive' || sentiment === 'very_negative') {
            points += 10; // Deep emotions often lead to growth
        }

        res.json({
            success: true,
            points: points
        });

    } catch (error) {
        console.error('Error calculating wisdom points:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Ask Scriptures AI Backend'
    });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

app.listen(PORT, () => {
    console.log(`🕉️ Ask Scriptures AI Backend running on port ${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend available at http://localhost:${PORT}`);
});

module.exports = app;