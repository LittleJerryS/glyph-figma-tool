# Glyph Figma Tool - Deployment Script
# This script helps you deploy the plugin to Figma

Write-Host "🎨 Glyph Figma Tool - Deployment Script" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# Check if build exists
if (-not (Test-Path "dist\code.js")) {
    Write-Host "❌ Build not found. Please run 'npm run build' first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build found successfully!" -ForegroundColor Green
Write-Host ""

# Show deployment instructions
Write-Host "🚀 To deploy this plugin to Figma:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open Figma in your browser" -ForegroundColor White
Write-Host "2. Go to Menu → Plugins → Development → Import plugin from manifest" -ForegroundColor White
Write-Host "3. Select the 'manifest.json' file from this directory" -ForegroundColor White
Write-Host "4. The plugin will be installed and ready to use!" -ForegroundColor White
Write-Host ""

# Show file locations
Write-Host "📁 Plugin Files:" -ForegroundColor Cyan
Write-Host "   Main: $(Get-Item "dist\code.js").FullName" -ForegroundColor White
Write-Host "   UI: $(Get-Item "dist\ui.html").FullName" -ForegroundColor White
Write-Host "   Manifest: $(Get-Item "manifest.json").FullName" -ForegroundColor White
Write-Host ""

# Open the dist folder
Write-Host "📂 Opening dist folder..." -ForegroundColor Yellow
Start-Process "dist"

Write-Host ""
Write-Host "🎯 Plugin is ready for deployment!" -ForegroundColor Green
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
