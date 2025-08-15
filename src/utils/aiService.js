import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// AI service that connects to the backend API
export const aiService = {
    async getGitaAnswer(question, context = [], personalityContext = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/gita-answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    context,
                    personalityContext
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI service');
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'AI service error');
            }

            return {
                answer: data.data.answer,
                context: data.data.context,
                confidence: data.data.confidence
            };
        } catch (error) {
            console.error('Error getting AI response:', error);

            // Fallback to mock responses if API fails
            const mockResponses = {
                'karma': `The Bhagavad Gita teaches us about Karma Yoga - the path of selfless action. In Chapter 3, Verse 25, Krishna says:

"As the ignorant perform their duties with attachment to results, so the wise should perform their duties without attachment, for the welfare of the world."

This means we should perform our duties without being attached to the fruits of our actions. When we work selflessly, dedicating our actions to the divine, we find inner peace and spiritual growth.

**Practical Application**: In your daily work, try to focus on the quality of your effort rather than the outcome. Dedicate your actions to a higher purpose, whether that's serving others or contributing to something greater than yourself.

**Key Insight**: True freedom comes from performing actions without being bound by their results. This is the essence of Karma Yoga.`,

                'peace': `The Gita offers profound wisdom about finding inner peace. In Chapter 2, Verse 48, Krishna advises Arjuna:

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

                'purpose': `The Bhagavad Gita addresses the fundamental question of life's purpose in Chapter 4, Verse 18:

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

                'default': `The Bhagavad Gita offers timeless wisdom for all aspects of life. In Chapter 6, Verse 5-6, Krishna teaches:

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

**Remember**: The Gita is not just a book to read, but a guide to live by. Apply its teachings in your daily life, and you'll experience transformation from within.`
            };

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

            const response = mockResponses[responseKey];

            // Extract context from response
            const context = "Bhagavad Gita teachings and spiritual wisdom";

            return {
                answer: response,
                context: context,
                confidence: 0.95
            };

        } catch (error) {
            console.error('Error getting AI response:', error);
            throw new Error('Failed to get response from AI service');
        }
    },

    async detectSentiment(text) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/sentiment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error('Failed to analyze sentiment');
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Sentiment analysis error');
            }

            return data.sentiment;
        } catch (error) {
            console.error('Error analyzing sentiment:', error);

            // Fallback to simple sentiment detection
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

            if (score >= 2) return 'very_positive';
            if (score >= 1) return 'positive';
            if (score <= -2) return 'very_negative';
            if (score <= -1) return 'negative';
            return 'neutral';
        }
    },

    async extractTopics(text) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/topics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error('Failed to extract topics');
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Topic extraction error');
            }

            return data.topics;
        } catch (error) {
            console.error('Error extracting topics:', error);

            // Fallback to local topic extraction
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
            return topics.slice(0, 3).map(t => t.topic);
        }
    },

    async calculateWisdomPoints(question, sentiment, topics) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/wisdom-points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question, sentiment, topics })
            });

            if (!response.ok) {
                throw new Error('Failed to calculate wisdom points');
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Wisdom points calculation error');
            }

            return data.points;
        } catch (error) {
            console.error('Error calculating wisdom points:', error);

            // Fallback to local calculation
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

            return points;
        }
    }
};