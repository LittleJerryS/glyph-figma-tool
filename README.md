# 🎨 Glyph Figma Tool

A Figma plugin for managing your Glyph design system and generating frontend prototypes.

## Features

- **📖 Read Components**: Extract and analyze existing components from your Figma file
- **⚡ Generate Components**: Create new standardized components (buttons, inputs, cards)
- **💻 Export to Code**: Generate React component code from your Figma components
- **🎯 Design System Management**: Organize scattered UI into a professional library

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Plugin
```bash
npm run build
```

### 3. Load in Figma
1. Open Figma
2. Go to Plugins → Development → Import plugin from manifest
3. Select the `manifest.json` file from this project

## Usage

### Reading Components
1. Open a Figma file with components
2. Run the plugin
3. Click "Read Current Components" to analyze your existing components

### Generating New Components
1. Select component type (Button, Input, Card)
2. Enter component name
3. Fill in type-specific properties
4. Click "Generate Component"

### Exporting to Code
1. Click "Export Components" to generate React code
2. Copy the generated code for use in your frontend project

## Project Structure

```
glyph-figma-tool/
├── src/
│   ├── code.ts          # Main plugin logic (Figma API)
│   ├── ui.ts            # UI interactions
│   └── ui.html          # Plugin interface
├── manifest.json         # Plugin configuration
├── package.json          # Dependencies and scripts
├── webpack.config.js     # Build configuration
└── tsconfig.json         # TypeScript configuration
```

## Development

### Watch Mode
```bash
npm run dev
```

### Type Checking
```bash
npm run type-check
```

## Next Steps

This is the foundation for your design system tool. Future enhancements will include:

- **AI Integration**: AI-powered component suggestions
- **Advanced Component Types**: More complex UI patterns
- **Design Token Export**: CSS variables and design tokens
- **Storybook Integration**: Automatic Storybook story generation
- **Component Variants**: Support for component states and variations

## Troubleshooting

- **Plugin not loading**: Ensure you've built the project with `npm run build`
- **Components not reading**: Make sure your Figma file has local components
- **Build errors**: Check that all dependencies are installed with `npm install`

## Support

For issues or questions, check the Figma Plugin API documentation or create an issue in this repository.
