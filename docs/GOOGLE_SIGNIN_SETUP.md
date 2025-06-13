# Google Sign-In Setup Guide

This guide will help you set up Google Sign-In for the PartnerAI application.

## Overview

The application now supports two authentication methods:
1. **Email/Password** - Traditional form-based authentication
2. **Google Sign-In** - OAuth 2.0 authentication using Google accounts

## Prerequisites

- Google Cloud Platform account
- Access to Google Cloud Console
- Domain or localhost setup for testing

## Step-by-Step Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "PartnerAI Authentication")
4. Click "Create"

### 2. Enable Required APIs

1. Navigate to "APIs & Services" → "Library"
2. Search for "Google+ API" and click on it
3. Click "Enable"

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Fill in required information:
   - App name: "PartnerAI"
   - User support email: Your email
   - Developer contact information: Your email
4. Click "Save and Continue"
5. Skip "Scopes" for now (click "Save and Continue")
6. Add test users if needed (for development)

### 4. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Configure the client:
   - Name: "PartnerAI Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:8080` (for development)
     - `http://localhost:8081` (alternative dev port)
     - `https://your-production-domain.com` (for production)
   - Authorized redirect URIs: (leave empty for this implementation)
5. Click "Create"
6. Copy the "Client ID" (you'll need this for the .env file)

### 5. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and replace the placeholder:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```

### 6. Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:8081/login`

3. You should see:
   - Traditional email/password form
   - "Or continue with" divider
   - "Sign in with Google" button

4. Click the Google Sign-In button to test

## Implementation Details

### Files Modified/Added

- `src/composables/use-google-auth.js` - Google authentication logic
- `src/components/LoginForm.vue` - Updated with Google Sign-In button
- `src/components/Dashboard.vue` - Updated logout to clear Google auth data
- `.env` - Environment configuration
- `.env.example` - Environment template

### How It Works

1. **Google Script Loading**: The composable dynamically loads Google's Sign-In script
2. **JWT Token Handling**: User information is extracted from Google's JWT response
3. **Local Storage**: User data is stored locally for session persistence
4. **Unified Authentication**: Both email and Google users use the same authentication flow

### Security Considerations

- JWT tokens are parsed client-side (suitable for public client applications)
- User data is stored in localStorage (consider upgrading to httpOnly cookies for production)
- Google Client ID is public (this is normal for OAuth 2.0 public clients)

## Troubleshooting

### Common Issues

1. **"Sign-In Failed" Error**
   - Check that your Google Client ID is correct
   - Verify that your domain is added to authorized origins
   - Ensure the Google+ API is enabled

2. **Button Not Appearing**
   - Check browser console for JavaScript errors
   - Verify that the Google script is loading properly
   - Check network connectivity

3. **"Unauthorized" Error**
   - Verify the authorized JavaScript origins in Google Cloud Console
   - Make sure you're accessing the app from an authorized domain

### Debug Mode

To enable debug logging, open browser console and look for:
- Google Sign-In initialization messages
- JWT parsing logs
- Authentication flow logs

## Production Deployment

When deploying to production:

1. Add your production domain to Google Cloud Console authorized origins
2. Update the `VITE_GOOGLE_CLIENT_ID` environment variable
3. Consider implementing server-side token verification for enhanced security
4. Set up proper error monitoring and logging

## Support

For issues related to:
- **Google Cloud Setup**: Check [Google Cloud Documentation](https://cloud.google.com/docs)
- **OAuth 2.0**: Review [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- **Application Issues**: Check the browser console and application logs
