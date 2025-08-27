// UI logic for the Figma plugin
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const readComponentsBtn = document.getElementById('read-components') as HTMLButtonElement;
  const generateComponentBtn = document.getElementById('generate-component') as HTMLButtonElement;
  const exportComponentsBtn = document.getElementById('export-components') as HTMLButtonElement;
  const componentTypeSelect = document.getElementById('component-type') as HTMLSelectElement;
  const componentNameInput = document.getElementById('component-name') as HTMLInputElement;
  const buttonProperties = document.getElementById('button-properties') as HTMLDivElement;
  const inputProperties = document.getElementById('input-properties') as HTMLDivElement;
  const cardProperties = document.getElementById('card-properties') as HTMLDivElement;
  const buttonTextInput = document.getElementById('button-text') as HTMLInputElement;
  const inputPlaceholderInput = document.getElementById('input-placeholder') as HTMLInputElement;
  const cardTitleInput = document.getElementById('card-title') as HTMLInputElement;
  const componentList = document.getElementById('component-list') as HTMLDivElement;
  const codeOutput = document.getElementById('code-output') as HTMLDivElement;
  const statusDiv = document.getElementById('status') as HTMLDivElement;

  // Show/hide property fields based on component type
  componentTypeSelect.addEventListener('change', () => {
    const selectedType = componentTypeSelect.value;
    
    // Hide all property fields
    buttonProperties.style.display = 'none';
    inputProperties.style.display = 'none';
    cardProperties.style.display = 'none';
    
    // Show relevant property fields
    switch (selectedType) {
      case 'button':
        buttonProperties.style.display = 'block';
        break;
      case 'input':
        inputProperties.style.display = 'block';
        break;
      case 'card':
        cardProperties.style.display = 'block';
        break;
    }
  });

  // Read components button
  readComponentsBtn.addEventListener('click', () => {
    parent.postMessage({ pluginMessage: { type: 'read-components' } }, '*');
    showStatus('Reading components...', 'info');
  });

  // Generate component button
  generateComponentBtn.addEventListener('click', () => {
    const componentType = componentTypeSelect.value;
    const componentName = componentNameInput.value.trim();
    
    if (!componentName) {
      showStatus('Please enter a component name', 'error');
      return;
    }
    
    const properties: any = {
      name: componentName
    };
    
    // Add type-specific properties
    switch (componentType) {
      case 'button':
        properties.text = buttonTextInput.value.trim() || 'Button';
        break;
      case 'input':
        properties.placeholder = inputPlaceholderInput.value.trim() || 'Enter text...';
        break;
      case 'card':
        properties.title = cardTitleInput.value.trim() || 'Card Title';
        break;
    }
    
    parent.postMessage({ 
      pluginMessage: { 
        type: 'generate-component',
        componentType,
        properties
      } 
    }, '*');
    
    showStatus('Generating component...', 'info');
  });

  // Export components button
  exportComponentsBtn.addEventListener('click', () => {
    parent.postMessage({ pluginMessage: { type: 'export-components' } }, '*');
    showStatus('Exporting components...', 'info');
  });

  // Listen for messages from the plugin
  window.addEventListener('message', (event) => {
    const message = event.data.pluginMessage;
    
    if (!message) return;
    
    switch (message.type) {
      case 'components-data':
        displayComponents(message.data);
        showStatus(`Found ${message.data.length} components`, 'success');
        break;
        
      case 'component-created':
        showStatus(`Component "${message.data.name}" created successfully!`, 'success');
        break;
        
      case 'code-exported':
        displayCodeOutput(message.data);
        showStatus('Components exported to code successfully!', 'success');
        break;
        
      case 'error':
        showStatus(message.data.message, 'error');
        break;
    }
  });

  // Display components in the list
  function displayComponents(components: any[]) {
    if (components.length === 0) {
      componentList.innerHTML = '<div class="component-item">No components found</div>';
    } else {
      componentList.innerHTML = components.map(component => 
        `<div class="component-item">
          <strong>${component.name}</strong> (${component.type})
          ${component.children ? ` - ${component.children.length} children` : ''}
        </div>`
      ).join('');
    }
    
    componentList.style.display = 'block';
  }

  // Display code output
  function displayCodeOutput(codeData: any[]) {
    if (codeData.length === 0) {
      codeOutput.textContent = 'No components to export';
    } else {
      const allCode = codeData.map(item => 
        `// ${item.name}\n${item.code}\n`
      ).join('\n');
      codeOutput.textContent = allCode;
    }
    
    codeOutput.style.display = 'block';
  }

  // Show status message
  function showStatus(message: string, type: 'success' | 'error' | 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 5000);
  }

  // Initialize with button properties visible
  buttonProperties.style.display = 'block';
});
