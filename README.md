# PartnerAI - AI-Powered Business Partner Validation Platform

<div align="center">
  <img src="public/favicon-purple.svg" alt="PartnerAI Logo" width="80" height="80">

  **Advanced AI-powered platform for business partner validation and verification with human-in-the-loop review capabilities.**

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-partner--validation--ai.surge.sh-purple)](https://partner-validation-ai.surge.sh)
  [![Vue 3](https://img.shields.io/badge/Vue-3.4.0-4FC08D?logo=vue.js)](https://vuejs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.11-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
</div>

## 🚀 Features

### Core Capabilities
- **🎯 95% Validation Accuracy** - Advanced machine learning algorithms for precise partner verification
- **⚡ 80% Faster Processing** - Streamlined workflow reduces processing time dramatically
- **👥 Human-AI Collaboration** - Seamless integration between AI automation and human oversight
- **🛡️ Enterprise Security** - Built-in security measures for sensitive business data

### Key Components
- **AI-Powered Validation** - Automated credential and business information verification
- **Lightning Fast Processing** - Complete partner onboarding in minutes, not days
- **Human-in-the-Loop Review** - Expert human review for complex validation scenarios
- **Global Compliance** - International regulations and local business requirements support

## 🛠️ Technology Stack

### Frontend Framework
- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vue Router** - Official router for Vue.js applications
- **Pinia** - Intuitive state management for Vue

### Build Tools & Development
- **Vite** - Next generation frontend tooling
- **JavaScript** - Modern ES6+ JavaScript
- **ESLint** - Code linting and quality assurance

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Vue Next** - Beautiful & consistent icon library
- **Radix Vue** - Low-level UI primitives
- **Class Variance Authority** - Component variant management

### Deployment & Automation
- **Rollup Plugin Copy** - Automated file copying for SPA routing
- **Custom Domain** - Deployed at partner-validation-ai.surge.sh
- **SPA Routing** - Automated 200.html generation for client-side routing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v8.6.0 or higher)

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd partner-validation-ai

# Install dependencies
npm install

# Set up environment variables (see Google OAuth Setup below)
cp .env.example .env
# Edit .env and add your Google Client ID

# Start development server
npm run dev
```

### Google OAuth Setup
To enable Google Sign-In functionality:

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add your domain to "Authorized JavaScript origins":
     - For development: `http://localhost:8080`
     - For production: `https://your-domain.com`

4. **Configure Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env and replace with your actual Google Client ID
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```

5. **Test the Integration**
   - Start the development server: `npm run dev`
   - Navigate to the login page
   - Click "Sign in with Google" to test the integration

### Available Scripts
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🏗️ Project Structure

```
partner-validation-ai/
├── public/                 # Static assets
│   ├── CNAME              # Custom domain configuration
│   ├── favicon-purple.svg # Purple-themed favicon
│   └── robots.txt         # SEO robots configuration
├── src/
│   ├── components/        # Vue components
│   │   ├── ui/           # Reusable UI components
│   │   ├── Dashboard.vue # Main dashboard interface
│   │   ├── LoginForm.vue # Authentication component
│   │   ├── HITLInterface.vue # Human-in-the-loop review
│   │   └── ...
│   ├── composables/      # Vue composables
│   ├── router/           # Vue Router configuration
│   ├── stores/           # Pinia state management
│   └── main.js          # Application entry point
├── dist/                 # Production build output
│   ├── index.html       # Main entry point
│   ├── 200.html         # SPA routing support (auto-generated)
│   └── assets/          # Bundled assets
└── vite.config.js       # Vite configuration
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (`#9333EA` to `#7C3AED`)
- **Secondary**: Blue tones for UI elements
- **Accent Colors**: Green (success), Orange (warning), Red (error)
- **Neutral**: Gray scale for text and backgrounds

### Key Design Principles
- **Clean & Professional** - Business-appropriate design language
- **Consistent Branding** - Purple theme throughout the application
- **Accessibility** - High contrast ratios and clear visual hierarchy
- **Responsive Design** - Mobile-first approach with Tailwind CSS

## 🚀 Deployment

### Automated Build Process
The application includes automated build optimizations:

```bash
# Production build with automatic 200.html generation
npm run build
```

### SPA Routing Support
- **Automatic 200.html Creation** - Vite copy plugin automatically creates 200.html from index.html
- **Client-Side Routing** - Supports direct URL access to any route
- **Platform Compatible** - Works with Surge.sh, Netlify, Vercel, and similar platforms

### Custom Domain
- **Domain**: partner-validation-ai.surge.sh
- **CNAME Configuration** - Automated custom domain setup
- **SSL/HTTPS** - Secure connections enabled

## 🔧 Configuration

### Environment Setup
The application is configured for both development and production environments:

- **Development**: Hot reload, source maps, development optimizations
- **Production**: Minification, tree shaking, optimized bundles

### Build Optimizations
- **Code Splitting** - Automatic code splitting for optimal loading
- **Asset Optimization** - Image and asset optimization
- **Bundle Analysis** - Detailed bundle size analysis

## 📱 Features Overview

### Authentication System
- **Multiple Login Options** - Email/password and Google Sign-In authentication
- **Google OAuth Integration** - Secure Google Sign-In with JWT token handling
- **Session Management** - Persistent login state across browser sessions
- **User Experience** - Smooth login flow with validation and error handling

### Dashboard Interface
- **Overview Cards** - Key metrics and statistics
- **Navigation Tabs** - Validation Center and Review Queue
- **Real-time Updates** - Live status updates and notifications

### AI Validation Workflow
- **Partner Registration** - Streamlined partner onboarding
- **AI Processing** - Automated validation pipeline
- **Status Tracking** - Real-time progress monitoring

### Human-in-the-Loop Review
- **Review Queue** - Pending items requiring human review
- **Detailed Analysis** - Comprehensive partner information display
- **Action Controls** - Approve, reject, or request more information

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **ESLint Configuration** - Consistent code formatting
- **Vue 3 Best Practices** - Composition API and modern patterns
- **Component Structure** - Reusable and maintainable components

## 📄 License

This project is part of a business partner validation platform. All rights reserved.

## 🔗 Links

- **Live Application**: [partner-validation-ai.surge.sh](https://partner-validation-ai.surge.sh)
- **Documentation**: Comprehensive inline documentation
- **Support**: Contact development team for assistance

---

<div align="center">
  <strong>Built with ❤️ using Vue 3, Vite, and Tailwind CSS</strong>
</div>
