# Email Setup for Contact Form

## Setup Instructions

### 1. Create Environment File
Create a `.env.local` file in your project root with the following content:

```env
# Email Configuration for Contact Form
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
```

### 2. Gmail App Password Setup
To get your Gmail app password:

1. **Enable 2-Factor Authentication** (if not already enabled):
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to Security > App passwords
   - Select "Mail" as the app
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env.local**:
   - Replace `your-email@gmail.com` with your Gmail address
   - Replace `your-app-password-here` with the generated app password

### 3. Important Notes
- **Never use your regular Gmail password** - only use app passwords
- The app password is 16 characters long
- Keep your `.env.local` file secure and never commit it to version control
- The contact form will send emails to `AllLevelsAthletics@gmail.com`

### 4. Testing
After setup, test the contact form by:
1. Filling out the form on your website
2. Submitting it
3. Checking if you receive the email at `AllLevelsAthletics@gmail.com`

### 5. Email Template
The emails will be sent with a clean, professional design including:
- Personal information section
- Fitness goals
- Current experience (if provided)
- Timeline (if provided)
- Questions (if provided)
- Timestamp of submission

The email design uses orange branding colors to match your website theme.
