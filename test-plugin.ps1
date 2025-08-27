# Test Plugin Script
Write-Host "🧪 Testing Plugin Build" -ForegroundColor Cyan
Write-Host ""

# Check if build exists
if (Test-Path "dist\code.js") {
    Write-Host "✅ Build files found:" -ForegroundColor Green
    Get-ChildItem "dist" | ForEach-Object { Write-Host "   📄 $($_.Name) ($($_.Length) bytes)" -ForegroundColor White }
    
    Write-Host ""
    Write-Host "🎯 Plugin ready for Figma testing!" -ForegroundColor Green
    Write-Host "   - Open Figma → Plugins → Development → Import plugin from manifest" -ForegroundColor White
    Write-Host "   - Select manifest.json from this directory" -ForegroundColor White
} else {
    Write-Host "❌ Build not found. Run 'npm run build' first." -ForegroundColor Red
}
