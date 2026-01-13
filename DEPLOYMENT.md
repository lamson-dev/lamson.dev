# Deployment Guide

This site can be deployed to various hosting platforms. Below are the configuration details for each.

## Node.js Version Requirement

**Required**: Node.js >= 20.18.1

This project uses Astro 5, which requires Node.js 18.20.8 or higher. We recommend using Node.js 20.18.1 or later for the best compatibility.

## Cloudflare Pages

### Automatic Deployment

Cloudflare Pages will automatically detect the Node.js version from the `.node-version` file in the project root.

### Manual Configuration (if needed)

If the `.node-version` file is not respected, you can set the Node.js version in Cloudflare Pages:

1. Go to your Cloudflare Pages project settings
2. Navigate to **Settings** > **Environment Variables**
3. Add a new variable:
   - **Variable name**: `NODE_VERSION`
   - **Value**: `20.18.1`
4. Save and redeploy

### Build Configuration

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node.js version**: 20.18.1 (from `.node-version`)

### Environment Variables

If you need to set any environment variables:

1. Go to **Settings** > **Environment Variables**
2. Add your variables for Production/Preview environments
3. Redeploy to apply changes

## GitHub Pages

GitHub Pages deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`).

### Configuration

- **Node.js version**: 20 (configured in workflow)
- **Branch**: Deploys from `master` branch
- **Deploy trigger**: Automatic on push to `master`

### Manual Deployment

The workflow runs automatically, but you can also trigger it manually:

1. Go to **Actions** tab in GitHub
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

## Vercel

### Build Configuration

```bash
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 20.x
```

### Automatic Detection

Vercel will automatically detect:
- The build command from `package.json`
- The Node.js version from `.nvmrc` or `.node-version`
- The output directory

## Netlify

### Build Configuration

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20.18.1"
```

Or in the Netlify UI:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: Set via `.nvmrc` file (automatically detected)

## Local Preview

To preview the production build locally:

```bash
npm run build
npm run preview
```

This will serve the built site at `http://localhost:4321`

## Troubleshooting

### Node.js Version Errors

If you see errors like:
```
Node.js vX.X.X is not supported by Astro!
Please upgrade Node.js to a supported version: ">=18.20.8"
```

**Solutions:**

1. **Check your deployment platform's Node.js version**:
   - Cloudflare Pages: Set `NODE_VERSION` environment variable
   - Vercel/Netlify: Should auto-detect from `.node-version` or `.nvmrc`
   - GitHub Actions: Already configured in workflow files

2. **Local development**:
   ```bash
   # Using nvm
   nvm use 20.18.1

   # Or install if needed
   nvm install 20.18.1
   ```

3. **Verify version files exist**:
   - `.node-version` - Contains: `20.18.1`
   - `.nvmrc` - Contains: `20.18.1`

### Build Failures

If the build fails:

1. Check Node.js version meets requirements (>= 20.18.1)
2. Clear cache and reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Try building locally first: `npm run build`
4. Check build logs for specific errors

### Font Loading Issues

If OG images fail to generate due to font loading:
- This is expected in restricted network environments
- The build will continue with placeholder images
- Fonts are fetched from 1001fonts.com with timeout and error handling

## Production Checklist

Before deploying to production:

- [ ] Node.js version >= 20.18.1 configured
- [ ] All tests pass locally (`npm test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Environment variables set (if any)
- [ ] Domain/DNS configured (if custom domain)

## Need Help?

- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
