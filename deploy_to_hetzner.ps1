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
$Content = $Content -replace "`r`n", "`n"
[System.IO.File]::WriteAllText("deploy_temp.sh", $Content)

echo "📤 Uploading deployment script..."
scp "deploy_temp.sh" "${User}@${HostName}:/tmp/deploy_temp.sh"

echo "🚀 Executing on remote server..."
ssh "${User}@${HostName}" "bash /tmp/deploy_temp.sh; rm /tmp/deploy_temp.sh"

Remove-Item deploy_temp.sh

Write-Host "Script execution finished." -ForegroundColor Green
pause
