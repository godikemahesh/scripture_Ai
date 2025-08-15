# Deployment Guide - Ask Scriptures AI

This guide covers various deployment options for the Ask Scriptures AI application.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Git repository access
- Basic knowledge of deployment platforms

### Local Development
```bash
# Clone and install
git clone <repository-url>
cd ask-scriptures-ai
npm install

# Start development server (frontend + backend)
npm run dev

# Or start separately
npm start          # Frontend only (port 3000)
npm run server     # Backend only (port 5000)
```

## 🌐 Deployment Options

### 1. Vercel (Recommended for Frontend)

**Pros**: Free tier, automatic deployments, excellent React support
**Cons**: Serverless functions for backend (limited)

#### Frontend Deployment
1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect React settings

2. **Configure Build Settings**
   ```bash
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

3. **Environment Variables**
   ```env
   REACT_APP_API_URL=https://your-backend-url.com
   ```

4. **Deploy**
   - Vercel will automatically deploy on every push
   - Custom domain can be added in settings

#### Backend Deployment (Vercel Functions)
Create `api/gita-answer.js` in your project root:

```javascript
// api/gita-answer.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, context, personalityContext } = req.body;
    
    // Your AI logic here
    const response = {
      answer: "Your AI response here",
      context: "Context information",
      confidence: 0.95
    };

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

### 2. Netlify

**Pros**: Free tier, easy deployment, form handling
**Cons**: Limited backend capabilities

#### Steps
1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository

2. **Build Settings**
   ```bash
   Build command: npm run build
   Publish directory: build
   ```

3. **Environment Variables**
   ```env
   REACT_APP_API_URL=https://your-backend-url.com
   ```

4. **Deploy**
   - Netlify will build and deploy automatically

### 3. Heroku

**Pros**: Full-stack deployment, good free tier
**Cons**: Sleep mode on free tier

#### Steps
1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Configure Buildpacks**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

4. **Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set REACT_APP_API_URL=https://your-app-name.herokuapp.com
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### 4. Railway

**Pros**: Simple deployment, good free tier
**Cons**: Limited customization

#### Steps
1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Configure Service**
   - Railway will auto-detect Node.js
   - Set build command: `npm run build:full`

3. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   ```

4. **Deploy**
   - Railway will automatically deploy

### 5. DigitalOcean App Platform

**Pros**: Scalable, good performance
**Cons**: Paid service

#### Steps
1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your repository

2. **Configure Services**
   - **Frontend Service**:
     - Source: `./`
     - Build Command: `npm run build`
     - Output Directory: `build`
   - **Backend Service**:
     - Source: `./`
     - Run Command: `npm run server`

3. **Environment Variables**
   ```env
   NODE_ENV=production
   REACT_APP_API_URL=https://your-backend-url.com
   ```

### 6. AWS (Advanced)

**Pros**: Highly scalable, full control
**Cons**: Complex setup, costs

#### Frontend (S3 + CloudFront)
1. **Build and Upload**
   ```bash
   npm run build
   aws s3 sync build/ s3://your-bucket-name
   ```

2. **Configure CloudFront**
   - Create distribution pointing to S3 bucket
   - Configure custom domain and SSL

#### Backend (EC2 or Lambda)
1. **EC2 Setup**
   ```bash
   # Install Node.js on EC2
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Deploy application
   git clone <repository>
   npm install
   npm run build
   npm run server
   ```

2. **Lambda Setup**
   - Create Lambda function for API endpoints
   - Configure API Gateway
   - Set up environment variables

## 🔧 Environment Configuration

### Required Environment Variables
```env
# Frontend
REACT_APP_API_URL=https://your-backend-url.com

# Backend
NODE_ENV=production
PORT=5000
```

### Optional Environment Variables
```env
# For production logging
LOG_LEVEL=info

# For database connections (if added later)
DATABASE_URL=your-database-url

# For external AI services
AI_API_KEY=your-ai-service-key
```

## 📱 Mobile Deployment

### Progressive Web App (PWA)
The app is already configured as a PWA. To enhance:

1. **Update manifest.json**
   ```json
   {
     "name": "Ask Scriptures AI",
     "short_name": "Scriptures AI",
     "start_url": "/",
     "display": "standalone",
     "theme_color": "#FF6B6B",
     "background_color": "#000000"
   }
   ```

2. **Add Service Worker**
   - Create `public/sw.js` for offline functionality
   - Register in `src/index.js`

### React Native (Future)
For mobile app deployment:
1. Use React Native Web
2. Or create separate React Native app
3. Share business logic between platforms

## 🔒 Security Considerations

### Frontend Security
- All sensitive data stored locally
- No API keys exposed in frontend
- HTTPS required for production

### Backend Security
- Input validation on all endpoints
- Rate limiting for API calls
- CORS configuration
- Environment variable protection

### Data Privacy
- User data stored locally only
- No external tracking
- GDPR compliant by design

## 📊 Monitoring and Analytics

### Frontend Monitoring
```javascript
// Add error boundary
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({error}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

// Wrap your app
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <App />
</ErrorBoundary>
```

### Backend Monitoring
```javascript
// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Add error tracking
app.use((err, req, res, next) => {
  console.error('Error:', err);
  // Send to error tracking service
  res.status(500).json({ error: 'Internal server error' });
});
```

## 🚀 Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Bundle analysis with `npm run build --analyze`
- Service worker for caching

### Backend
- Response caching
- Database optimization (if added)
- Load balancing for high traffic

## 🔄 Continuous Deployment

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to platform
      # Add your deployment steps here
```

## 📞 Support and Troubleshooting

### Common Issues
1. **Build Failures**: Check Node.js version and dependencies
2. **API Errors**: Verify backend URL and CORS settings
3. **Performance Issues**: Optimize bundle size and images

### Getting Help
- Check the README.md for setup instructions
- Review error logs in browser console
- Test API endpoints with Postman
- Check deployment platform logs

---

**🕉️ May your deployment journey be smooth and your application serve many seekers of wisdom.**
