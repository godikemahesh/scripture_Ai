<<<<<<< HEAD
# Ask Scriptures AI - Advanced Spiritual Intelligence

A modern React-based web application that provides personalized spiritual guidance based on the Bhagavad Gita, featuring advanced AI capabilities, memory systems, and interactive chat interfaces.

## 🌟 Features

### Core Features
- **Advanced AI Chat Interface** - Intelligent responses based on Bhagavad Gita teachings
- **Memory System** - Remembers user conversations and builds personalized understanding
- **Achievement System** - Gamified spiritual progress tracking
- **Personality Adaptation** - Tailors responses to user's spiritual style and preferences
- **Breakthrough Detection** - Recognizes moments of spiritual insight
- **Contextual Wisdom** - Connects conversations across sessions

### Technical Features
- **Modern React Architecture** - Built with React 18, hooks, and context API
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations** - Powered by Framer Motion
- **Real-time Chat** - Live message updates with typing indicators
- **Local Storage** - Persistent user data and conversation history
- **Markdown Support** - Rich text formatting for AI responses

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Groq API key (optional - for enhanced AI responses)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ask-scriptures-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Groq API (Optional but Recommended)**
   
   For enhanced AI responses using the Groq API:
   
   a. Get your API key from [Groq Console](https://console.groq.com/)
   b. Create a `.env` file in the root directory:
   ```bash
   cp env.example .env
   ```
   c. Add your Groq API key to the `.env` file:
   ```
   GROQ_API_KEY=your_actual_groq_api_key_here
   ```
   
   **Note**: If no Groq API key is provided, the application will use intelligent mock responses.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   This will start both the React frontend (port 3000) and the Express backend (port 5000).

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.js       # Application header
│   ├── Sidebar.js      # Navigation sidebar
│   ├── ChatInterface.js # Main chat interface
│   ├── ChatMessage.js  # Individual message component
│   ├── ChatInput.js    # Message input component
│   ├── WelcomeScreen.js # Landing page
│   ├── ThinkingIndicator.js # Loading animation
│   └── AchievementPopup.js # Achievement notifications
├── contexts/           # React context providers
│   ├── ChatContext.js  # Chat state management
│   └── UserContext.js  # User profile management
├── utils/              # Utility functions
│   ├── aiService.js    # AI service integration
│   └── achievements.js # Achievement system
├── App.js              # Main application component
├── App.css             # Application styles
├── index.js            # Application entry point
└── index.css           # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary**: `#FF6B6B` (Coral Red)
- **Secondary**: `#4ECDC4` (Turquoise)
- **Background**: `#000000` (Black)
- **Surface**: `#0a0a0a` (Dark Gray)
- **Text**: `#ffffff` (White)
- **Muted**: `#888888` (Gray)

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace**: JetBrains Mono (for timestamps and code)

### Animations
- Smooth transitions using Framer Motion
- Loading animations for AI responses
- Achievement popup animations
- Hover effects and micro-interactions

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Groq API Configuration (Optional)
GROQ_API_KEY=your_groq_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000
```

### Customization
- The application automatically uses Groq API if `GROQ_API_KEY` is provided in `.env`
- Modify `server.js` to customize AI response generation
- Update `src/utils/achievements.js` to customize achievement system
- Edit `src/contexts/UserContext.js` to modify user profile structure

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: 1200px+ (Full feature set)
- **Tablet**: 768px - 1199px (Adapted layout)
- **Mobile**: 320px - 767px (Mobile-first design)

## 🧠 AI Integration

The current implementation includes a mock AI service. To integrate with a real AI backend:

1. Update `src/utils/aiService.js`
2. Replace mock responses with actual API calls
3. Implement proper error handling
4. Add authentication if required

### Example AI Service Structure
```javascript
export const aiService = {
  async getGitaAnswer(question, context, personalityContext) {
    // Implement your AI API call here
    const response = await fetch('/api/gita-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context, personalityContext })
    });
    return response.json();
  }
};
```

## 🎯 Achievement System

The application includes a comprehensive achievement system that tracks:
- First questions asked
- Milestone achievements (10, 25, 50, 100 questions)
- Wisdom point milestones
- Topic-specific achievements (Karma Yoga, Bhakti Yoga, etc.)
- Emotional state achievements
- Consistency rewards

## 💾 Data Persistence

User data is stored locally using:
- **localStorage** for chat sessions and user profiles
- **Session storage** for temporary data
- **Context API** for real-time state management

## 🔒 Privacy & Security

- All data is stored locally on the user's device
- No external data transmission (unless AI backend is configured)
- No user tracking or analytics
- GDPR compliant by design

## 🚀 Deployment

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Vercel
1. Import your GitHub repository
2. Vercel will auto-detect React settings
3. Deploy with default settings

### Traditional Hosting
1. Run `npm run build`
2. Upload `build` folder contents to your web server
3. Configure server for SPA routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Bhagavad Gita teachings and wisdom
- React community for excellent documentation
- Framer Motion for smooth animations
- Lucide React for beautiful icons

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the code comments

---

**🕉️ May this application serve as a bridge to deeper spiritual understanding and wisdom.**
=======
# scripture_Ai
>>>>>>> c93cb842066a416d0ce01b1e774e1716ab014ee6
