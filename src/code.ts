// Main plugin code that runs in Figma
figma.showUI(__html__, { width: 400, height: 600 });

// Component data structure
interface ComponentData {
  id: string;
  name: string;
  type: string;
  properties: any;
  children?: ComponentData[];
}

// Message handling
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'read-components':
      await readAllComponents();
      break;
    case 'generate-component':
      await generateNewComponent(msg.componentType, msg.properties);
      break;
    case 'export-components':
      await exportComponentsToCode();
      break;
    default:
      console.log('Unknown message type:', msg.type);
  }
};

// Read all components from the current file
async function readAllComponents() {
  const components: ComponentData[] = [];
  
  // Get all local components
  const localComponents = figma.getLocalComponents();
  for (const component of localComponents) {
    const componentData: ComponentData = {
      id: component.id,
      name: component.name,
      type: component.type,
      properties: component.componentProperties || {},
      children: []
    };
    
    // Get component children if they exist
    if (component.children) {
      componentData.children = await extractChildren(component.children);
    }
    
    components.push(componentData);
  }
  
  // Send component data to UI
  figma.ui.postMessage({
    type: 'components-data',
    data: components
  });
}

// Extract children from component nodes
async function extractChildren(nodes: readonly SceneNode[]): Promise<ComponentData[]> {
  const children: ComponentData[] = [];
  
  for (const node of nodes) {
    if ('type' in node) {
      const childData: ComponentData = {
        id: node.id,
        name: node.name,
        type: node.type,
        properties: {},
        children: []
      };
      
      // Extract specific properties based on node type
      if (node.type === 'TEXT') {
        childData.properties = {
          characters: node.characters,
          fontSize: node.fontSize,
          fontName: node.fontName,
          fills: node.fills
        };
      } else if (node.type === 'RECTANGLE') {
        childData.properties = {
          fills: node.fills,
          strokes: node.strokes,
          cornerRadius: node.cornerRadius,
          size: { width: node.width, height: node.height }
        };
      }
      
      if ('children' in node && node.children) {
        childData.children = await extractChildren(node.children);
      }
      
      children.push(childData);
    }
  }
  
  return children;
}

// Generate a new component based on type and properties
async function generateNewComponent(componentType: string, properties: any) {
  try {
    let newNode: SceneNode;
    
    switch (componentType) {
      case 'button':
        newNode = await createButton(properties);
        break;
      case 'input':
        newNode = await createInput(properties);
        break;
      case 'card':
        newNode = await createCard(properties);
        break;
      default:
        throw new Error(`Unknown component type: ${componentType}`);
    }
    
    // Select the new component
    figma.currentPage.selection = [newNode];
    
    // Notify UI of success
    figma.ui.postMessage({
      type: 'component-created',
      data: { id: newNode.id, name: newNode.name }
    });
    
  } catch (error) {
    figma.ui.postMessage({
      type: 'error',
      data: { message: error.message }
    });
  }
}

// Create a button component
async function createButton(properties: any): Promise<ComponentNode> {
  const button = figma.createComponent();
  button.name = properties.name || 'Button';
  
  // Create button background
  const background = figma.createRectangle();
  background.name = 'Background';
  background.resize(120, 40);
  background.cornerRadius = 6;
  background.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.4, b: 0.8 } }];
  
  // Create button text
  const text = figma.createText();
  text.name = 'Text';
  text.characters = properties.text || 'Button';
  text.fontSize = 14;
  text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Position text in center of button
  text.x = (background.width - text.width) / 2;
  text.y = (background.height - text.height) / 2;
  
  // Add to button component
  button.appendChild(background);
  button.appendChild(text);
  
  return button;
}

// Create an input component
async function createInput(properties: any): Promise<ComponentNode> {
  const input = figma.createComponent();
  input.name = properties.name || 'Input';
  
  // Create input background
  const background = figma.createRectangle();
  background.name = 'Background';
  background.resize(200, 40);
  background.cornerRadius = 4;
  background.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  background.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
  background.strokeWeight = 1;
  
  // Create placeholder text
  const text = figma.createText();
  text.name = 'Placeholder';
  text.characters = properties.placeholder || 'Enter text...';
  text.fontSize = 14;
  text.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
  
  // Position text inside input
  text.x = 12;
  text.y = (background.height - text.height) / 2;
  
  // Add to input component
  input.appendChild(background);
  input.appendChild(text);
  
  return input;
}

// Create a card component
async function createCard(properties: any): Promise<ComponentNode> {
  const card = figma.createComponent();
  card.name = properties.name || 'Card';
  
  // Create card background
  const background = figma.createRectangle();
  background.name = 'Background';
  background.resize(300, 200);
  background.cornerRadius = 8;
  background.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  background.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  background.strokeWeight = 1;
  
  // Create card title
  const title = figma.createText();
  title.name = 'Title';
  title.characters = properties.title || 'Card Title';
  title.fontSize = 18;
  title.fontName = { family: 'Inter', style: 'Medium' };
  title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
  
  // Position title
  title.x = 16;
  title.y = 16;
  
  // Add to card component
  card.appendChild(background);
  card.appendChild(title);
  
  return card;
}

// Export components to frontend code
async function exportComponentsToCode() {
  const components = figma.getLocalComponents();
  const codeData = [];
  
  for (const component of components) {
    const componentCode = await generateComponentCode(component);
    codeData.push({
      name: component.name,
      code: componentCode
    });
  }
  
  // Send code data to UI
  figma.ui.postMessage({
    type: 'code-exported',
    data: codeData
  });
}

// Generate React component code for a Figma component
async function generateComponentCode(component: ComponentNode): Promise<string> {
  let code = `import React from 'react';\n\n`;
  code += `export const ${component.name.replace(/[^a-zA-Z0-9]/g, '')}: React.FC = () => {\n`;
  code += `  return (\n`;
  code += `    <div className="${component.name.toLowerCase().replace(/\s+/g, '-')}">\n`;
  
  // Add component content based on type
  if (component.children) {
    for (const child of component.children) {
      if (child.type === 'TEXT') {
        code += `      <span>${child.characters}</span>\n`;
      } else if (child.type === 'RECTANGLE') {
        code += `      <div className="background"></div>\n`;
      }
    }
  }
  
  code += `    </div>\n`;
  code += `  );\n`;
  code += `};\n`;
  
  return code;
}
