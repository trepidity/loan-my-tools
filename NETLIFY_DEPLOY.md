# Quick Netlify Deployment Checklist

## Before You Deploy

1. **Get your Supabase credentials ready:**
   - Go to https://app.supabase.com
   - Select your project
   - Go to Settings > API
   - Copy your **Project URL** and **anon public key**
   - Keep these handy - you'll add them in Netlify's UI

2. **Commit your code:**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push
   ```

**Note:** You don't need to update `config.js` with your credentials! The plugin will inject them at runtime from Netlify's environment variables.

## Deploy to Netlify

### Option A: Via Netlify UI (Easiest)

1. Go to https://app.netlify.com
2. Click "Add new site" > "Import an existing project"
3. Choose your Git provider (GitHub, GitLab, etc.)
4. Select your `loan-my-tools` repository
5. Configure:
   - **Build command:** (leave empty)
   - **Publish directory:** `.`
6. Click "Deploy site"

### Option B: Via Netlify CLI

```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Login
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

## After Deployment

1. **Configure Environment Variables:**
   - Go to your Netlify site dashboard
   - Navigate to **Site settings** > **Environment variables**
   - Click **Add a variable**
   - Add `SUPABASE_URL` with your Supabase project URL
   - Add `SUPABASE_ANON_KEY` with your Supabase anon key
   - Click **Save**

2. **Trigger a Redeploy:**
   - Go to **Deploys** tab
   - Click **Trigger deploy** > **Deploy site**
   - Wait for deployment to complete

3. **Test Your Site:**
   - Your site will be live at `https://your-site-name.netlify.app`
   - Test all functionality:
     - Login/Signup
     - Create reservations
     - View calendar
     - Update trailer location

## Important Security Notes

- ✅ The `.env.example` file is just a template - it's safe to commit
- ✅ Your actual `.env` file is gitignored - never commit it
- ✅ Supabase anon keys are safe to expose in client-side code
- ⚠️ Make sure Row Level Security (RLS) is enabled on your Supabase tables

## Files Created

- `.env.example` - Template for environment variables
- `.gitignore` - Prevents committing sensitive files
- `netlify.toml` - Netlify configuration
- `DEPLOYMENT.md` - Detailed deployment guide
- `NETLIFY_DEPLOY.md` - This quick reference (you're reading it!)

## Troubleshooting

**Site deploys but shows errors:**
- Check browser console for errors
- Verify your Supabase credentials are correct in `config.js`

**Database errors:**
- Make sure you've run the `database-schema.sql` in your Supabase SQL editor
- Check that RLS policies are set up correctly

**Need help?**
- See `DEPLOYMENT.md` for detailed instructions
- Check Netlify deploy logs for build errors
