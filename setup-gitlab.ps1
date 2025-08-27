# GitLab Project Setup Script for Glyph Figma Tool
# This script will help you set up your GitLab project and repository

Write-Host "Setting up GitLab project for Glyph Figma Tool" -ForegroundColor Green
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "Git not initialized. Please run 'git init' first." -ForegroundColor Red
    exit 1
}

# Check if we have commits
$commitCount = git rev-list --count HEAD 2>$null
if ($commitCount -eq 0) {
    Write-Host "No commits found. Please commit your changes first." -ForegroundColor Red
    exit 1
}

Write-Host "Git repository is ready" -ForegroundColor Green
Write-Host ""

# Instructions for creating the GitLab project
Write-Host "Next Steps to Create GitLab Project:" -ForegroundColor Yellow
Write-Host "1. Open VS Code Command Palette (Ctrl+Shift+P)" -ForegroundColor Cyan
Write-Host "2. Type: GitLab: Create Project" -ForegroundColor Cyan
Write-Host "3. Fill in the details:" -ForegroundColor Cyan
Write-Host "   - Project name: glyph-figma-tool" -ForegroundColor White
Write-Host "   - Description: Figma plugin for Glyph design system management and frontend prototype generation" -ForegroundColor White
Write-Host "   - Visibility: Public" -ForegroundColor White
Write-Host "4. Click Create Project" -ForegroundColor Cyan
Write-Host ""

Write-Host "Alternative: Use GitLab Web Interface" -ForegroundColor Yellow
Write-Host "1. Go to https://gitlab.com/new" -ForegroundColor Cyan
Write-Host "2. Choose 'Create blank project'" -ForegroundColor Cyan
Write-Host "3. Fill in the same details above" -ForegroundColor Cyan
Write-Host "4. Click 'Create project'" -ForegroundColor Cyan
Write-Host ""

# Wait for user input
$projectUrl = Read-Host "Paste your GitLab project URL here (e.g., https://gitlab.com/username/glyph-figma-tool)"

if ($projectUrl -match "https://gitlab\.com/[^/]+/[^/]+") {
    Write-Host ""
    Write-Host "Setting up remote and pushing code..." -ForegroundColor Green
    
    try {
        # Add remote origin
        git remote add origin $projectUrl
        
        # Set main branch and push
        git branch -M main
        git push -u origin main
        
        Write-Host ""
        Write-Host "Success! Your code is now on GitLab!" -ForegroundColor Green
        Write-Host "Project: $projectUrl" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "You can now access your project from anywhere!" -ForegroundColor Yellow
        Write-Host "Share this URL with your team: $projectUrl" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "GitLab Features Available:" -ForegroundColor Yellow
        Write-Host "   - Built-in CI/CD for automated builds" -ForegroundColor White
        Write-Host "   - Issue tracking for design system tasks" -ForegroundColor White
        Write-Host "   - Wiki pages for documentation" -ForegroundColor White
        Write-Host "   - Container registry if needed later" -ForegroundColor White
        
    } catch {
        Write-Host "Error pushing to GitLab: $_" -ForegroundColor Red
        Write-Host "Please check your GitLab credentials and try again." -ForegroundColor Yellow
    }
    
} else {
    Write-Host "Invalid GitLab URL format. Please use: https://gitlab.com/username/project" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
