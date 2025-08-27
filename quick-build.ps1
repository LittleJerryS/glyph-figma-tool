# Quick Build Script - Fast development iteration
Write-Host "⚡ Quick Build for Development" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful! Plugin ready for testing." -ForegroundColor Green
    Write-Host "📁 Files generated in dist/ folder" -ForegroundColor White
} else {
    Write-Host "❌ Build failed. Check errors above." -ForegroundColor Red
}
