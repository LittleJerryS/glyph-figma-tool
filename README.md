# 🎨 Glyph Design System - AI-Powered UI Library Generator

A full-stack application that transforms scattered design files into professional, organized UI libraries with AI-powered design generation.

## 🚀 Features

### **Phase 1: Import & Organize**
- **Drag & Drop File Upload**: Support for images, design files, and code
- **Project Directory Scanning**: Automatically find design files in your project folders
- **File Analysis**: Extract design patterns, colors, and dimensions from images
- **Smart Categorization**: Organize files by type and content

### **Phase 2: Generate UI Library**
- **Component Extraction**: Identify reusable UI components from your designs
- **Design Token Generation**: Extract colors, typography, spacing, and layout patterns
- **Figma Integration Ready**: Export components for use in Figma
- **Consistent Design System**: Maintain design consistency across projects

### **AI Design Generation**
- **Text-to-Design Prompts**: Describe designs in natural language
- **Context-Aware Generation**: AI uses your existing design system as reference
- **Professional Specifications**: Get detailed design specs including layout, colors, and interactions
- **OpenAI Integration**: Powered by GPT-4 for intelligent design suggestions

## 🛠️ Tech Stack

- **Frontend**: TypeScript, HTML5, CSS3 with modern glassmorphism design
- **Backend**: Node.js, Express.js
- **File Processing**: Sharp (image analysis), Multer (file uploads)
- **AI Integration**: OpenAI GPT-4 API
- **Build Tool**: Webpack with hot reload
- **Styling**: Custom CSS with responsive design

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **OpenAI API Key** (optional, for AI features)

## 🚀 Quick Start

### Option 1: Automated Setup (Windows)
```bash
# Double-click the start-app.bat file
# Or run from command line:
start-app.bat
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
npm install

# 2. Build frontend
npm run build

# 3. Start the server
npm start
```

### Option 3: Development Mode
```bash
# Terminal 1: Start backend with auto-restart
npm run dev:server

# Terminal 2: Start frontend with hot reload
npm run dev
```

## 🌐 Access Points

- **Frontend Application**: http://localhost:3000
- **API Endpoints**: http://localhost:3000/api
- **Development Server**: http://localhost:3001 (with hot reload)

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Figma API Access Token (required)
FIGMA_ACCESS_TOKEN=your-figma-access-token-here

# OpenAI API Key (optional, for AI features)
OPENAI_API_KEY=your-openai-api-key-here

# Server port
PORT=3000

# Development mode
NODE_ENV=development
```

### Getting Your Figma Access Token
1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Navigate to "Personal access tokens"
3. Click "Generate new token"
4. Copy the token and add it to your `.env` file

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/status` | Get system status and counts |
| `GET` | `/api/components` | Get extracted Figma components |
| `GET` | `/api/design-tokens` | Get extracted design tokens |
| `GET` | `/api/ai-designs` | Get AI-generated designs |
| `POST` | `/api/scan-figma` | Scan Figma design file |
| `POST` | `/api/generate-ui-library` | Generate UI library from Figma components |
| `POST` | `/api/generate-ai-design` | Generate AI design using Figma context |

## 📁 Project Structure

```
glyph-figma-tool/
├── src/                    # Frontend source
│   ├── index.ts           # Main application logic
│   ├── index.html         # HTML template
│   └── styles.css         # Application styles
├── server.js              # Express backend server
├── webpack.config.js      # Build configuration
├── package.json           # Dependencies and scripts
├── start-app.bat          # Windows startup script
└── README.md              # This file
```

## 🎯 Usage Workflow

### 1. **Start the Application**
- Run `start-app.bat` or follow manual setup
- Open http://localhost:3000 in your browser

### 2. **Configure Figma Access**
- Get your Figma access token from [Figma Account Settings](https://www.figma.com/settings)
- Add `FIGMA_ACCESS_TOKEN=your-token` to your `.env` file

### 3. **Scan Figma Designs**
- Click "Scan Figma Designs" to connect to your Figma file
- Automatically extracts components, styles, and design tokens
- Uses your existing Figma file: [Propkit-UI--WIP-](https://www.figma.com/design/1B6YOHSRMa6hcZ1rWLcMOJ/Propkit-UI--WIP-?node-id=8705-470&t=mw67rwRUJYco4Rkx-1)

### 4. **Generate UI Library**
- Click "Generate UI Library" to organize extracted components
- Creates consistent design system from your Figma components
- View progress and component details in real-time

### 5. **AI Design Generation**
- Enter a design description in the AI prompt area
- Click "Generate AI Design" to create new designs
- AI uses your existing Figma design system as reference
- Press `Ctrl+Enter` for quick generation

## 🔍 File Analysis Features

### **Image Files**
- **Dimension Extraction**: Width, height, aspect ratio
- **Color Analysis**: Dominant color extraction
- **Pattern Recognition**: Component identification

### **Code Files**
- **Component Detection**: React/TypeScript component analysis
- **Style Extraction**: CSS/SCSS pattern recognition
- **Structure Analysis**: File organization and dependencies

### **Design Files**
- **Format Support**: Figma, Sketch, Adobe files
- **Asset Extraction**: Icons, images, and components
- **Style Consistency**: Design token identification

## 🚧 Development

### **Frontend Development**
```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build
```

### **Backend Development**
```bash
# Start server with auto-restart
npm run dev:server

# Start production server
npm start
```

### **Adding New Features**
1. **Frontend**: Modify `src/index.ts` and `src/styles.css`
2. **Backend**: Add routes to `server.js`
3. **API**: Extend existing endpoints or add new ones
4. **Styling**: Update CSS classes and components

## 🐛 Troubleshooting

### **Common Issues**

#### **Port Already in Use**
```bash
# Change port in .env file
PORT=3001
```

#### **File Upload Fails**
- Check file size (10MB limit)
- Verify file type is supported
- Ensure uploads/ directory exists

#### **AI Generation Not Working**
- Verify OpenAI API key in .env
- Check API quota and billing
- Fallback to mock responses if API unavailable

#### **Build Errors**
```bash
# Clear node_modules and reinstall
rmdir /s node_modules
npm install

# Clear build cache
rmdir /s dist
npm run build
```

### **Logs and Debugging**
- **Frontend**: Check browser console for errors
- **Backend**: Server logs in terminal
- **API**: Network tab in browser dev tools

## 🔮 Future Enhancements

- **Figma Plugin Integration**: Direct Figma component creation
- **Design Token Export**: CSS variables, SCSS, and design system files
- **Advanced AI Models**: Multiple AI providers and model selection
- **Collaboration Features**: Team sharing and version control
- **Analytics Dashboard**: Design system usage metrics
- **Plugin Ecosystem**: Third-party integrations and extensions

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- **Issues**: Create GitHub issues for bugs and feature requests
- **Documentation**: Check this README and inline code comments
- **Community**: Join our design system community discussions

---

**🚀 Ready to transform your scattered designs into a professional, AI-powered design system!**
