# Firebase Deploy Script
Write-Host "Checking Firebase authentication..." -ForegroundColor Yellow

# Check if firebase is logged in
$firebaseCheck = firebase projects:list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Not logged in to Firebase!" -ForegroundColor Red
    Write-Host "`nPlease run this command in your terminal:" -ForegroundColor Yellow
    Write-Host "firebase login" -ForegroundColor Cyan
    Write-Host "`nAfter login, run:" -ForegroundColor Yellow
    Write-Host "npm run deploy" -ForegroundColor Cyan
    exit 1
}

Write-Host "✓ Firebase authenticated!" -ForegroundColor Green
Write-Host "`nBuilding application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Build successful!" -ForegroundColor Green
Write-Host "`nDeploying to Firebase Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deploy successful!" -ForegroundColor Green
    Write-Host "Your app is now live!" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Deploy failed!" -ForegroundColor Red
}

