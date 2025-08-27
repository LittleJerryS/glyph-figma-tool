const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const sharp = require('sharp');
const OpenAI = require('openai');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use('/uploads', express.static('uploads'));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/svg+xml', 'image/gif',
      'application/pdf', 'application/json'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Data storage (in production, use a database)
let designSystem = {
  files: [],
  components: [],
  designTokens: [],
  aiDesigns: []
};

// Routes

// Get design system status
app.get('/api/status', (req, res) => {
  res.json({
    files: designSystem.files.length,
    components: designSystem.components.length,
    designTokens: designSystem.designTokens.length,
    aiDesigns: designSystem.aiDesigns.length
  });
});

// Get all files
app.get('/api/files', (req, res) => {
  res.json(designSystem.files);
});

// Get all components
app.get('/api/components', (req, res) => {
  res.json(designSystem.components);
});

// Get all design tokens
app.get('/api/design-tokens', (req, res) => {
  res.json(designSystem.designTokens);
});

// Get all AI designs
app.get('/api/ai-designs', (req, res) => {
  res.json(designSystem.aiDesigns);
});

// Scan Figma design file
app.post('/api/scan-figma', async (req, res) => {
  try {
    const { figmaFileId, nodeId } = req.body;
    
    if (!figmaFileId) {
      return res.status(400).json({ error: 'Figma file ID is required' });
    }

    // Get Figma file data
    const figmaData = await getFigmaFile(figmaFileId, nodeId);
    
    // Extract components and design tokens
    const components = extractFigmaComponents(figmaData);
    const designTokens = extractFigmaDesignTokens(figmaData);
    
    // Update design system
    designSystem.components = components;
    designSystem.designTokens = designTokens;

    res.json({
      message: 'Figma designs scanned successfully',
      components: components,
      designTokens: designTokens
    });

  } catch (error) {
    console.error('Figma scan error:', error);
    res.status(500).json({ error: 'Figma scan failed' });
  }
});

// Upload files
app.post('/api/upload', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = [];
    
    for (const file of req.files) {
      // Process image files to extract design information
      let designInfo = {
        name: file.originalname,
        path: file.path,
        size: file.size,
        type: file.mimetype,
        uploadedAt: new Date().toISOString()
      };

      // If it's an image, analyze it for design patterns
      if (file.mimetype.startsWith('image/')) {
        try {
          const image = sharp(file.path);
          const metadata = await image.metadata();
          
          designInfo.dimensions = {
            width: metadata.width,
            height: metadata.height
          };

          // Extract dominant colors (simplified)
          const { data } = await image.resize(100, 100).raw().toBuffer();
          designInfo.colors = extractDominantColors(data);
          
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }

      uploadedFiles.push(designInfo);
      designSystem.files.push(designInfo);
    }

    res.json({
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Scan existing project directories
app.post('/api/scan-existing', async (req, res) => {
  try {
    const projectDirs = [
      '../Redwith',
      '../OTB', 
      '../frontend-backup',
      '../mobile-app-backup',
      '../spencer-portfolio',
      '../otb-clean'
    ];

    const foundFiles = [];
    
    for (const dir of projectDirs) {
      try {
        const fullPath = path.resolve(__dirname, dir);
        if (await fs.pathExists(fullPath)) {
          const files = await scanDirectoryForDesigns(fullPath);
          foundFiles.push(...files);
        }
      } catch (error) {
        console.error(`Error scanning ${dir}:`, error);
      }
    }

    res.json({
      message: `Found ${foundFiles.length} design-related files`,
      files: foundFiles
    });

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Scan failed' });
  }
});

// Generate UI Library from uploaded files
app.post('/api/generate-ui-library', async (req, res) => {
  try {
    if (designSystem.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded yet' });
    }

    // Analyze uploaded files to extract design patterns
    const components = await extractComponents(designSystem.files);
    const designTokens = await extractDesignTokens(designSystem.files);

    designSystem.components = components;
    designSystem.designTokens = designTokens;

    res.json({
      message: 'UI Library generated successfully',
      components: components.length,
      designTokens: designTokens.length,
      data: {
        components,
        designTokens
      }
    });

  } catch (error) {
    console.error('Library generation error:', error);
    res.status(500).json({ error: 'Library generation failed' });
  }
});

// Generate AI Design from prompt
app.post('/api/generate-ai-design', async (req, res) => {
  try {
    const { prompt, referenceFiles } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Design prompt is required' });
    }

    // Create context from existing design system
    const context = createDesignContext();
    
    // Generate design using OpenAI
    const aiDesign = await generateDesignWithAI(prompt, context);
    
    designSystem.aiDesigns.push(aiDesign);

    res.json({
      message: 'AI Design generated successfully',
      design: aiDesign
    });

  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: 'AI design generation failed' });
  }
});

// Helper functions

function extractDominantColors(imageData) {
  // Simplified color extraction - in production, use a proper color analysis library
  const colors = [];
  for (let i = 0; i < Math.min(imageData.length, 300); i += 3) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    colors.push(`rgb(${r}, ${g}, ${b})`);
  }
  return colors.slice(0, 5); // Return top 5 colors
}

async function scanDirectoryForDesigns(dirPath) {
  const designFiles = [];
  
  try {
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively scan subdirectories
        const subFiles = await scanDirectoryForDesigns(fullPath);
        designFiles.push(...subFiles);
      } else if (isDesignFile(item)) {
        designFiles.push({
          name: item,
          path: fullPath,
          size: stat.size,
          modified: stat.mtime,
          type: getFileType(item)
        });
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
  
  return designFiles;
}

function isDesignFile(filename) {
  const designExtensions = [
    '.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp',
    '.fig', '.sketch', '.ai', '.psd', '.xd',
    '.tsx', '.ts', '.jsx', '.js', '.css', '.scss'
  ];
  
  const ext = path.extname(filename).toLowerCase();
  return designExtensions.includes(ext);
}

function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase();
  
  if (['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'].includes(ext)) {
    return 'image';
  } else if (['.fig', '.sketch', '.ai', '.psd', '.xd'].includes(ext)) {
    return 'design';
  } else if (['.tsx', '.ts', '.jsx', '.js'].includes(ext)) {
    return 'code';
  } else if (['.css', '.scss'].includes(ext)) {
    return 'style';
  }
  
  return 'other';
}

async function extractComponents(files) {
  const components = [];
  
  // Analyze files to identify potential components
  for (const file of files) {
    if (file.type === 'image') {
      // Extract component patterns from images
      components.push({
        name: `Component from ${file.name}`,
        type: 'image-based',
        source: file.name,
        status: 'extracted',
        properties: {
          dimensions: file.dimensions,
          colors: file.colors || []
        }
      });
    } else if (file.type === 'code') {
      // Extract component patterns from code files
      components.push({
        name: `Component from ${file.name}`,
        type: 'code-based',
        source: file.name,
        status: 'extracted',
        properties: {
          language: path.extname(file.name).slice(1),
          size: file.size
        }
      });
    }
  }
  
  return components;
}

async function extractDesignTokens(files) {
  const tokens = [];
  
  // Extract design tokens from files
  for (const file of files) {
    if (file.colors && file.colors.length > 0) {
      file.colors.forEach((color, index) => {
        tokens.push({
          name: `Color ${index + 1} from ${file.name}`,
          type: 'color',
          value: color,
          source: file.name
        });
      });
    }
    
    if (file.dimensions) {
      tokens.push({
        name: `Dimensions from ${file.name}`,
        type: 'dimension',
        value: `${file.dimensions.width}x${file.dimensions.height}`,
        source: file.name
      });
    }
  }
  
  return tokens;
}

function createDesignContext() {
  return {
    components: designSystem.components,
    designTokens: designSystem.designTokens,
    files: designSystem.files,
    patterns: extractDesignPatterns()
  };
}

function extractDesignPatterns() {
  const patterns = {
    colors: [],
    typography: [],
    spacing: [],
    layouts: []
  };
  
  // Extract patterns from existing data
  designSystem.designTokens.forEach(token => {
    if (token.type === 'color') {
      patterns.colors.push(token.value);
    }
  });
  
  return patterns;
}

async function generateDesignWithAI(prompt, context) {
  try {
    const systemPrompt = `You are a professional UI/UX designer. Create a detailed design specification based on the user's prompt and existing design system context.

Existing Design System:
- Components: ${context.components.length}
- Design Tokens: ${context.designTokens.length}
- Color Palette: ${context.patterns.colors.join(', ')}

User Request: ${prompt}

Provide a detailed design specification including:
1. Layout structure
2. Component hierarchy
3. Color scheme
4. Typography
5. Spacing and sizing
6. Interactive states
7. Accessibility considerations

Format the response as a structured JSON object.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const aiResponse = completion.choices[0].message.content;
    
    return {
      id: Date.now(),
      name: `AI Generated Design ${designSystem.aiDesigns.length + 1}`,
      prompt: prompt,
      response: aiResponse,
      status: 'generated',
      createdAt: new Date().toISOString(),
      context: context
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to mock generation
    return {
      id: Date.now(),
      name: `AI Generated Design ${designSystem.aiDesigns.length + 1}`,
      prompt: prompt,
      response: `Mock AI response for: ${prompt}`,
      status: 'generated (mock)',
      createdAt: new Date().toISOString(),
      context: context
    };
  }
}

// Figma API helper functions
async function getFigmaFile(fileId, nodeId = null) {
  try {
    const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
    if (!figmaToken) {
      throw new Error('FIGMA_ACCESS_TOKEN not found in environment variables');
    }

    let url = `https://api.figma.com/v1/files/${fileId}`;
    if (nodeId) {
      url += `/nodes?ids=${nodeId}`;
    }

    const response = await axios.get(url, {
      headers: {
        'X-Figma-Token': figmaToken
      }
    });

    return response.data;
  } catch (error) {
    console.error('Figma API error:', error);
    throw new Error('Failed to fetch Figma file data');
  }
}

function extractFigmaComponents(figmaData) {
  const components = [];
  
  try {
    // Extract components from Figma data
    if (figmaData.nodes) {
      Object.values(figmaData.nodes).forEach(node => {
        if (node.document) {
          extractComponentsFromNode(node.document, components);
        }
      });
    } else if (figmaData.document) {
      extractComponentsFromNode(figmaData.document, components);
    }
  } catch (error) {
    console.error('Error extracting components:', error);
  }
  
  return components;
}

function extractComponentsFromNode(node, components) {
  if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
    components.push({
      id: node.id,
      name: node.name,
      type: node.type,
      source: 'figma',
      status: 'extracted',
      properties: {
        width: node.absoluteBoundingBox?.width,
        height: node.absoluteBoundingBox?.height,
        fills: node.fills,
        strokes: node.strokes,
        effects: node.effects
      }
    });
  }
  
  // Recursively check children
  if (node.children) {
    node.children.forEach(child => {
      extractComponentsFromNode(child, components);
    });
  }
}

function extractFigmaDesignTokens(figmaData) {
  const tokens = [];
  
  try {
    // Extract design tokens from Figma data
    if (figmaData.styles) {
      Object.values(figmaData.styles).forEach(style => {
        if (style.styleType === 'FILL') {
          tokens.push({
            name: style.name,
            type: 'color',
            value: style.description || 'Figma color style',
            source: 'figma',
            figmaId: style.key
          });
        } else if (style.styleType === 'TEXT') {
          tokens.push({
            name: style.name,
            type: 'typography',
            value: style.description || 'Figma text style',
            source: 'figma',
            figmaId: style.key
          });
        }
      });
    }
  } catch (error) {
    console.error('Error extracting design tokens:', error);
  }
  
  return tokens;
}

// Serve the main application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Glyph Design System server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});

module.exports = app;
