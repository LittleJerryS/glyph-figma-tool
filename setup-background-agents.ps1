# Background Agents Setup Script for Glyph Figma Tool
# This script sets up GitHub specifically for background agent functionality

Write-Host "🚀 Setting up Background Agents for Glyph Figma Tool" -ForegroundColor Green
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

# Check current remotes
Write-Host "📡 Current Git Remotes:" -ForegroundColor Yellow
git remote -v
Write-Host ""

# Instructions for creating the GitHub repository
Write-Host "📋 Next Steps for Background Agents:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/new" -ForegroundColor Cyan
Write-Host "2. Repository name: glyph-figma-tool" -ForegroundColor Cyan
Write-Host "3. Description: Figma plugin for Glyph design system management and frontend prototype generation" -ForegroundColor Cyan
Write-Host "4. Make it Public or Private (your choice)" -ForegroundColor Cyan
Write-Host "5. DONT initialize with README, .gitignore, or license" -ForegroundColor Cyan
Write-Host "6. Click Create repository" -ForegroundColor Cyan
Write-Host ""

# Wait for user input
$repositoryUrl = Read-Host "🔗 Paste your GitHub repository URL here (e.g., https://github.com/username/glyph-figma-tool.git)"

if ($repositoryUrl -match "https://github\.com/[^/]+/[^/]+\.git") {
    Write-Host ""
    Write-Host "🚀 Setting up GitHub remote for background agents..." -ForegroundColor Green
    
    try {
        # Check if GitHub remote already exists
        $existingRemote = git remote get-url github 2>$null
        if ($existingRemote) {
            Write-Host "⚠️  GitHub remote already exists. Updating..." -ForegroundColor Yellow
            git remote set-url github $repositoryUrl
        } else {
            # Add GitHub remote
            git remote add github $repositoryUrl
        }
        
        # Set main branch and push
        git branch -M main
        git push -u github main
        
        Write-Host ""
        Write-Host "🎉 Success! Background agents are now enabled!" -ForegroundColor Green
        Write-Host "Repository: $repositoryUrl" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📱 Background Agent Features Now Available:" -ForegroundColor Yellow
        Write-Host "   - AI-powered code assistance" -ForegroundColor White
        Write-Host "   - Automated development workflows" -ForegroundColor White
        Write-Host "   - Intelligent project analysis" -ForegroundColor White
        Write-Host "   - Enhanced development productivity" -ForegroundColor White
        Write-Host ""
        Write-Host "🔄 Sync Commands for Future Updates:" -ForegroundColor Yellow
        Write-Host "   git push gitlab main    # Push to GitLab (if configured)" -ForegroundColor White
        Write-Host "   git push github main    # Push to GitHub (background agents)" -ForegroundColor White
        
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
