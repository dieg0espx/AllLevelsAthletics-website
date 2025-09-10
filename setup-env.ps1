# PowerShell script to help set up environment variables
# Run this script in PowerShell as Administrator

Write-Host "🔧 All Levels Athletics - Environment Setup" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local file already exists" -ForegroundColor Green
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "❌ Setup cancelled" -ForegroundColor Red
        exit
    }
}

Write-Host "`n📝 Please provide your Supabase credentials:" -ForegroundColor Yellow

# Get Supabase URL
$supabaseUrl = Read-Host "Enter your Supabase Project URL"
if ([string]::IsNullOrWhiteSpace($supabaseUrl)) {
    Write-Host "❌ Supabase URL is required" -ForegroundColor Red
    exit
}

# Get Supabase Anon Key
$supabaseAnonKey = Read-Host "Enter your Supabase Anon Key"
if ([string]::IsNullOrWhiteSpace($supabaseAnonKey)) {
    Write-Host "❌ Supabase Anon Key is required" -ForegroundColor Red
    exit
}

# Get Supabase Service Role Key
$supabaseServiceKey = Read-Host "Enter your Supabase Service Role Key"
if ([string]::IsNullOrWhiteSpace($supabaseServiceKey)) {
    Write-Host "❌ Supabase Service Role Key is required" -ForegroundColor Red
    exit
}

# Get Stripe keys (optional)
Write-Host "`n💳 Stripe Configuration (optional):" -ForegroundColor Yellow
$stripePublishableKey = Read-Host "Enter your Stripe Publishable Key (or press Enter to skip)"
$stripeSecretKey = Read-Host "Enter your Stripe Secret Key (or press Enter to skip)"
$stripeWebhookSecret = Read-Host "Enter your Stripe Webhook Secret (or press Enter to skip)"

# Get Email configuration (optional)
Write-Host "`n📧 Email Configuration (optional):" -ForegroundColor Yellow
$emailHost = Read-Host "Enter your Email Host (or press Enter to skip)"
$emailPort = Read-Host "Enter your Email Port (or press Enter to skip)"
$emailUser = Read-Host "Enter your Email User (or press Enter to skip)"
$emailPass = Read-Host "Enter your Email Password (or press Enter to skip)"

# Create .env.local file
$envContent = @"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseAnonKey
SUPABASE_SERVICE_ROLE_KEY=$supabaseServiceKey

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$stripePublishableKey
STRIPE_SECRET_KEY=$stripeSecretKey
STRIPE_WEBHOOK_SECRET=$stripeWebhookSecret

# Email Configuration (for order confirmations)
EMAIL_HOST=$emailHost
EMAIL_PORT=$emailPort
EMAIL_USER=$emailUser
EMAIL_PASS=$emailPass

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@

try {
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "`n✅ .env.local file created successfully!" -ForegroundColor Green
    Write-Host "🔒 Remember to keep your service role key secret!" -ForegroundColor Yellow
    Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run the database schema: database-schema.sql in Supabase SQL Editor" -ForegroundColor White
    Write-Host "2. Start your development server: npm run dev" -ForegroundColor White
    Write-Host "3. Test the profile saving functionality" -ForegroundColor White
} catch {
    Write-Host "❌ Error creating .env.local file: $($_.Exception.Message)" -ForegroundColor Red
}