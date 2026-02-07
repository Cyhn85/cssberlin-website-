# Deploy to Hetzner Server (Manual Script)
# Run this script to deploy latest changes!

$HostName = "195.201.146.224"
$User = "root"
$ScriptFile = "deploy_script.sh"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 STARTING DEPLOYMENT TO HETZNER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Ensure script has LF line endings before upload
$Content = Get-Content $ScriptFile -Raw
# Replace CRLF with LF to ensure Linux compatibility
$Content = $Content -replace "`r`n", "`n"
[System.IO.File]::WriteAllText("deploy_temp.sh", $Content)

Write-Host "📤 Uploading deployment script..."
# Use simple variable interpolation
scp "deploy_temp.sh" "$User@$HostName:/tmp/deploy_temp.sh"

Write-Host "🚀 Executing on remote server..."
# Use Call Operator & for external commands to handle quotes better, or just invoke directly
ssh "$User@$HostName" "bash /tmp/deploy_temp.sh; rm /tmp/deploy_temp.sh"

Remove-Item "deploy_temp.sh" -ErrorAction SilentlyContinue

Write-Host "Script execution finished." -ForegroundColor Green
# Removed pause to allow automated execution
