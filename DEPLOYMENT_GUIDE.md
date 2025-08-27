# 🚀 Glyph Figma Tool - Deployment Guide

## **Quick Deployment Options**

### **Option 1: Local Development (Recommended for Testing)**
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Start development
npm run dev:server    # Backend (Terminal 1)
npm run dev          # Frontend (Terminal 2)

# Or use quick start
./start-app.bat      # Windows
```

### **Option 2: Production Build**
```bash
# Build for production
npm run build

# Start production server
npm start

# Access at http://localhost:3000
```

### **Option 3: Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t glyph-figma-tool .
docker run -p 3000:3000 -e FIGMA_ACCESS_TOKEN=your-token glyph-figma-tool
```

## **Environment Configuration**

### **Required Environment Variables**
```env
# Figma API (Required for core functionality)
FIGMA_ACCESS_TOKEN=your-figma-access-token

# OpenAI API (Optional - for AI features)
OPENAI_API_KEY=your-openai-api-key

# Server Configuration
PORT=3000
NODE_ENV=production
API_BASE_URL=http://localhost:3000/api
```

### **Getting API Keys**

#### **Figma Access Token**
1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Navigate to "Personal access tokens"
3. Click "Generate new token"
4. Copy and add to your `.env` file

#### **OpenAI API Key**
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy and add to your `.env` file

## **Deployment Platforms**

### **Vercel (Recommended)**
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### **Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### **Heroku**
```bash
# Create Heroku app
heroku create glyph-figma-tool

# Set environment variables
heroku config:set FIGMA_ACCESS_TOKEN=your-token
heroku config:set OPENAI_API_KEY=your-key

# Deploy
git push heroku main
```

### **DigitalOcean App Platform**
1. Connect GitHub repository
2. Set environment variables
3. Configure build and run commands:
   - Build: `npm run build`
   - Run: `npm start`

## **Production Considerations**

### **Database Setup (Optional)**
For production use, consider adding a database:
```javascript
// Uncomment in docker-compose.yml
postgres:
  image: postgres:15
  environment:
    - POSTGRES_DB=glyph_figma_tool
    - POSTGRES_USER=glyph_user
    - POSTGRES_PASSWORD=${DB_PASSWORD}
```

### **File Storage**
- **Local**: Files stored in `uploads/` directory
- **Cloud**: Consider AWS S3, Cloudinary, or similar for production

### **Security**
- Use HTTPS in production
- Set secure environment variables
- Implement rate limiting
- Add authentication if needed

### **Performance**
- Enable gzip compression
- Use CDN for static assets
- Monitor memory usage
- Implement caching

## **Health Checks**
The application includes health check endpoints:
- `GET /api/status` - System status and configuration
- Docker health check configured for container orchestration

## **Monitoring**
- Server logs available via `console.log`
- API response times tracked
- Error handling with proper status codes

## **Troubleshooting**

### **Common Issues**
1. **Port already in use**: Change PORT in .env
2. **API keys not working**: Verify tokens are correct
3. **Build failures**: Run `npm install` and `npm run build`
4. **Docker issues**: Check Docker daemon is running

### **Debug Mode**
```bash
# Enable debug logging
NODE_ENV=development npm start

# Check API status
curl http://localhost:3000/api/status
```

---

**🎯 Your Glyph Figma Tool is ready for deployment!**

Choose the deployment option that best fits your needs and follow the setup instructions above.