# GitHub Repository Setup Script for Glyph Figma Tool
# This script will help you set up your GitHub repository

Write-Host "🚀 Setting up GitHub repository for Glyph Figma Tool" -ForegroundColor Green
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git not initialized. Please run 'git init' first." -ForegroundColor Red
    exit 1
}

# Check if we have commits
$commitCount = git rev-list --count HEAD 2>$null
if ($commitCount -eq 0) {
    Write-Host "❌ No commits found. Please commit your changes first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git repository is ready" -ForegroundColor Green
Write-Host ""

# Instructions for creating the repository
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/new" -ForegroundColor Cyan
Write-Host "2. Repository name: glyph-figma-tool" -ForegroundColor Cyan
Write-Host "3. Description: Figma plugin for Glyph design system management and frontend prototype generation" -ForegroundColor Cyan
Write-Host "4. Make it Public" -ForegroundColor Cyan
Write-Host "5. DONT initialize with README, .gitignore, or license" -ForegroundColor Cyan
Write-Host "6. Click Create repository" -ForegroundColor Cyan
Write-Host ""

# Wait for user input
$repositoryUrl = Read-Host "🔗 Paste your GitHub repository URL here (e.g., https://github.com/username/glyph-figma-tool.git)"

if ($repositoryUrl -match "https://github\.com/[^/]+/[^/]+\.git") {
    Write-Host ""
    Write-Host "🚀 Setting up remote and pushing code..." -ForegroundColor Green
    
    try {
        # Add remote origin
        git remote add origin $repositoryUrl
        
        # Set main branch and push
        git branch -M main
        git push -u origin main
        
        Write-Host ""
        Write-Host "🎉 Success! Your code is now on GitHub!" -ForegroundColor Green
        Write-Host "Repository: $repositoryUrl" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📱 You can now access your project from anywhere!" -ForegroundColor Yellow
        Write-Host "🔗 Share this URL with your team: $repositoryUrl" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Error pushing to GitHub: $_" -ForegroundColor Red
        Write-Host "Please check your GitHub credentials and try again." -ForegroundColor Yellow
    }
    
} else {
    Write-Host "❌ Invalid GitHub URL format. Please use: https://github.com/username/repository.git" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
