# Loan My Tools - Netlify Deployment Guide

## Environment Variables Setup

This project requires Supabase credentials to function. You have two options for deployment:

### Option 1: Using Netlify Environment Variables (Recommended) ⭐

This project uses `netlify-plugin-use-env-in-runtime` to securely inject environment variables at runtime.

1. Deploy your site to Netlify (see Deployment Steps below)
2. Go to your Netlify site dashboard
3. Navigate to **Site settings** > **Environment variables**
4. Add the following variables:
   - `SUPABASE_URL`: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - `SUPABASE_ANON_KEY`: Your Supabase anon/public key
5. Redeploy your site (Netlify will automatically use these variables)

**Benefits:**
- ✅ No credentials in your code
- ✅ Easy to update without code changes
- ✅ Different values for different deploy contexts (production, preview, etc.)

### Option 2: Direct Configuration (For Local Development)

1. Open `config.js`
2. Replace `'YOUR_SUPABASE_URL'` and `'YOUR_SUPABASE_ANON_KEY'` with your actual credentials
3. This is useful for local testing, but Option 1 is recommended for production

## Getting Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** > **API**
4. Copy:
   - **Project URL** → Use as `SUPABASE_URL`
   - **anon/public key** → Use as `SUPABASE_ANON_KEY`

## Deployment Steps

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click **Add new site** > **Import an existing project**
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: (leave empty for static site)
   - **Publish directory**: `.`
6. Add environment variables (if using Option 1)
7. Click **Deploy site**

### Manual Deployment

If you prefer to deploy manually:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## Security Notes

- The `.env` file is gitignored to prevent accidentally committing secrets
- The Supabase anon key is safe to expose in client-side code (it's designed for this)
- Make sure Row Level Security (RLS) is enabled on your Supabase tables
- Never commit actual credentials to your repository

## Testing Locally

1. Copy `.env.example` to `.env`
2. Add your Supabase credentials
3. Open `index.html` in a browser or use a local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```

## Troubleshooting

- **"Invalid API key"**: Check that your Supabase credentials are correct
- **CORS errors**: Make sure your Netlify URL is added to Supabase allowed origins
- **Database errors**: Verify your database schema matches `database-schema.sql`
