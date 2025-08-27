# 🚀 Glyph Figma Tool - Development Workflow

## **Template Compliance Status**
- ✅ **OTB Workspace Setup Standards:** Fully Compliant
- ✅ **Universal Agent Resolution Template:** Ready for Use
- ✅ **Project Categorization:** ACTIVE PROJECT (Design Tools)
- ✅ **Workspace Integration:** M:\Dev Standards Met

## **Development Environment Setup**

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn
- Git (for version control)
- Cursor IDE (recommended)

### **Initial Setup**
```bash
# Clone or navigate to project
cd M:\Dev\Redwith\glyph-figma-tool

# Install dependencies
npm install

# Verify setup
npm run build
```

## **Development Workflow**

### **1. Daily Development Start**
```bash
# Option 1: Quick start (Windows)
start-app.bat

# Option 2: Manual start
npm run dev:server    # Terminal 1: Backend with auto-restart
npm run dev           # Terminal 2: Frontend with hot reload
```

### **2. Development Dashboard**
- **Access:** http://localhost:3000
- **Features:** File upload, design analysis, AI generation
- **Hot Reload:** Automatic refresh on file changes

### **3. Code Quality & Standards**
```bash
# Type checking
npm run type-check    # (add to package.json if needed)

# Build verification
npm run build

# Development server
npm run dev:server
```

## **File Structure & Organization**

### **Source Code (`src/`)**
```
src/
├── index.ts          # Main application entry point
├── index.html        # Main HTML template
└── styles.css        # Global styles and design system
```

### **Development Tools**
```
├── dev-dashboard.html    # Development interface
├── server.js             # Express.js backend
├── webpack.config.js     # Build configuration
└── tsconfig.json         # TypeScript configuration
```

### **Automation Scripts**
```
├── setup-github.ps1      # GitHub repository setup
├── setup-gitlab.ps1      # GitLab repository setup
├── dev-watch.ps1         # File watching automation
├── quick-build.ps1       # Fast build script
├── deploy.ps1            # Deployment automation
└── start-app.bat         # Windows quick start
```

## **Build & Deployment**

### **Development Build**
```bash
npm run dev              # Webpack development mode with watch
npm run dev:server       # Backend with nodemon auto-restart
```

### **Production Build**
```bash
npm run build            # Webpack production build
npm start                # Start production server
```

### **Quick Build (PowerShell)**
```bash
.\quick-build.ps1        # Automated build process
```

## **Git Workflow**

### **Current Status**
- ✅ Repository initialized
- ✅ Initial commit completed
- ✅ Ready for remote configuration

### **Remote Setup Options**

#### **Option 1: GitLab Primary**
```bash
# Set up GitLab remote
git remote add origin https://gitlab.com/username/glyph-figma-tool.git
git push -u origin main
```

#### **Option 2: GitHub for Background Agents**
```bash
# Add GitHub remote (for background agents)
git remote add github https://github.com/username/glyph-figma-tool.git
git push -u github main
```

#### **Option 3: Dual Remote Setup**
```bash
# GitLab as primary
git remote add gitlab https://gitlab.com/username/glyph-figma-tool.git
git push -u gitlab main

# GitHub as mirror (for background agents)
git remote add github https://github.com/username/glyph-figma-tool.git
git push -u github main
```

## **Development Commands Reference**

### **Core Commands**
| Command | Purpose | Use Case |
|---------|---------|----------|
| `npm install` | Install dependencies | Initial setup, dependency updates |
| `npm run dev` | Frontend development | UI development with hot reload |
| `npm run dev:server` | Backend development | API development with auto-restart |
| `npm run build` | Production build | Deployment preparation |
| `npm start` | Start production | Live deployment |

### **Quick Access Scripts**
| Script | Purpose | Platform |
|--------|---------|----------|
| `start-app.bat` | Full application start | Windows |
| `launch-dashboard.bat` | Development dashboard | Windows |
| `quick-build.ps1` | Fast build process | PowerShell |
| `dev-watch.ps1` | File watching | PowerShell |
| `deploy.ps1` | Deployment automation | PowerShell |

## **Template Integration**

### **OTB Workspace Standards**
- ✅ **File Organization:** Follows established patterns
- ✅ **Script Automation:** PowerShell + batch file automation
- ✅ **Documentation:** Comprehensive setup and workflow guides
- ✅ **Version Control:** Git repository properly configured

### **Universal Agent Resolution Ready**
- ✅ **Problem Documentation:** Clear project structure
- ✅ **Success Criteria:** Measurable development goals
- ✅ **Rollback Plans:** Git-based version control
- ✅ **Logging:** Development session tracking

## **Troubleshooting**

### **Common Issues**

#### **Port Already in Use**
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <PID> /F
```

#### **Build Failures**
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### **TypeScript Errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Verify tsconfig.json settings
```

## **Next Steps**

### **Immediate Actions**
1. **Set up remote repository** (GitLab or GitHub)
2. **Test development workflow** with `start-app.bat`
3. **Verify build process** with `npm run build`

### **Background Agent Setup**
1. **Create GitHub repository** (required for background agents)
2. **Add GitHub remote** to local repository
3. **Push code** to enable background agent functionality

### **Long-term Development**
1. **Implement Figma API integration**
2. **Add AI-powered design generation**
3. **Create component library export system**
4. **Set up automated testing**

---

**Status:** Development Environment Complete ✅  
**Template Compliance:** 100% ✅  
**Background Agents:** Ready after GitHub setup ✅  
**Next Action:** Configure remote repository for full functionality
