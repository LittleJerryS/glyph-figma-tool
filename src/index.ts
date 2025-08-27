import './styles.css';

class GlyphDesignSystem {
  private apiBase = 'http://localhost:3000/api';
  private components: any[] = [];
  private designTokens: any[] = [];
  private aiDesigns: any[] = [];
  private figmaFileId = '1B6YOHSRMa6hcZ1rWLcMOJ';

  constructor() {
    this.initializeEventListeners();
    this.loadInitialData();
  }

  private async loadInitialData() {
    try {
      const status = await this.fetchAPI('/status');
      this.updateStatusDisplay(status);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  }

  private initializeEventListeners() {
    const promptInput = document.getElementById('ai-prompt') as HTMLTextAreaElement;
    if (promptInput) {
      promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          this.generateAIDesign();
        }
      });
    }
  }

  private async scanFigmaDesigns() {
    this.log('Scanning Figma design file...', 'info');
    this.log(`Figma File: ${this.figmaFileId}`, 'command');
    
    try {
      const response = await fetch(`${this.apiBase}/scan-figma`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          figmaFileId: this.figmaFileId,
          nodeId: '8705-470' // Specific node from your URL
        })
      });

      if (response.ok) {
        const result = await response.json();
        this.log(`${result.message}`, 'success');
        this.log(`Found ${result.components.length} components and ${result.designTokens.length} design tokens`, 'success');
        
        // Update local data
        this.components = result.components;
        this.designTokens = result.designTokens;
        
        await this.refreshData();
      } else {
        const error = await response.json();
        this.log(`Figma scan failed: ${error.error}`, 'error');
      }
    } catch (error) {
      this.log(`Figma scan error: ${error}`, 'error');
    }
  }

  private async generateUILibrary() {
    if (this.components.length === 0) {
      this.log('No components found yet. Please scan Figma designs first.', 'warning');
      return;
    }

    this.log('Generating UI Library from Figma designs...', 'info');
    
    try {
      const response = await fetch(`${this.apiBase}/generate-ui-library`, {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        this.log(`${result.message}`, 'success');
        this.log(`Created ${result.components} components and ${result.designTokens} design tokens`, 'success');
        
        await this.refreshData();
      } else {
        const error = await response.json();
        this.log(`Library generation failed: ${error.error}`, 'error');
      }
    } catch (error) {
      this.log(`Library generation error: ${error}`, 'error');
    }
  }

  private async generateAIDesign() {
    const promptInput = document.getElementById('ai-prompt') as HTMLTextAreaElement;
    const prompt = promptInput?.value.trim();

    if (!prompt) {
      this.log('Please enter a design prompt first.', 'warning');
      return;
    }

    this.log('Generating AI design...', 'info');
    this.log(`Prompt: "${prompt}"`, 'command');

    try {
      const response = await fetch(`${this.apiBase}/generate-ai-design`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          prompt,
          figmaFileId: this.figmaFileId,
          existingComponents: this.components,
          designTokens: this.designTokens
        })
      });

      if (response.ok) {
        const result = await response.json();
        this.log(`${result.message}`, 'success');
        
        // Add to local data
        this.aiDesigns.push(result.design);
        await this.refreshData();
      } else {
        const error = await response.json();
        this.log(`AI generation failed: ${error.error}`, 'error');
      }
    } catch (error) {
      this.log(`AI generation error: ${error}`, 'error');
    }
  }

  private async refreshData() {
    try {
      const [components, designTokens, aiDesigns] = await Promise.all([
        this.fetchAPI('/components'),
        this.fetchAPI('/design-tokens'),
        this.fetchAPI('/ai-designs')
      ]);

      this.components = components;
      this.designTokens = designTokens;
      this.aiDesigns = aiDesigns;

      this.updateStatusDisplay({
        files: 0, // We don't track files anymore
        components: components.length,
        designTokens: designTokens.length,
        aiDesigns: aiDesigns.length
      });
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }

  private async fetchAPI(endpoint: string) {
    const response = await fetch(`${this.apiBase}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    return response.json();
  }

  private updateStatusDisplay(status: any) {
    const componentsCreated = document.getElementById('components-created');
    const designTokens = document.getElementById('design-tokens');
    const aiDesigns = document.getElementById('ai-designs');

    if (componentsCreated) componentsCreated.textContent = status.components.toString();
    if (designTokens) designTokens.textContent = status.designTokens.toString();
    if (aiDesigns) aiDesigns.textContent = status.aiDesigns.toString();

    // Update progress bar
    const totalSteps = 3;
    const currentStep = Math.min(
      (status.components > 0 ? 1 : 0) +
      (status.designTokens > 0 ? 1 : 0) +
      (status.aiDesigns > 0 ? 1 : 0),
      totalSteps
    );
    const progress = (currentStep / totalSteps) * 100;
    
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }

  private log(message: string, type: 'info' | 'success' | 'warning' | 'error' | 'command' = 'info') {
    const logOutput = document.getElementById('log-output');
    if (!logOutput) return;

    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = `[${timestamp}] ${message}`;
    
    logOutput.appendChild(logEntry);
    logOutput.scrollTop = logOutput.scrollHeight;
  }

  // Public methods for button clicks
  public scanFigmaDesigns() {
    this.scanFigmaDesigns();
  }

  public generateUILibrary() {
    this.generateUILibrary();
  }

  public previewLibrary() {
    if (this.components.length === 0) {
      this.log('No UI Library generated yet. Scan Figma designs first.', 'warning');
      return;
    }
    
    this.log('Previewing generated UI Library...', 'info');
    this.log(`Components: ${this.components.length}`, 'info');
    this.log(`Design Tokens: ${this.designTokens.length}`, 'info');
    
    // Show component details
    this.components.forEach(component => {
      this.log(`- ${component.name} (${component.type})`, 'info');
    });
  }

  public generateAIDesign() {
    this.generateAIDesign();
  }

  public previewPrompt() {
    const promptInput = document.getElementById('ai-prompt') as HTMLTextAreaElement;
    const prompt = promptInput?.value.trim();
    
    if (!prompt) {
      this.log('No prompt to preview. Enter a design description first.', 'warning');
      return;
    }
    
    this.log('Previewing AI prompt...', 'info');
    this.log(`Prompt: "${prompt}"`, 'command');
    this.log('This prompt will generate a design based on your existing Figma design system', 'info');
    
    if (this.components.length > 0) {
      this.log(`Using ${this.components.length} existing components as reference`, 'info');
    }
  }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const glyphSystem = new GlyphDesignSystem();
  
  // Make methods globally available for button clicks
  (window as any).scanFigmaDesigns = () => glyphSystem.scanFigmaDesigns();
  (window as any).generateUILibrary = () => glyphSystem.generateUILibrary();
  (window as any).previewLibrary = () => glyphSystem.previewLibrary();
  (window as any).generateAIDesign = () => glyphSystem.generateAIDesign();
  (window as any).previewPrompt = () => glyphSystem.previewPrompt();
});
