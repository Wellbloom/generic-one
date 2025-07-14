# GitHub Pages Deployment Guide

## 📋 Prerequisites

- Your code is pushed to GitHub repository `Wellbloom/generic-one`
- You have admin access to the repository

## 🚀 Deployment Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/Wellbloom/generic-one`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**

### 2. Push Your Code

Make sure all your changes are committed and pushed to the `main` branch:

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 3. GitHub Actions Will Automatically Deploy

- The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically trigger
- It will build your React app and deploy it to GitHub Pages
- You can monitor the deployment progress in the **Actions** tab of your repository

### 4. Access Your Site

Once deployment is complete, your site will be available at:
**https://wellbloom.github.io/generic-one/**

## 🛠️ What Was Set Up

1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
   - Automatically builds your React app when you push to `main`
   - Deploys the built files to GitHub Pages

2. **Vite Configuration** (`vite.config.ts`):
   - Updated to use correct base URL for GitHub Pages (`/generic-one/`)
   - Ensures all assets load correctly

3. **Routing Configuration**:
   - Your app is already set up to handle the `/jean-grey` route
   - The Vercel redirects will work for the main domain

## 🔧 Local Development

For local development, continue using:
```bash
npm run dev
```

This will still work on `http://localhost:8080` as before.

## 📱 Testing

After deployment, test these URLs:
- `https://wellbloom.github.io/generic-one/` - Main landing page
- `https://wellbloom.github.io/generic-one/jean-grey` - Jean Grey specific page

## 🚨 Troubleshooting

### If deployment fails:
1. Check the **Actions** tab in your GitHub repository
2. Look for any error messages in the workflow logs
3. Ensure your `package.json` has the correct build scripts

### If pages don't load correctly:
1. Make sure the base URL in `vite.config.ts` is set to `/generic-one/`
2. Check that all asset paths are relative

### If routing doesn't work:
1. GitHub Pages may need a `404.html` file for client-side routing
2. Consider using hash-based routing if needed

## 📄 Additional Files Created

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `GITHUB_PAGES_DEPLOYMENT.md` - This guide
- Updated `vite.config.ts` - Added base URL configuration

## 🎯 Next Steps

1. Push your changes to GitHub
2. Check the Actions tab for deployment status
3. Visit your live site at `https://wellbloom.github.io/generic-one/`
4. Test all functionality on the deployed site

Your React app is now set up for automatic deployment to GitHub Pages! 🎉 