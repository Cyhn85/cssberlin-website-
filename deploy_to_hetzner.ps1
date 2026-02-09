# Deploy to Hetzner Server (Manual Script)

$HostName = "195.201.146.224"
$User = "root"
$ScriptFile = "deploy_docker_remote.sh"

Write-Host "STARTING DOCKER DEPLOYMENT TO HETZNER"

# Ensure script has LF line endings before upload
$Content = Get-Content $ScriptFile -Raw
$Content = $Content -replace "`r`n", "`n"
[System.IO.File]::WriteAllText("deploy_temp.sh", $Content)

Write-Host "Uploading deployment script..."
scp "deploy_temp.sh" "${User}@${HostName}:/tmp/deploy_temp.sh"

if (Test-Path ".env") {
    Write-Host "Uploading .env file..."
    scp ".env" "${User}@${HostName}:/tmp/.env"
}

Write-Host "Executing on remote server..."
ssh "${User}@${HostName}" "bash /tmp/deploy_temp.sh; rm /tmp/deploy_temp.sh"

Remove-Item "deploy_temp.sh" -ErrorAction SilentlyContinue

Write-Host "Script execution finished."
