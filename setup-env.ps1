# PowerShell script to help set up environment variables for AllLevelsAthletics website

Write-Host "🚀 Setting up environment variables for AllLevelsAthletics website..." -ForegroundColor Green
Write-Host ""

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local file already exists" -ForegroundColor Green
    Write-Host "📝 Please add SUPABASE_SERVICE_ROLE_KEY to your existing .env.local file" -ForegroundColor Yellow
} else {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    
    # Create .env.local with template
    @"
# Supabase Configuration
# Get these values from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Stripe Configuration
# Get these values from your Stripe dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Site URL (for Stripe checkout redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    
    Write-Host "✅ .env.local file created!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔑 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Go to https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Select your project" -ForegroundColor White
Write-Host "3. Go to Settings → API" -ForegroundColor White
Write-Host "4. Copy the 'service_role' key (NOT the anon key)" -ForegroundColor White
Write-Host "5. Replace 'your-service-role-key-here' in .env.local with your actual key" -ForegroundColor White
Write-Host "6. Restart your development server" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT: Never commit .env.local to version control!" -ForegroundColor Red
Write-Host ""
Write-Host "Setup complete! Follow the steps above to configure your service role key." -ForegroundColor Green
