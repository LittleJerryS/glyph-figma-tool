# Fix Git Remotes for Cursor Background Agents
# This script ensures Cursor can properly detect GitHub remotes

Write-Host "Fixing Git Remotes for Cursor Background Agents" -ForegroundColor Green
Write-Host ""

# Check current remotes
Write-Host "Current Git Remotes:" -ForegroundColor Yellow
git remote -v
Write-Host ""

# Check if we have the GitHub remote
$githubRemote = git remote get-url github 2>$null
if ($githubRemote) {
    Write-Host "GitHub remote found: $githubRemote" -ForegroundColor Green
    
    # Set GitHub as the primary remote for Cursor
    Write-Host "Setting GitHub as primary remote..." -ForegroundColor Yellow
    git remote set-url origin $githubRemote
    
    Write-Host "GitHub is now the primary remote (origin)" -ForegroundColor Green
    Write-Host ""
    
    # Show updated remotes
    Write-Host "Updated Git Remotes:" -ForegroundColor Yellow
    git remote -v
    Write-Host ""
    
    Write-Host "Background agents should now work!" -ForegroundColor Green
    Write-Host "Try using background agents in Cursor now" -ForegroundColor Cyan
    
} else {
    Write-Host "GitHub remote not found" -ForegroundColor Red
    Write-Host "Please run the setup-background-agents.ps1 script first" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
