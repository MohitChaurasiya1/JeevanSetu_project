Write-Host "Setting up JeevanSetu Environment..."
Set-Location frontend
npm install
Set-Location ..\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Set-Location ..
Write-Host "Setup complete."
